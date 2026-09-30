import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { state, dispatch } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const u = state.users.find((x) => x.email === email.trim().toLowerCase() && x.password === password);
    if (!u) return setError('Email or password is incorrect. Check both and try again.');
    dispatch({ type: 'login', email: u.email });
    nav(u.role === 'admin' ? '/admin' : '/');
  };

  return (
    <section className="narrow">
      <h1>Log in</h1>
      <form onSubmit={submit}>
        <label>Email <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error && <p role="alert" className="err">{error}</p>}
        <button className="btn" type="submit">Log in</button>
      </form>
      <p className="hint">Demo: learner@techskeleton.com / learn123, admin@techskeleton.com / admin123</p>
    </section>
  );
}
