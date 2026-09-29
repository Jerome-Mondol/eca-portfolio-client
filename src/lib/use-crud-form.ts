"use client";

import { useCallback, useState } from "react";

type CrudFormOptions<T> = {
  /** Empty field values for a new record. Keep this a module-level constant. */
  blank: Record<string, string>;
  /** Projects an existing record back into field values. Also module-level. */
  toForm: (item: T) => Record<string, string>;
};

export type CrudForm<T> = {
  open: boolean;
  editing: T | null;
  isEditing: boolean;
  values: Record<string, string>;
  saving: boolean;
  set: (key: string, value: string) => void;
  setSaving: (saving: boolean) => void;
  close: () => void;
  startCreate: () => void;
  startEdit: (item: T) => void;
  toggle: () => void;
};

/**
 * The form state machine shared by every dashboard CRUD screen.
 *
 * Open/closed, editing-or-creating, a bag of string fields, and a save in
 * flight is the same sequence on all of them, so it lives here instead of being
 * rewritten as a dozen `useState` calls per page. Only the field list and the
 * payload mapping vary, and those stay in the page that owns them.
 *
 * `blank` and `toForm` must be module-level constants rather than inline
 * literals, otherwise every render produces new references and the returned
 * callbacks lose their identity.
 */
export function useCrudForm<T>({ blank, toForm }: CrudFormOptions<T>): CrudForm<T> {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [values, setValues] = useState<Record<string, string>>(blank);
  const [saving, setSaving] = useState(false);

  const set = useCallback((key: string, value: string) => {
    setValues((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  const close = useCallback(() => {
    setValues(blank);
    setEditing(null);
    setOpen(false);
  }, [blank]);

  const startCreate = useCallback(() => {
    setValues(blank);
    setEditing(null);
    setOpen(true);
  }, [blank]);

  const startEdit = useCallback((item: T) => {
    setEditing(item);
    setValues(toForm(item));
    setOpen(true);
  }, [toForm]);

  const toggle = useCallback(() => {
    if (open) close();
    else startCreate();
  }, [open, close, startCreate]);

  return {
    open,
    editing,
    isEditing: editing !== null,
    values,
    saving,
    set,
    setSaving,
    close,
    startCreate,
    startEdit,
    toggle,
  };
}
