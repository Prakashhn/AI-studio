import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AppProvider } from '../context/AppContext';
import { seed } from '../data/seed';

export function renderApp(route = '/', session = null) {
  const initial = { ...seed, session };
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppProvider initialState={initial}><App /></AppProvider>
    </MemoryRouter>
  );
}
