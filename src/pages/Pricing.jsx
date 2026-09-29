import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PLANS } from '../lib/access';

export default function Pricing() {
  const { user, dispatch } = useApp();
  const nav = useNavigate();
  const choose = (plan) => {
    if (!user) return nav('/login');
    dispatch({ type: 'upgrade', plan });
  };
  return (
    <section>
      <h1>Choose a plan</h1>
      <p className="lead">Payments are simulated in this demo. Switching plan takes effect instantly.</p>
      <ul className="grid">
        {Object.entries(PLANS).map(([key, p]) => (
          <li key={key} className={`card ${key === 'free' ? 'free' : 'premium'}`}>
            <h2>{p.label}</h2>
            <p className="price">{p.price}</p>
            <ul>{p.perks.map((perk) => <li key={perk}>{perk}</li>)}</ul>
            {user?.plan === key
              ? <p role="status">Your current plan</p>
              : <button className="btn" onClick={() => choose(key)}>Choose {p.label}</button>}
          </li>
        ))}
      </ul>
    </section>
  );
}
