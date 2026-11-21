import { useCallback, useEffect, useState } from 'react';

const KEY = 'learncode.progress.v1';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { completed: {} };
  } catch {
    return { completed: {} };
  }
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

// Shared progress state across the app via a storage-backed hook.
export function useProgress() {
  const [state, setState] = useState(load);

  // Keep multiple tabs/components in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setState(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const markComplete = useCallback((courseId, lessonId) => {
    setState((prev) => {
      const next = {
        ...prev,
        completed: { ...prev.completed, [`${courseId}/${lessonId}`]: true },
      };
      save(next);
      return next;
    });
  }, []);

  const isComplete = useCallback(
    (courseId, lessonId) => Boolean(state.completed[`${courseId}/${lessonId}`]),
    [state]
  );

  const reset = useCallback(() => {
    const next = { completed: {} };
    save(next);
    setState(next);
  }, []);

  return { state, markComplete, isComplete, reset };
}
