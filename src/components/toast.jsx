import { useState, useRef, useEffect, useCallback } from "react";

/** Toast state + a `showToast(type, msg)` trigger that auto-hides after 4s. */
export function useToast() {
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
  const timer = useRef(null);

  const showToast = useCallback((type, msg) => {
    setToast({ show: true, type, msg });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { toast, showToast };
}

export function Toast({ toast }) {
  return (
    <div className={`toast toast-${toast.type} ${toast.show ? "show" : ""}`}>
      {toast.msg}
    </div>
  );
}
