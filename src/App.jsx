import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Catalog from './pages/Catalog';
import CourseDetail from './pages/CourseDetail';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Admin from './pages/Admin';

export default function App() {
  const { user, dispatch } = useApp();
  return (
    <>
      <header className="bar">
        <Link to="/" className="brand">Techskeleton</Link>
        <nav aria-label="Main">
          <NavLink to="/" end>Courses</NavLink>
          <NavLink to="/pricing">Plans</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="who">
          {user ? (
            <>
              <span>{user.name} · {user.plan}</span>
              <button className="ghost" onClick={() => dispatch({ type: 'logout' })}>Log out</button>
            </>
          ) : (
            <Link className="btn" to="/login">Log in</Link>
          )}
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<p role="alert">Page not found. <Link to="/">Go to courses</Link></p>} />
        </Routes>
      </main>
    </>
  );
}
