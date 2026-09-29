export const PLANS = {
  free: { label: 'Free', price: '₹0', perks: ['All free courses', 'Practice quizzes'] },
  premium: { label: 'Premium', price: '₹499/mo', perks: ['Everything in Free', 'All premium courses', 'Exam mock tests'] },
  enterprise: { label: 'Enterprise', price: '₹2,499/mo', perks: ['Everything in Premium', 'Team seats', 'Priority support'] },
};

export const isPaid = (plan) => plan === 'premium' || plan === 'enterprise';

// A course is subscription-based when it has a positive price (in INR).
// Free courses have `price: null` (or 0); subscription courses have a positive number.
// Stricter than `price != null` so an admin typo (price: 0) doesn't quietly become a paid course.
export const isSubscription = (course) => course != null && Number(course.price) > 0;

// Display helpers
export const formatPrice = (price) => (price == null ? 'Free' : `₹${price}`);
export const tierOf = (course) => (course?.price == null ? 'free' : 'premium');

// Who can open this course RIGHT NOW.
// Admins always pass. Otherwise:
//   - course must be published
//   - free courses are open to anyone (logged in or guest)
//   - subscription courses are open to paid-plan users (premium/enterprise)
// Per-course subscription enforcement for free-plan users is handled separately
// once they have a purchase record (next milestone).
export function canAccess(user, course) {
  if (!course) return false;
  if (user?.role === 'admin') return true;
  if (course.status !== 'published') return false;
  if (!isSubscription(course)) return true;
  return Boolean(user) && isPaid(user.plan);
}
