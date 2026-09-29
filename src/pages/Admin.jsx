import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seed';

const empty = { title: '', category: CATEGORIES[0], tier: 'free', summary: '', lesson: '' };

export default function Admin() {
  const { state, dispatch, user } = useApp();
  const [f, setF] = useState(empty);
  const [msg, setMsg] = useState('');
  if (user?.role !== 'admin') {
    return <p role="alert">Admins only. <Link to="/login">Log in as an admin</Link></p>;
  }
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const add = (e) => {
    e.preventDefault();
    if (!f.title.trim()) return setMsg('Add a course title before saving.');
    const id = f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
    dispatch({ type: 'addCourse', course: {
      id, title: f.title.trim(), category: f.category, tier: f.tier, status: 'draft',
      summary: f.summary.trim(),
      lessons: f.lesson.trim() ? [{ title: 'Lesson 1', body: f.lesson.trim() }] : [], quiz: [],
    } });
    setF(empty);
    setMsg(`Saved "${f.title.trim()}" as a draft. Publish it when ready.`);
  };

  const published = state.courses.filter((c) => c.status === 'published').length;
  return (
    <section>
      <h1>Course admin</h1>
      <p className="lead">{state.courses.length} courses, {published} published.</p>
      <form onSubmit={add} className="adminform">
        <label>Course title <input value={f.title} onChange={set('title')} /></label>
        <label>Category
          <select value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label>Access
          <select value={f.tier} onChange={set('tier')}><option value="free">Free</option><option value="premium">Premium</option></select>
        </label>
        <label>Summary <input value={f.summary} onChange={set('summary')} /></label>
        <label>First lesson <textarea value={f.lesson} onChange={set('lesson')} rows={3} /></label>
        <button className="btn" type="submit">Save draft</button>
        {msg && <p role="status">{msg}</p>}
      </form>
      <table>
        <thead><tr><th>Course</th><th>Access</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {state.courses.map((c) => (
            <tr key={c.id}>
              <td>{c.title}</td><td>{c.tier}</td><td>{c.status}</td>
              <td>
                <button className="ghost" onClick={() => dispatch({ type: 'togglePublish', id: c.id })}>
                  {c.status === 'published' ? 'Unpublish' : 'Publish'} {c.title}
                </button>
                <button className="ghost danger" onClick={() => dispatch({ type: 'deleteCourse', id: c.id })}>
                  Delete {c.title}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
