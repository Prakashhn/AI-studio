import { screen, fireEvent } from '@testing-library/react';
import { renderApp } from '../test/utils';

describe('Pricing', () => {
  it('upgrades the current user', () => {
    renderApp('/pricing', 'learner@techskeleton.com');
    fireEvent.click(screen.getByRole('button', { name: 'Choose Premium' }));
    expect(screen.getByText(/Ravi · premium/)).toBeInTheDocument();
  });
  it('sends guests to log in', () => {
    renderApp('/pricing');
    fireEvent.click(screen.getByRole('button', { name: 'Choose Premium' }));
    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument();
  });
});
