import { screen, fireEvent, within } from '@testing-library/react';
import { renderApp } from '../test/utils';

// Find the table row whose visible text contains the given course-name fragment.
// We use textContent (substring) because the row text comes from several nested nodes.
function findRow(nameFragment) {
  const rows = screen.getAllByRole('row');
  const row = rows.find((r) => r.textContent.includes(nameFragment));
  if (!row) throw new Error(`No row found containing "${nameFragment}"`);
  return row;
}

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

  it('creates a free draft, publishes it, and it appears in the catalog', () => {
    renderApp('/admin', 'admin@techskeleton.com');
    fireEvent.change(screen.getByLabelText('Course title'), { target: { value: 'Playwright Basics' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save draft' }));

    // Publish the newly created draft (still a draft, so button reads "Publish").
    const row = findRow('Playwright Basics');
    fireEvent.click(within(row).getByRole('button', { name: 'Publish' }));

    fireEvent.click(screen.getByRole('link', { name: 'Courses' }));
    expect(screen.getByText('Playwright Basics')).toBeInTheDocument();
  });

  it('deletes a course', () => {
    renderApp('/admin', 'admin@techskeleton.com');
    const row = findRow('Cypress Deep Dive');
    fireEvent.click(within(row).getByRole('button', { name: 'Delete' }));
    expect(screen.queryByText('Cypress Deep Dive')).not.toBeInTheDocument();
  });

  // ---------- Subscription-price feature ----------

  it('creates a subscription course with a price and shows it on the catalog', () => {
    renderApp('/admin', 'admin@techskeleton.com');

    fireEvent.change(screen.getByLabelText('Course title'), { target: { value: 'Locust Load Testing' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Subscription' }));
    fireEvent.change(screen.getByLabelText(/Subscription price/i), { target: { value: '699' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save draft' }));

    // Publish from the table — scope to the new course's row.
    const row = findRow('Locust Load Testing');
    fireEvent.click(within(row).getByRole('button', { name: 'Publish' }));

    fireEvent.click(screen.getByRole('link', { name: 'Courses' }));
    expect(screen.getByText('Locust Load Testing')).toBeInTheDocument();
    expect(screen.getByText('Subscription · ₹699')).toBeInTheDocument();
  });

  it('rejects subscription creation without a price', () => {
    renderApp('/admin', 'admin@techskeleton.com');
    fireEvent.change(screen.getByLabelText('Course title'), { target: { value: 'Priceless Pro' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Subscription' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(screen.getByRole('status')).toHaveTextContent('Enter a subscription price');
    expect(screen.queryByText('Priceless Pro')).not.toBeInTheDocument();
  });

  it('lets the admin edit a course and change its price', () => {
    renderApp('/admin', 'admin@techskeleton.com');
    const row = findRow('API Testing with Postman');
    fireEvent.click(within(row).getByRole('button', { name: 'Edit' }));

    // Bump the price to 799.
    const priceInput = within(row).getByLabelText(/^₹/);
    fireEvent.change(priceInput, { target: { value: '799' } });
    fireEvent.click(within(row).getByRole('button', { name: 'Save' }));

    fireEvent.click(screen.getByRole('link', { name: 'Courses' }));
    expect(screen.getByText('Subscription · ₹799')).toBeInTheDocument();
  });

  it('lets the admin flip a course from subscription back to free', () => {
    renderApp('/admin', 'admin@techskeleton.com');
    const row = findRow('JMeter');
    fireEvent.click(within(row).getByRole('button', { name: 'Edit' }));

    // Flip to Free — the price input should disappear from this row.
    fireEvent.click(within(row).getByRole('radio', { name: 'Free' }));
    expect(within(row).queryByLabelText(/^₹/)).not.toBeInTheDocument();
    fireEvent.click(within(row).getByRole('button', { name: 'Save' }));

    fireEvent.click(screen.getByRole('link', { name: 'Courses' }));
    const jmeterCard = screen.getByText('Performance Testing with JMeter').closest('li');
    expect(within(jmeterCard).getByText('Free')).toBeInTheDocument();
  });

  it('lets the admin flip a free course to subscription with a price', () => {
    renderApp('/admin', 'admin@techskeleton.com');
    const row = findRow('Selenium');
    fireEvent.click(within(row).getByRole('button', { name: 'Edit' }));

    fireEvent.click(within(row).getByRole('radio', { name: 'Sub' }));
    const priceInput = within(row).getByLabelText(/^₹/);
    fireEvent.change(priceInput, { target: { value: '299' } });
    fireEvent.click(within(row).getByRole('button', { name: 'Save' }));

    fireEvent.click(screen.getByRole('link', { name: 'Courses' }));
    expect(screen.getByText('Subscription · ₹299')).toBeInTheDocument();
  });
});