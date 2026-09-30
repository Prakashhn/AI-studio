import { screen, fireEvent } from '@testing-library/react';
import { renderApp } from '../test/utils';

describe('CourseDetail', () => {
  it('locks premium courses for free learners', () => {
    renderApp('/course/postman-api', 'learner@techskeleton.com');
    expect(screen.getByText('This is a premium course.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See plans to unlock' })).toBeInTheDocument();
  });
  it('asks guests to log in', () => {
    renderApp('/course/postman-api');
    expect(screen.getByRole('link', { name: 'Log in to continue' })).toBeInTheDocument();
  });
  it('opens premium courses for premium users', () => {
    renderApp('/course/postman-api', 'pro@techskeleton.com');
    expect(screen.getByText('Collections')).toBeInTheDocument();
  });
  it('scores the quiz', () => {
    renderApp('/course/selenium-basics');
    fireEvent.click(screen.getByLabelText('Explicit wait'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit answers' }));
    expect(screen.getByRole('status')).toHaveTextContent('You scored 1 of 1.');
  });
  it('hides draft courses from learners', () => {
    renderApp('/course/cypress-deep-dive', 'pro@techskeleton.com');
    expect(screen.getByRole('alert')).toHaveTextContent('Course not found');
  });
});
