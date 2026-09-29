import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { canAccess } from '../lib/access';

export default function CourseDetail() {
  const { id } = useParams();
  const { state, dispatch, user } = useApp();
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const course = state.courses.find((c) => c.id === id);

  if (!course || (course.status !== 'published' && user?.role !== 'admin')) {
    return <p role="alert">Course not found. <Link to="/">Back to courses</Link></p>;
  }
  if (!canAccess(user, course)) {
    return (
      <section className="locked">
        <h1>{course.title}</h1>
        <p>{course.summary}</p>
        <p role="status">This is a premium course.</p>
        {user
          ? <Link className="btn" to="/pricing">See plans to unlock</Link>
          : <Link className="btn" to="/login">Log in to continue</Link>}
      </section>
    );
  }

  const submit = () => {
    const s = course.quiz.filter((item, i) => answers[i] === item.answer).length;
    setScore(s);
    if (user) dispatch({ type: 'saveResult', courseId: course.id, score: s });
  };

  return (
    <article>
      <Link to="/">← All courses</Link>
      <h1>{course.title}</h1>
      <p className="lead">{course.summary}</p>
      {course.lessons.map((l, i) => (
        <section key={i} className="lesson"><h2>{l.title}</h2><p>{l.body}</p></section>
      ))}
      {course.quiz.length > 0 && (
        <section className="quiz">
          <h2>Check your understanding</h2>
          {course.quiz.map((item, i) => (
            <fieldset key={i}>
              <legend>{item.q}</legend>
              {item.options.map((o, j) => (
                <label key={j} className="opt">
                  <input type="radio" name={`q${i}`} checked={answers[i] === j}
                    onChange={() => setAnswers({ ...answers, [i]: j })} /> {o}
                </label>
              ))}
            </fieldset>
          ))}
          <button className="btn" onClick={submit}>Submit answers</button>
          {score !== null && <p role="status">You scored {score} of {course.quiz.length}.</p>}
        </section>
      )}
    </article>
  );
}
