export const PLANS = {
  free: { label: 'Free', price: '₹0', perks: ['All free courses', 'Practice quizzes'] },
  premium: { label: 'Premium', price: '₹499/mo', perks: ['Everything in Free', 'All premium courses', 'Exam mock tests'] },
  enterprise: { label: 'Enterprise', price: '₹2,499/mo', perks: ['Everything in Premium', 'Team seats', 'Priority support'] },
};

export const isPaid = (plan) => plan === 'premium' || plan === 'enterprise';

export function canAccess(user, course) {
  if (!course) return false;
  if (user?.role === 'admin') return true;
  if (course.status !== 'published') return false;
  if (course.tier === 'free') return true;
  return Boolean(user) && isPaid(user.plan);
}
