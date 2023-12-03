import type { FetchFunction, GraphQLResponse } from 'relay-runtime';
import { Observable } from 'relay-runtime';
import { version } from '../package.json';
import { fetchWithRetries } from './fetch-with-retries';

export class FetchFunctionError extends Error {
  response: Response;
  status: number;
  text: string;
  constructor(
    message: string,
    options: ErrorOptions & { response: Response; text: string },
  ) {
    const { response, text, ...rest } = options;
    super(message, rest);
    this.name = 'FetchFunctionError';
    this.response = response;
    this.status = response.status;
    this.text = text;
  }
}

export type CreateFetchFunctionOptions = {
  graphqlUrl: string;
  getSession: () => string | null | undefined;
  getHeaders?: () => HeadersInit;
  onUnauthorized: () => void;
};

/**
 * Function that fetches the results of a request (query/mutation/etc) and
 * returns its results as a Observable.
 */
export const createFetchFunction =
  ({
    graphqlUrl,
    getSession,
    getHeaders,
    onUnauthorized,
  }: CreateFetchFunctionOptions): FetchFunction =>
  (request, variables, cacheConfig) => {
    if (!request.text) throw new Error('Missing request text');

    return Observable.create<GraphQLResponse>((sink) => {
      (async () => {
        const authorization = getSession();
        const headers: HeadersInit = {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-app-version': version,
          'x-time-zone': Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...(authorization
            ? { authorization: `Bearer ${authorization}` }
            : {}),
          ...getHeaders?.(),
        };
        const body = JSON.stringify({
          operationName: request.name,
          query: request.text,
          variables,
        });

        const isMutation = request.operationKind === 'mutation';
        const fetchConfig =
          !isMutation && typeof cacheConfig.metadata === 'object'
            ? cacheConfig.metadata
            : {};
        const fetchFn = isMutation ? fetch : fetchWithRetries;

        try {
          const response = await fetchFn(graphqlUrl, {
            method: 'POST',
            headers,
            body,
            ...fetchConfig,
          });

          // GraphQL flags as unauthorized or forbidden
          if ([401, 403].includes(response.status)) {
            onUnauthorized();
            throw new FetchFunctionError('UNAUTHORIZED', {
              response,
              text: await response.text(),
            });
          }

          // Response code is not between 200 and 299 (https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
          // It could be a client error (GraphQLWrongQuery or something like that), network error or server error
          if (!response.ok) {
            throw new FetchFunctionError('NETWORK_ERROR', {
              response,
              text: await response.text(),
            });
          }

          const json = await response.json();
          sink.next(json);
          sink.complete();
        } catch (error) {
          sink.error(error as Error);
        }
      })();
    });
  };
