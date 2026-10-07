import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { canAccess, formatPrice, isSubscription } from './lib/access';

// Lists every premium (subscription) course and surfaces its prime duration
// prominently on each card. Drafts are hidden from guests but visible to
// admins — same access rule as the rest of the catalog.
export default function Premium() {
  const { state, user } = useApp();

  const premiumCourses = useMemo(
    () =>
      state.courses.filter(
        (c) =>
          isSubscription(c) &&
          (user?.role === 'admin' || c.status === 'published'),
      ),
    [state.courses, user],
  );

  return (
    <section>
      <h1>Premium subscription courses</h1>
      <p className="lead">
        Unlock deeper training and exam prep with our premium catalog. Each card
        shows the prime duration so you know how long you have access.
      </p>

      {premiumCourses.length === 0 ? (
        <p role="status">No premium courses are available right now.</p>
      ) : (
        <ul className="grid">
          {premiumCourses.map((c) => {
            const accessible = canAccess(user, c);
            return (
              <li key={c.id} className="card premium">
                <div className="tags">
                  <span className="tag premium">
                    Premium · {formatPrice(c.price)}
                  </span>
                  {c.status === 'draft' && (
                    <span className="tag draft">Draft</span>
                  )}
                  <span className="cat">{c.category}</span>
                </div>
                <h2>
                  <Link to={`/course/${c.id}`}>{c.title}</Link>
                </h2>
                <p>{c.summary}</p>
                <p className="prime-duration" aria-label="Prime duration">
                  <span className="prime-duration__label">Prime duration</span>
                  <span className="prime-duration__value">
                    {c.primeDuration || 'Self-paced'}
                  </span>
                </p>
                <small>
                  {accessible
                    ? 'You can open this course'
                    : 'Subscribe to unlock'}
                </small>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}