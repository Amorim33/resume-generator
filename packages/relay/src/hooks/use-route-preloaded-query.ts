import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import { useLoaderData } from 'react-router-dom';
import { GraphQLTaggedNode, OperationType } from 'relay-runtime';
import { z } from 'zod';

const loaderDataSchema = z.object({
  queryRef: z.unknown().refine((value) => {
    return !!value;
  }),
});

/**
 * Gets react router loader data and returns the preloaded query.
 *
 * Loader data must contain the queryRef for the preloaded query.
 *
 * @example
 *   const { me } = useRoutePreloadedQuery(graphql`
 *     query UserEditModalQuery {
 *       me {
 *         name
 *         contact
 *         about
 *         email
 *       }
 *     }
 *   `);
 */
export const useRoutePreloadedQuery = <TQuery extends OperationType>(
  query: GraphQLTaggedNode,
) => {
  const loaderData = loaderDataSchema.parse(useLoaderData());
  return usePreloadedQuery<TQuery>(
    query,
    loaderData.queryRef as PreloadedQuery<TQuery>,
  );
};
