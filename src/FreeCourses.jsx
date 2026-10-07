import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { canAccess, tierOf } from './lib/access';

// Lists every free course (the counterpart to Premium.jsx).
// Free courses are open to everyone once published, so we mirror the same
// access rule used elsewhere: drafts are only visible to admins.
export default function FreeCourses() {
  const { state, user } = useApp();

  const freeCourses = useMemo(
    () =>
      state.courses.filter(
        (c) =>
          tierOf(c) === 'free' &&
          (user?.role === 'admin' || c.status === 'published'),
      ),
    [state.courses, user],
  );

  return (
    <section>
      <h1>Free courses</h1>
      <p className="lead">
        Start learning without a subscription. These courses are open to
        everyone — sign in or browse as a guest.
      </p>

      {freeCourses.length === 0 ? (
        <p role="status">No free courses are available right now.</p>
      ) : (
        <ul className="grid">
          {freeCourses.map((c) => {
            const lessonCount = c.lessons?.length ?? 0;
            const quizCount = c.quiz?.length ?? 0;
            const accessible = canAccess(user, c);
            return (
              <li key={c.id} className="card free">
                <div className="tags">
                  <span className="tag free">Free</span>
                  {c.status === 'draft' && (
                    <span className="tag draft">Draft</span>
                  )}
                  <span className="cat">{c.category}</span>
                </div>
                <h2>
                  <Link to={`/course/${c.id}`}>{c.title}</Link>
                </h2>
                <p>{c.summary}</p>
                <small className="free-meta">
                  {lessonCount > 0 && (
                    <span>
                      {lessonCount} lesson{lessonCount === 1 ? '' : 's'}
                    </span>
                  )}
                  {lessonCount > 0 && quizCount > 0 && <span> · </span>}
                  {quizCount > 0 && (
                    <span>
                      {quizCount} practice question
                      {quizCount === 1 ? '' : 's'}
                    </span>
                  )}
                </small>
                <small>
                  {accessible
                    ? 'You can open this course'
                    : 'Sign in to track your progress'}
                </small>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}