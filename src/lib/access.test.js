import { canAccess } from './access';

const free = { tier: 'free', status: 'published' };
const prem = { tier: 'premium', status: 'published' };
const draft = { tier: 'free', status: 'draft' };

describe('canAccess', () => {
  it('lets anyone open published free courses', () => {
    expect(canAccess(null, free)).toBe(true);
  });
  it('blocks premium courses for guests and free users', () => {
    expect(canAccess(null, prem)).toBe(false);
    expect(canAccess({ role: 'learner', plan: 'free' }, prem)).toBe(false);
  });
  it('opens premium courses for premium and enterprise users', () => {
    expect(canAccess({ role: 'learner', plan: 'premium' }, prem)).toBe(true);
    expect(canAccess({ role: 'learner', plan: 'enterprise' }, prem)).toBe(true);
  });
  it('hides drafts from learners but not from admins', () => {
    expect(canAccess({ role: 'learner', plan: 'premium' }, draft)).toBe(false);
    expect(canAccess({ role: 'admin', plan: 'enterprise' }, draft)).toBe(true);
  });
  it('returns false for a missing course', () => {
    expect(canAccess(null, undefined)).toBe(false);
  });
});
