import { createContext, useContext, useEffect, useReducer } from 'react';
import { seed } from '../data/seed';

const KEY = 'techskeleton:v1';
const Ctx = createContext(null);

export function reducer(s, a) {
  switch (a.type) {
    case 'login': return { ...s, session: a.email };
    case 'logout': return { ...s, session: null };
    case 'upgrade':
      return { ...s, users: s.users.map((u) => (u.email === s.session ? { ...u, plan: a.plan } : u)) };
    case 'addCourse': return { ...s, courses: [...s.courses, a.course] };
    case 'togglePublish':
      return { ...s, courses: s.courses.map((c) => c.id === a.id ? { ...c, status: c.status === 'published' ? 'draft' : 'published' } : c) };
    case 'deleteCourse': return { ...s, courses: s.courses.filter((c) => c.id !== a.id) };
    case 'saveResult': return { ...s, results: { ...s.results, [`${s.session}:${a.courseId}`]: a.score } };
    default: return s;
  }
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || seed; } catch { return seed; }
}

export function AppProvider({ children, initialState }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => init || load());
  useEffect(() => {
    if (initialState) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  }, [state, initialState]);
  const user = state.users.find((u) => u.email === state.session) || null;
  return <Ctx.Provider value={{ state, dispatch, user }}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);
