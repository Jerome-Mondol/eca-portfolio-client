"use client";

/**
 * Synchronous resource store.
 *
 * Every dashboard page used to do `useState(loading=true)` + `useEffect` fetch,
 * so every navigation rendered a skeleton and waited on a network round trip
 * even when the server cache was hot.
 *
 * Instead: data lives in module memory keyed by a *stable* key. `useResource`
 * reads it synchronously during render, so a warm resource paints real content
 * on the very first frame — no spinner, no layout shift, no fetch.
 */

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

type Listener = () => void;

export type ResourceStatus = "idle" | "loading" | "ready" | "error";

/**
 * Immutable view of a resource, handed to `useSyncExternalStore`. A new object
 * is only allocated when something actually changes, so the snapshot stays
 * referentially stable between updates.
 */
export type Snapshot<T> = {
  data: T | undefined;
  status: ResourceStatus;
  error: unknown;
};

type Entry = {
  data: unknown;
  updatedAt: number;
  /** In-flight request, so concurrent callers share one network call. */
  pending: Promise<unknown> | null;
  status: ResourceStatus;
  error: unknown;
  snapshot: Snapshot<any>;
};

/** How long a value is considered fresh (no revalidation triggered on read). */
const FRESH_MS = 60_000;
/** How long a value may still be served while revalidating in the background. */
const STALE_MS = 10 * 60_000;
const PERSIST_PREFIX = "rs:";
const PERSIST_DEBOUNCE_MS = 800;

const entries = new Map<string, Entry>();
const listeners = new Map<string, Set<Listener>>();

/* -------------------------------------------------------------------------- */
/* subscriptions                                                              */
/* -------------------------------------------------------------------------- */

function subscribe(key: string, listener: Listener) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);
  return () => {
    set!.delete(listener);
    if (set!.size === 0) listeners.delete(key);
  };
}

function emit(key: string) {
  const set = listeners.get(key);
  if (!set) return;
  for (const l of set) l();
}

function getEntry(key: string): Entry {
  let entry = entries.get(key);
  if (!entry) {
    entry = {
      data: undefined,
      updatedAt: 0,
      pending: null,
      status: "idle",
      error: null,
      snapshot: { data: undefined, status: "idle", error: null },
    };
    entries.set(key, entry);
  }
  return entry;
}

/** Recompute the immutable snapshot and notify subscribers. */
function publish(entry: Entry) {
  entry.snapshot = { data: entry.data, status: entry.status, error: entry.error };
}

/** Snapshot returned for a key that has no entry yet. */
const EMPTY_SNAPSHOT: Snapshot<never> = { data: undefined, status: "idle", error: null };

/* -------------------------------------------------------------------------- */
/* persistence — debounced, so a burst of reads/writes costs one localStorage  */
/* write instead of one per request                                            */
/* -------------------------------------------------------------------------- */

let persistTimer: ReturnType<typeof setTimeout> | null = null;
let dirty = false;

function schedulePersist() {
  if (typeof window === "undefined") return;
  dirty = true;
  if (persistTimer) return;
  persistTimer = setTimeout(() => {
    persistTimer = null;
    if (!dirty) return;
    dirty = false;
    try {
      const payload: Record<string, { data: unknown; updatedAt: number }> = {};
      for (const [key, entry] of entries) {
        if (entry.updatedAt > 0) payload[key] = { data: entry.data, updatedAt: entry.updatedAt };
      }
      localStorage.setItem(`${PERSIST_PREFIX}all`, JSON.stringify(payload));
    } catch {
      /* quota exceeded or unavailable — memory cache still works */
    }
  }, PERSIST_DEBOUNCE_MS);
}

function hydrateFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(`${PERSIST_PREFIX}all`);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, { data: unknown; updatedAt: number }>;
    const now = Date.now();
    for (const [key, slot] of Object.entries(parsed)) {
      // Skip anything past the stale window so we never serve ancient data.
      if (!slot || now - slot.updatedAt > STALE_MS) continue;
      const entry: Entry = {
        data: slot.data,
        updatedAt: slot.updatedAt,
        pending: null,
        status: "ready",
        error: null,
        snapshot: EMPTY_SNAPSHOT,
      };
      publish(entry);
      entries.set(key, entry);
    }
  } catch {
    /* ignore malformed cache */
  }
}

let hydrated = false;
function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  hydrateFromStorage();
}

if (typeof window !== "undefined") {
  ensureHydrated();
  // Keep tabs consistent without a refetch storm.
  window.addEventListener("storage", (e) => {
    if (e.key !== `${PERSIST_PREFIX}all` || !e.newValue) return;
    try {
      const parsed = JSON.parse(e.newValue) as Record<string, { data: unknown; updatedAt: number }>;
      for (const [key, slot] of Object.entries(parsed)) {
        const existing = entries.get(key);
        if (existing && existing.updatedAt >= slot.updatedAt) continue;
        const entry = getEntry(key);
        entry.data = slot.data;
        entry.updatedAt = slot.updatedAt;
        entry.status = "ready";
        entry.error = null;
        publish(entry);
        emit(key);
      }
    } catch {
      /* ignore */
    }
  });
}

/* -------------------------------------------------------------------------- */
/* public read/write API                                                       */
/* -------------------------------------------------------------------------- */

/** Synchronous read. Returns `undefined` when the resource was never loaded. */
export function readResource<T>(key: string): T | undefined {
  ensureHydrated();
  return entries.get(key)?.data as T | undefined;
}

export function isResourceFresh(key: string) {
  const entry = entries.get(key);
  return !!entry && entry.updatedAt > 0 && Date.now() - entry.updatedAt < FRESH_MS;
}

/** Write straight into the store. Notifies subscribers synchronously. */
export function writeResource<T>(key: string, data: T): T {
  const entry = getEntry(key);
  entry.data = data;
  entry.updatedAt = Date.now();
  entry.status = "ready";
  entry.error = null;
  schedulePersist();
  publish(entry);
  emit(key);
  return data;
}

/**
 * Drop a resource, or every resource whose key starts with `prefix`.
 * Optionally revalidate in the background so the UI refills without a spinner.
 */
export function invalidateResource(prefix?: string, revalidate?: (key: string) => void) {
  const keys = prefix ? [...entries.keys()].filter((k) => k.startsWith(prefix)) : [...entries.keys()];
  for (const key of keys) {
    entries.delete(key);
    emit(key);
    revalidate?.(key);
  }
}

export function clearResourceStore() {
  entries.clear();
  for (const key of [...listeners.keys()]) emit(key);
  listeners.clear();
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(`${PERSIST_PREFIX}all`);
    } catch {
      /* ignore */
    }
  }
}

/* -------------------------------------------------------------------------- */
/* fetch orchestration                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Read-through with stale-while-revalidate.
 *
 * - fresh  → return immediately, no request
 * - stale  → return immediately, refresh in the background
 * - absent → await the request (and share it with any concurrent caller)
 */
export function loadResource<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const entry = getEntry(key);
  if (entry.pending) return entry.pending as Promise<T>;

  if (entry.updatedAt > 0) {
    const age = Date.now() - entry.updatedAt;
    if (age < FRESH_MS) return Promise.resolve(entry.data as T);
    if (age < STALE_MS) {
      // Serve stale now, correct it quietly.
      revalidate(key, fetcher);
      return Promise.resolve(entry.data as T);
    }
  }

  const request = (async () => {
    entry.status = "loading";
    entry.error = null;
    publish(entry);
    emit(key);
    try {
      const data = await fetcher();
      writeResource(key, data);
      return data;
    } catch (err) {
      // Keep showing whatever we had rather than blanking the UI.
      if (entry.updatedAt > 0) {
        entry.status = "ready";
        entry.error = null;
        publish(entry);
        emit(key);
        return entry.data as T;
      }
      entry.status = "error";
      entry.error = err;
      publish(entry);
      emit(key);
      throw err;
    } finally {
      entry.pending = null;
    }
  })();

  entry.pending = request;
  return request as Promise<T>;
}

function revalidate(key: string, fetcher: () => Promise<unknown>) {
  const entry = getEntry(key);
  if (entry.pending) return;
  const request = (async () => {
    try {
      const data = await fetcher();
      // Only accept the refresh if the entry was not replaced meanwhile.
      if (entries.get(key) === entry) writeResource(key, data);
    } catch {
      /* keep serving stale data */
    } finally {
      entry.pending = null;
    }
  })();
  entry.pending = request;
}

/* -------------------------------------------------------------------------- */
/* hook                                                                       */
/* -------------------------------------------------------------------------- */

export type Resource<T> = Snapshot<T> & {
  /** True only while there is nothing to render yet (no cached, no in-flight result). */
  loading: boolean;
  error: unknown;
  /** Replace the cached value — used to make mutations feel instant. */
  set: (next: T | ((prev: T | undefined) => T)) => void;
  /** Force a refetch, clearing the cached value first. */
  refresh: () => Promise<T | undefined>;
};

export function useResource<T>(key: string, fetcher: () => Promise<T>): Resource<T> {
  ensureHydrated();

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const subscribeKey = useCallback((cb: Listener) => subscribe(key, cb), [key]);
  // Never allocates during render: a missing entry yields a shared constant.
  const getSnapshot = useCallback(
    () => (entries.get(key)?.snapshot ?? EMPTY_SNAPSHOT) as Snapshot<T>,
    [key]
  );
  const snapshot = useSyncExternalStore(subscribeKey, getSnapshot, getSnapshot);

  const startedFor = useRef<string | null>(null);
  useEffect(() => {
    if (startedFor.current === key) return;
    startedFor.current = key;
    loadResource(key, () => fetcherRef.current()).catch(() => {
      /* surfaced through the snapshot's error field */
    });
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T | undefined) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (prev: T | undefined) => T)(readResource<T>(key)) : next;
      writeResource(key, resolved);
    },
    [key]
  );

  const refresh = useCallback(async () => {
    invalidateResource(key);
    return loadResource(key, () => fetcherRef.current()).catch(() => undefined);
  }, [key]);

  const loading = snapshot.data === undefined && snapshot.status !== "error";
  return { ...snapshot, loading, set, refresh };
}

/**
 * Run a callback when the browser is idle. Used to warm caches without
 * competing with whatever the user is actually doing.
 */
export function onIdle(fn: () => void, timeout = 2000) {
  if (typeof window === "undefined") return;
  const ric = (window as any).requestIdleCallback;
  if (typeof ric === "function") ric(fn, { timeout });
  else setTimeout(fn, 1);
}
