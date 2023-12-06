import { RouteObject } from 'react-router-dom';

import { lazyRoute } from '../lib/lazyRoute';
import { getEnvironment } from '@resume-generator/relay';
import { PreloadableConcreteRequest, loadQuery } from 'react-relay';
import { LayoutQuery } from '../modules/layout/__generated__/LayoutQuery.graphql';

export const routes: RouteObject[] = [
  {
    lazy: lazyRoute(() => import('../modules/layout/Layout')),
    loader: async () => {
      const queryRef = loadQuery(
        getEnvironment(),
        (await import(
          '../modules/layout/__generated__/LayoutQuery.graphql'
        )) as unknown as PreloadableConcreteRequest<LayoutQuery>, // TODO: abstract this
        {},
      );

      return {
        queryRef,
      };
    },
    children: [
      {
        path: '/',
        lazy: lazyRoute(() => import('../modules/user/UserGenerateResume')),
      },
      {
        path: '/user',
        lazy: lazyRoute(() => import('../modules/user/UserEdit')),
      },
    ],
  },
];
