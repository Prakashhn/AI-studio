import { reducer } from './AppContext';
import { seed } from '../data/seed';

describe('reducer', () => {
  it('toggles publish state', () => {
    const s = reducer(seed, { type: 'togglePublish', id: 'cypress-deep-dive' });
    expect(s.courses.find((c) => c.id === 'cypress-deep-dive').status).toBe('published');
  });
  it('adds and deletes a course', () => {
    const added = reducer(seed, { type: 'addCourse', course: { id: 'x', title: 'X' } });
    expect(added.courses).toHaveLength(seed.courses.length + 1);
    expect(reducer(added, { type: 'deleteCourse', id: 'x' }).courses).toHaveLength(seed.courses.length);
  });
  it('upgrades only the logged-in user', () => {
    const s = reducer({ ...seed, session: 'learner@techskeleton.com' }, { type: 'upgrade', plan: 'premium' });
    expect(s.users.find((u) => u.email === 'learner@techskeleton.com').plan).toBe('premium');
    expect(s.users.find((u) => u.email === 'pro@techskeleton.com').plan).toBe('premium');
    expect(s.users.find((u) => u.email === 'admin@techskeleton.com').plan).toBe('enterprise');
  });
});
