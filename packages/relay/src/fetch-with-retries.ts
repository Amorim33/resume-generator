type RequestInitWithRetries = RequestInit & {
  fetchTimeout?: number | null;
  retryDelays?: number[] | null;
};

const DEFAULT_TIMEOUT = 20000;
const DEFAULT_RETRIES = [1000, 3000, 5000];

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

/**
 * Makes a POST request to the server with the given data as the payload.
 * Automatic retries are done based on the values in `retryDelays`.
 */
export const fetchWithRetries = (
  uri: string,
  initWithRetries?: RequestInitWithRetries,
): Promise<Response> => {
  const { fetchTimeout, retryDelays, ...init } = initWithRetries || {};
  const _fetchTimeout = fetchTimeout || DEFAULT_TIMEOUT;
  const _retryDelays = retryDelays || DEFAULT_RETRIES;

  let requestsAttempted = 0;
  let requestStartTime = 0;
  return new Promise((resolve, reject) => {
    /**
     * Sends a request to the server that will timeout after `fetchTimeout`. If
     * the request fails or times out a new request might be scheduled.
     */
    const sendTimedRequest = (): void => {
      requestsAttempted++;
      requestStartTime = Date.now();
      let isRequestAlive = true;
      const request = fetch(uri, init);
      const requestTimeout = setTimeout(() => {
        isRequestAlive = false;
        if (shouldRetry(requestsAttempted)) {
          // eslint-disable-next-line no-console
          console.log(false, 'fetchWithRetries: HTTP timeout, retrying.');
          retryRequest();
        } else {
          reject(
            new Error(
              `Failed to get response from server, tried ${requestsAttempted} times.`,
            ),
          );
        }
      }, _fetchTimeout);

      request
        .then((response) => {
          clearTimeout(requestTimeout);
          if (isRequestAlive) {
            // We got a response, we can clear the timeout.
            if (response.status >= 200 && response.status < 300) {
              // Got a response code that indicates success, resolve the promise.
              resolve(response);
            } else if (response.status >= 400 && response.status <= 404) {
              resolve(response);
            } else if (shouldRetry(requestsAttempted)) {
              // Fetch was not successful, retrying.
              // eslint-disable-next-line no-console
              console.log(false, 'fetchWithRetries: HTTP error, retrying.'),
                retryRequest();
            } else {
              // Request was not successful, giving up.
              const error = new Error(
                `Failed to get response from server, tried ${requestsAttempted} times.`,
                { cause: response },
              );
              reject(error);
            }
          }
        })
        .catch((error) => {
          clearTimeout(requestTimeout);
          if (shouldRetry(requestsAttempted)) {
            retryRequest();
          } else {
            reject(error);
          }
        });
    };

    /**
     * Schedules another run of sendTimedRequest based on how much time has
     * passed between the time the last request was sent and now.
     */
    const retryRequest = (): void => {
      if (!_retryDelays) return;

      const retryDelay = _retryDelays[requestsAttempted - 1];
      const retryStartTime = requestStartTime + retryDelay;
      // Schedule retry for a configured duration after last request started.
      setTimeout(sendTimedRequest, retryStartTime - Date.now());
    };

    /** Checks if another attempt should be done to send a request to the server. */
    const shouldRetry = (attempt: number): boolean => {
      if (!_retryDelays) return false;

      return canUseDOM && attempt <= _retryDelays.length;
    };

    sendTimedRequest();
  });
};
