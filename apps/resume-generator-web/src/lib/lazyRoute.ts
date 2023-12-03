import { LazyRouteFunction, RouteObject } from 'react-router-dom';

/**
 * Lazy load a route component and reload the page if the import fails.
 *
 * By using the wrapper function, the app can gracefully handle `Failed to fetch
 * dynamically imported module` errors.
 *
 * When a new version is deployed, previous assets are invalidated and new
 * assets are uploaded to CloudFront.
 *
 * - `dist/assets/Home-oldHash.js` -> `dist/assets/Home-newHash.js`
 * - `dist/assets/Route-untouchedHash.js` -> `dist/assets/Route-untouchedHash.js`
 *
 * **The hashes are generated by Vite using the file contents.**
 *
 * This is the expected behavior, as it should serve the latest version.
 *
 * However, that will break the app if the user had opened it before the update
 * and navigates to an updated route. The browser tries to fetch asset
 * (`import('./Home-oldHash.js')`, but it no longer exists. This results in a
 * `Failed to fetch dynamically imported module` error.
 *
 * In order to solve the problem, the app forces a reload and makes the browser
 * fetch the updated assets.
 *
 * @see https://github.com/remix-run/react-router/discussions/10333
 */
export const lazyRoute = (
  fn: LazyRouteFunction<RouteObject>,
): LazyRouteFunction<RouteObject> => {
  return async () => {
    try {
      return await fn();
    } catch (err) {
      if (
        !(err instanceof Error) ||
        !err.message.includes('dynamically imported module')
      ) {
        throw err;
      }

      window.location.reload();
      return {
        element: '',
      };
    }
  };
};