import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seed';
import { canAccess } from '../lib/access';

export default function Catalog() {
  const { state, user } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [tier, setTier] = useState('all');

  const list = useMemo(() => state.courses.filter((c) =>
    (user?.role === 'admin' || c.status === 'published') &&
    (category === 'All' || c.category === category) &&
    (tier === 'all' || c.tier === tier) &&
    (c.title + ' ' + c.summary).toLowerCase().includes(query.trim().toLowerCase())
  ), [state.courses, user, query, category, tier]);

  return (
    <section>
      <h1>Learn testing, pass your exams</h1>
      <p className="lead">Free material to start. Premium courses when you want mock tests and deeper tool training.</p>
      <div className="filters">
        <label>Search courses
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Selenium" />
        </label>
        <label>Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {['All', ...CATEGORIES].map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Access
          <select value={tier} onChange={(e) => setTier(e.target.value)}>
            <option value="all">Free and premium</option>
            <option value="free">Free only</option>
            <option value="premium">Premium only</option>
          </select>
        </label>
      </div>
      {list.length === 0 && <p role="status">No courses match. Clear the search or pick another category.</p>}
      <ul className="grid">
        {list.map((c) => (
          <li key={c.id} className={`card ${c.tier}`}>
            <div className="tags">
              <span className={`tag ${c.tier}`}>{c.tier === 'free' ? 'Free' : 'Premium'}</span>
              {c.status === 'draft' && <span className="tag draft">Draft</span>}
              <span className="cat">{c.category}</span>
            </div>
            <h2><Link to={`/course/${c.id}`}>{c.title}</Link></h2>
            <p>{c.summary}</p>
            <small>{canAccess(user, c) ? 'You can open this course' : 'Upgrade to unlock'}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
