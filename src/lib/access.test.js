import { canAccess, isSubscription, formatPrice, tierOf } from './access';

const free = { price: null, status: 'published' };
const sub = { price: 499, status: 'published' };
const draft = { price: null, status: 'draft' };

describe('canAccess', () => {
  it('lets anyone open published free courses', () => {
    expect(canAccess(null, free)).toBe(true);
  });
  it('blocks subscription courses for guests and free users', () => {
    expect(canAccess(null, sub)).toBe(false);
    expect(canAccess({ role: 'learner', plan: 'free' }, sub)).toBe(false);
  });
  it('opens subscription courses for premium and enterprise users', () => {
    expect(canAccess({ role: 'learner', plan: 'premium' }, sub)).toBe(true);
    expect(canAccess({ role: 'learner', plan: 'enterprise' }, sub)).toBe(true);
  });
  it('hides drafts from learners but not from admins', () => {
    expect(canAccess({ role: 'learner', plan: 'premium' }, draft)).toBe(false);
    expect(canAccess({ role: 'admin', plan: 'enterprise' }, draft)).toBe(true);
  });
  it('returns false for a missing course', () => {
    expect(canAccess(null, undefined)).toBe(false);
  });
});

describe('isSubscription', () => {
  it('is true only when price is a positive number', () => {
    expect(isSubscription({ price: 499 })).toBe(true);
    expect(isSubscription({ price: 1 })).toBe(true);
    expect(isSubscription({ price: 0 })).toBe(false);  // 0 treated as free
    expect(isSubscription({ price: null })).toBe(false);
    expect(isSubscription({ price: -5 })).toBe(false); // negative treated as free
    expect(isSubscription(null)).toBe(false);
  });
});

describe('formatPrice / tierOf', () => {
  it('formats prices and derives tier', () => {
    expect(formatPrice(null)).toBe('Free');
    expect(formatPrice(499)).toBe('₹499');
    expect(tierOf({ price: null })).toBe('free');
    expect(tierOf({ price: 499 })).toBe('premium');
  });
});
