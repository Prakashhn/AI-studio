import { screen, fireEvent } from '@testing-library/react';
import { renderApp } from '../test/utils';

const fill = (email, password) => {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
};

describe('Login', () => {
  it('rejects wrong credentials with a clear message', () => {
    renderApp('/login');
    fill('learner@techskeleton.com', 'nope');
    expect(screen.getByRole('alert')).toHaveTextContent('Email or password is incorrect');
  });
  it('logs a learner in and returns to the catalog', () => {
    renderApp('/login');
    fill('learner@techskeleton.com', 'learn123');
    expect(screen.getByText(/Ravi · free/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Learn testing/ })).toBeInTheDocument();
  });
  it('sends admins to the admin page', () => {
    renderApp('/login');
    fill('admin@techskeleton.com', 'admin123');
    expect(screen.getByRole('heading', { name: 'Course admin' })).toBeInTheDocument();
  });
});
