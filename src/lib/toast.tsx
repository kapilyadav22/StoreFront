"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type Toast = { id: string; title: string; description?: string; variant?: "success" | "error" | "info" };

type ToastContextValue = {
  toasts: Toast[];
  addToast: (t: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 10);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3000);
  }, []);

  const removeToast = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-80 flex-col gap-2" role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-lg border p-3 shadow backdrop-blur ${t.variant === "error" ? "border-red-200 bg-red-50/80 dark:bg-red-900/30" : t.variant === "success" ? "border-green-200 bg-green-50/80 dark:bg-green-900/30" : "border-black/10 bg-white/80 dark:bg-white/10"}`}
          >
            <div className="text-sm font-medium">{t.title}</div>
            {t.description ? <div className="mt-1 text-xs opacity-80">{t.description}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}


