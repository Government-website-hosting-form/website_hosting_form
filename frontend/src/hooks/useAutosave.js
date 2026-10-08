import { useEffect, useRef } from "react";


export default function useAutosave(deps, saveFn, { delay = 1500, enabled = true } = {}) {
  const saveRef = useRef(saveFn);
  saveRef.current = saveFn; // always call the latest version of saveFn

  const skipFirst = useRef(true);
  const timer = useRef(null);
  const busy = useRef(false);
  const queued = useRef(false);

  async function run() {
    if (busy.current) {
      queued.current = true;
      return;
    }
    busy.current = true;
    try {
      await saveRef.current();
    } catch (err) {
      console.error("Autosave failed:", err);
    } finally {
      busy.current = false;
      if (queued.current) {
        queued.current = false;
        run();
      }
    }
  }

  useEffect(() => {
    // Don't save on first render (nothing has changed yet).
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    if (!enabled) return;

    clearTimeout(timer.current);
    timer.current = setTimeout(run, delay);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}