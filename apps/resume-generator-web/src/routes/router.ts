import { RouteObject } from 'react-router-dom';

import { lazyRoute } from '../lib/lazyRoute';
import { getEnvironment } from '@resume-generator/relay';
import { PreloadableConcreteRequest, loadQuery } from 'react-relay';
import { UserEditModalQuery } from '../modules/user/__generated__/UserEditModalQuery.graphql';

export const routes: RouteObject[] = [
  {
    lazy: lazyRoute(() => import('../modules/layout/Layout')),
    children: [
      {
        path: '/user',
        lazy: lazyRoute(() => import('../modules/user/UserEditModal')),
        loader: async () => {
          const queryRef = loadQuery(
            getEnvironment(),
            (await import(
              '../modules/user/__generated__/UserEditModalQuery.graphql'
            )) as unknown as PreloadableConcreteRequest<UserEditModalQuery>, // TODO: abstract this
            {},
          );

          return {
            queryRef,
          };
        },
      },
    ],
  },
];
