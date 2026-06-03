/**
 * Routes Configuration
 * Centralized route definitions for the application
 */

export const ROUTES = {
  HOME: '/',
  RESULT: '/result',
  LEADERBOARD: '/leaderboard',
  CERTIFICATE: '/certificate',
  DASHBOARD: '/dashboard',
  QUIZ: '/quiz',
};

/**
 * Route metadata for navigation and breadcrumbs
 */
export const ROUTE_METADATA = {
  [ROUTES.RESULT]: {
    title: 'Quiz Results',
    description: 'View your quiz results and detailed analytics',
  },
  [ROUTES.LEADERBOARD]: {
    title: 'Leaderboard',
    description: 'See how you rank against other participants',
  },
  [ROUTES.CERTIFICATE]: {
    title: 'Certificate',
    description: 'Download and share your certificate',
  },
};

export default ROUTES;
