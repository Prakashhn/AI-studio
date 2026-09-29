import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seed';
import { formatPrice, isSubscription } from '../lib/access';

// Helpers for the create form.
const blankDraft = { title: '', category: CATEGORIES[0], type: 'free', price: '', summary: '', lesson: '' };

// Build a normalized patch from an in-progress edit row.
// Keeps validation in one place (used by Save on both create and edit forms).
function buildPatch(form) {
  const patch = {
    title: form.title.trim(),
    category: form.category,
    summary: form.summary.trim(),
    status: form.status,
  };
  if (form.type === 'subscription') {
    const n = Number(form.price);
    patch.price = Number.isFinite(n) && n > 0 ? n : null;
  } else {
    patch.price = null;
  }
  return patch;
}

function validate(form) {
  if (!form.title.trim()) return 'Add a course title before saving.';
  if (form.type === 'subscription') {
    const n = Number(form.price);
    if (!form.price || !Number.isFinite(n) || n <= 0) return 'Enter a subscription price greater than 0.';
  }
  return null;
}

export default function Admin() {
  const { state, dispatch, user } = useApp();
  const [draft, setDraft] = useState(blankDraft);
  const [createMsg, setCreateMsg] = useState('');
  // Which course id (if any) is currently being edited. Only one row at a time.
  const [editingId, setEditingId] = useState(null);
  // The in-progress edit form values for the row currently being edited.
  const [editForm, setEditForm] = useState(null);
  const [editMsg, setEditMsg] = useState('');

  if (user?.role !== 'admin') {
    return <p role="alert">Admins only. <Link to="/login">Log in as an admin</Link></p>;
  }

  const setDraftField = (k) => (e) => setDraft({ ...draft, [k]: e.target.value });
  const setEditField = (k) => (e) => setEditForm({ ...editForm, [k]: e.target.value });

  // --- Create a new course (always starts as draft) ---
  const create = (e) => {
    e.preventDefault();
    const err = validate(draft);
    if (err) return setCreateMsg(err);
    const id = draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
    const patch = buildPatch(draft);
    dispatch({ type: 'addCourse', course: {
      id,
      title: patch.title,
      category: patch.category,
      price: patch.price,
      status: 'draft',
      summary: patch.summary,
      lessons: draft.lesson.trim() ? [{ title: 'Lesson 1', body: draft.lesson.trim() }] : [],
      quiz: [],
    } });
    setDraft(blankDraft);
    setCreateMsg(`Saved "${patch.title}" as a draft. Publish it when ready.`);
  };

  // --- Begin editing a course ---
  const startEdit = (c) => {
    setEditingId(c.id);
    setEditForm({
      title: c.title,
      category: c.category,
      type: isSubscription(c) ? 'subscription' : 'free',
      price: c.price == null ? '' : String(c.price),
      summary: c.summary,
      status: c.status,
    });
    setEditMsg('');
  };

  // --- Save edit ---
  const saveEdit = () => {
    const err = validate(editForm);
    if (err) return setEditMsg(err);
    const patch = buildPatch(editForm);
    dispatch({ type: 'editCourse', id: editingId, patch });
    setEditMsg(`Updated "${patch.title}".`);
    setEditingId(null);
    setEditForm(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setEditMsg('');
  };

  const published = state.courses.filter((c) => c.status === 'published').length;

  return (
    <section>
      <h1>Course admin</h1>
      <p className="lead">{state.courses.length} courses, {published} published.</p>

      {/* ---------- Create form ---------- */}
      <h2>Create a course</h2>
      <form onSubmit={create} className="adminform">
        <label>Course title <input value={draft.title} onChange={setDraftField('title')} /></label>
        <label>Category
          <select value={draft.category} onChange={setDraftField('category')}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        <fieldset>
          <legend>Type</legend>
          <label className="opt">
            <input type="radio" name="newtype" value="free"
              checked={draft.type === 'free'} onChange={setDraftField('type')} /> Free
          </label>
          <label className="opt">
            <input type="radio" name="newtype" value="subscription"
              checked={draft.type === 'subscription'} onChange={setDraftField('type')} /> Subscription
          </label>
        </fieldset>

        {draft.type === 'subscription' && (
          <label>Subscription price (₹ per month)
            <input type="number" min="1" step="1" inputMode="numeric"
              value={draft.price} onChange={setDraftField('price')} placeholder="e.g. 499" />
          </label>
        )}

        <label>Summary <input value={draft.summary} onChange={setDraftField('summary')} /></label>
        <label>First lesson <textarea value={draft.lesson} onChange={setDraftField('lesson')} rows={3} /></label>
        <button className="btn" type="submit">Save draft</button>
        {createMsg && <p role="status">{createMsg}</p>}
      </form>

      {/* ---------- Courses table ---------- */}
      <h2>Courses</h2>
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Type</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.courses.map((c) => {
            const isEditing = editingId === c.id;
            if (isEditing) {
              const sub = editForm.type === 'subscription';
              return (
                <tr key={c.id} className="editrow">
                  <td>
                    <label className="narrow">Title
                      <input value={editForm.title} onChange={setEditField('title')} />
                    </label>
                    <label className="narrow">Summary
                      <input value={editForm.summary} onChange={setEditField('summary')} />
                    </label>
                  </td>
                  <td>
                    <fieldset>
                      <label className="opt">
                        <input type="radio" name={`type-${c.id}`} value="free"
                          checked={editForm.type === 'free'} onChange={setEditField('type')} /> Free
                      </label>
                      <label className="opt">
                        <input type="radio" name={`type-${c.id}`} value="subscription"
                          checked={editForm.type === 'subscription'} onChange={setEditField('type')} /> Sub
                      </label>
                    </fieldset>
                  </td>
                  <td>
                    {sub
                      ? <label className="narrow">₹ <input type="number" min="1" step="1"
                          value={editForm.price} onChange={setEditField('price')} /></label>
                      : <span className="hint">—</span>}
                  </td>
                  <td>
                    <select value={editForm.status} onChange={setEditField('status')}>
                      <option value="draft">draft</option>
                      <option value="published">published</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn small" onClick={saveEdit}>Save</button>
                    <button className="ghost small" onClick={cancelEdit}>Cancel</button>
                    {editMsg && <p className="err" role="status">{editMsg}</p>}
                  </td>
                </tr>
              );
            }

            // Read-only row.
            const sub = isSubscription(c);
            return (
              <tr key={c.id}>
                <td>
                  <strong>{c.title}</strong>
                  <div className="hint">{c.category} · {c.summary}</div>
                </td>
                <td>{sub ? 'Subscription' : 'Free'}</td>
                <td>{sub ? formatPrice(c.price) : '—'}</td>
                <td>{c.status}</td>
                <td>
                  <button className="ghost"
                    onClick={() => dispatch({ type: 'togglePublish', id: c.id })}>
                    {c.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="ghost" onClick={() => startEdit(c)}>Edit</button>
                  <button className="ghost danger"
                    onClick={() => dispatch({ type: 'deleteCourse', id: c.id })}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {editMsg && editingId === null && <p role="status">{editMsg}</p>}
    </section>
  );
}