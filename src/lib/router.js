import { useEffect, useState } from 'react';

// Minimal hash router. Routes look like:
//   #/                      -> home
//   #/course/python         -> course overview
//   #/course/python/py-intro-> a lesson
// Hash routing needs no server config and works when hosted anywhere.

export function parseHash(hash) {
  const clean = (hash || '').replace(/^#\/?/, '');
  const parts = clean.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'course' && parts[1] && parts[2]) {
    return { name: 'lesson', courseId: parts[1], lessonId: parts[2] };
  }
  if (parts[0] === 'course' && parts[1]) {
    return { name: 'course', courseId: parts[1] };
  }
  return { name: 'home' };
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

export function navigate(path) {
  window.location.hash = path;
}
