import { USER_EDIT_ROUTE, USER_ID_KEY } from './config';

/** Saves user id to local storage. */
export const saveSession = (token: string) => {
  localStorage.setItem(USER_ID_KEY, token);
};

/** Removes user id from local storage and redirects to user edit page. */
export const clearSession = () => {
  localStorage.removeItem(USER_ID_KEY);
  window.location.replace(USER_EDIT_ROUTE);
};

/** Returns user id from local storage. */
export const getSession = () => localStorage.getItem(USER_ID_KEY);
