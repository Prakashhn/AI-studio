import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seed';
import { canAccess, formatPrice, isSubscription } from '../lib/access';

export default function Catalog() {
  const { state, user } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [tier, setTier] = useState('all'); // 'all' | 'free' | 'subscription'

  const list = useMemo(() => state.courses.filter((c) =>
    (user?.role === 'admin' || c.status === 'published') &&
    (category === 'All' || c.category === category) &&
    (tier === 'all' ||
      (tier === 'free' && !isSubscription(c)) ||
      (tier === 'subscription' && isSubscription(c))) &&
    (c.title + ' ' + c.summary).toLowerCase().includes(query.trim().toLowerCase())
  ), [state.courses, user, query, category, tier]);

  return (
    <section>
      <h1>Learn testing, pass your exams</h1>
      <p className="lead">Free material to start. Subscription courses when you want mock tests and deeper tool training.</p>
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
            <option value="all">Free and subscription</option>
            <option value="free">Free only</option>
            <option value="subscription">Subscription only</option>
          </select>
        </label>
      </div>
      {list.length === 0 && <p role="status">No courses match. Clear the search or pick another category.</p>}
      <ul className="grid">
        {list.map((c) => {
          const sub = isSubscription(c);
          return (
            <li key={c.id} className={`card ${sub ? 'premium' : 'free'}`}>
              <div className="tags">
                <span className={`tag ${sub ? 'premium' : 'free'}`}>
                  {sub ? `Subscription · ${formatPrice(c.price)}` : 'Free'}
                </span>
                {c.status === 'draft' && <span className="tag draft">Draft</span>}
                <span className="cat">{c.category}</span>
              </div>
              <h2><Link to={`/course/${c.id}`}>{c.title}</Link></h2>
              <p>{c.summary}</p>
              <small>{canAccess(user, c) ? 'You can open this course' : 'Subscribe to unlock'}</small>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
