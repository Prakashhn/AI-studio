import { screen, fireEvent } from '@testing-library/react';
import { renderApp } from '../test/utils';

describe('Catalog', () => {
  it('shows published courses and hides drafts for guests', () => {
    renderApp('/');
    expect(screen.getByText('Selenium WebDriver Essentials')).toBeInTheDocument();
    expect(screen.queryByText('Cypress Deep Dive')).not.toBeInTheDocument();
  });
  it('shows drafts to admins', () => {
    renderApp('/', 'admin@techskeleton.com');
    expect(screen.getByText('Cypress Deep Dive')).toBeInTheDocument();
  });
  it('filters by search text', () => {
    renderApp('/');
    fireEvent.change(screen.getByLabelText('Search courses'), { target: { value: 'postman' } });
    expect(screen.getByText('API Testing with Postman')).toBeInTheDocument();
    expect(screen.queryByText('Software Testing Fundamentals')).not.toBeInTheDocument();
  });
  it('shows an empty state when nothing matches', () => {
    renderApp('/');
    fireEvent.change(screen.getByLabelText('Search courses'), { target: { value: 'zzzz' } });
    expect(screen.getByRole('status')).toHaveTextContent('No courses match');
  });
  it('filters by free only', () => {
    renderApp('/');
    fireEvent.change(screen.getByLabelText('Access'), { target: { value: 'free' } });
    expect(screen.queryByText('API Testing with Postman')).not.toBeInTheDocument();
  });
});
