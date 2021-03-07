import { useHistory, useRouteMatch } from 'react-router-dom';

const useRouting = () => {
  const history = useHistory();
  const { path } = useRouteMatch();

  /**
   * Go to specified page and call callback when done
   */
  const goToPage = (where: string, state?: object, callback?: any): void => {
    try {
      history.push(where, state ?? undefined);
      if (typeof callback === 'function') {
        callback();
      }
    } catch (e) {
      console.error('Error during navigating on page', where, e);
    }
  };

  /**
   * Get current page
   */
  const getCurrentPage = (): string => {
    return path;
  };

  /**
   * Check if user is currently located on a specified page
   */
  const isOnPage = (page: string, strict: boolean = false): boolean => {
    const currentPage = getCurrentPage();
    if (!strict) {
      return String(currentPage).startsWith(page);
    }
    return String(currentPage) === page;
  };

  return {
    goToPage,
    getCurrentPage,
    isOnPage,

    // Supported routes
    ROUTES: {
      DASHBOARD: '/logged-in/dashboard',
      WIZARD: '/logged-in/wizard',
      SETTINGS: '/logged-in/settings',
      LOGIN: '/login'
    }
  };
};

export default useRouting;
