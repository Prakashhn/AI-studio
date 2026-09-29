import { screen, fireEvent } from '@testing-library/react';
import { renderApp } from '../test/utils';

describe('Admin', () => {
  it('blocks non-admins', () => {
    renderApp('/admin', 'learner@techskeleton.com');
    expect(screen.getByRole('alert')).toHaveTextContent('Admins only');
  });
  it('requires a title', () => {
    renderApp('/admin', 'admin@techskeleton.com');
    fireEvent.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(screen.getByRole('status')).toHaveTextContent('Add a course title');
  });
  it('creates a draft, publishes it, and it appears in the catalog', () => {
    renderApp('/admin', 'admin@techskeleton.com');
    fireEvent.change(screen.getByLabelText('Course title'), { target: { value: 'Playwright Basics' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save draft' }));
    fireEvent.click(screen.getByRole('button', { name: 'Publish Playwright Basics' }));
    fireEvent.click(screen.getByRole('link', { name: 'Courses' }));
    expect(screen.getByText('Playwright Basics')).toBeInTheDocument();
  });
  it('deletes a course', () => {
    renderApp('/admin', 'admin@techskeleton.com');
    fireEvent.click(screen.getByRole('button', { name: 'Delete Cypress Deep Dive' }));
    expect(screen.queryByText('Cypress Deep Dive')).not.toBeInTheDocument();
  });
});
