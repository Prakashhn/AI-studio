const q = (question, options, answer) => ({ q: question, options, answer });
// `price` is the per-course subscription price in INR.
// `price: null`  -> free for everyone
// `price: number` -> subscription course, chargeable to free-plan users unless they're on premium/enterprise
const course = (id, title, category, price, status, summary, lessons, quiz) =>
  ({ id, title, category, price, status, summary, lessons, quiz });

export const CATEGORIES = ['Testing Tools', 'Study Material', 'Competitive Exams'];

export const seed = {
  session: null,
  results: {},
  users: [
    { email: 'admin@techskeleton.com', password: 'admin123', name: 'Asha (Admin)', role: 'admin', plan: 'enterprise' },
    { email: 'learner@techskeleton.com', password: 'learn123', name: 'Ravi', role: 'learner', plan: 'free' },
    { email: 'pro@techskeleton.com', password: 'pro12345', name: 'Meera', role: 'learner', plan: 'premium' },
  ],
  courses: [
    course('selenium-basics', 'Selenium WebDriver Essentials', 'Testing Tools', null, 'published',
      'Automate browser tests from locators to a first working suite.',
      [{ title: 'Locators', body: 'Prefer stable ids and data attributes over long XPath chains.' },
       { title: 'Waits', body: 'Use explicit waits instead of fixed sleeps to avoid flaky tests.' }],
      [q('Which wait avoids flaky timing?', ['Thread sleep', 'Explicit wait'], 1)]),
    course('postman-api', 'API Testing with Postman', 'Testing Tools', 499, 'published',
      'Build collections, assertions and environments for REST APIs.',
      [{ title: 'Collections', body: 'Group requests by feature and share variables through environments.' },
       { title: 'Assertions', body: 'Check status code, schema and response time in every request.' }],
      [q('Where do you keep per-environment base URLs?', ['Environment variables', 'Inside each request'], 0)]),
    course('jmeter-perf', 'Performance Testing with JMeter', 'Testing Tools', 599, 'published',
      'Model load, read reports and find bottlenecks.',
      [{ title: 'Thread groups', body: 'A thread group simulates concurrent virtual users.' }],
      [q('What simulates concurrent users?', ['Thread group', 'Listener'], 0)]),
    course('testing-fundamentals', 'Software Testing Fundamentals', 'Study Material', null, 'published',
      'Levels, types and techniques every tester should know.',
      [{ title: 'Test levels', body: 'Unit, integration, system and acceptance testing.' }],
      [q('Which level tests a single function?', ['Unit', 'System'], 0)]),
    course('istqb-foundation', 'ISTQB Foundation Level Prep', 'Competitive Exams', 899, 'published',
      'Syllabus notes and practice questions for the ISTQB CTFL exam.',
      [{ title: 'Seven principles', body: 'Testing shows the presence of defects, not their absence.' }],
      [q('Testing can prove software has no defects?', ['True', 'False'], 1)]),
    course('gate-aptitude', 'GATE Aptitude Sprint', 'Competitive Exams', null, 'published',
      'Quick revision of verbal and numerical aptitude.',
      [{ title: 'Ratios', body: 'Convert every ratio to a common unit before comparing.' }],
      [q('2:3 equals which fraction?', ['2/3', '3/2'], 0)]),
    course('cypress-deep-dive', 'Cypress Deep Dive', 'Testing Tools', 749, 'draft',
      'Component and end-to-end testing with Cypress.',
      [{ title: 'Setup', body: 'Install Cypress and write your first spec.' }], []),
  ],
};
