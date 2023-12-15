import { RouteObject } from 'react-router-dom';

import { lazyRoute } from '../lib/lazyRoute';
import { getEnvironment } from '@resume-generator/relay';
import { PreloadableConcreteRequest, loadQuery } from 'react-relay';
import { LayoutQuery } from '../modules/layout/__generated__/LayoutQuery.graphql';
import { ResumeEditQuery } from '../modules/resume/__generated__/ResumeEditQuery.graphql';
import { ResumesQuery } from '../modules/resume/__generated__/ResumesQuery.graphql';

export const routes: RouteObject[] = [
  {
    lazy: lazyRoute(() => import('../modules/layout/Layout')),
    loader: async () => {
      const queryRef = loadQuery(
        getEnvironment(),
        (await import(
          '../modules/layout/__generated__/LayoutQuery.graphql'
        )) as unknown as PreloadableConcreteRequest<LayoutQuery>,
        {},
      );

      return {
        queryRef,
      };
    },
    children: [
      {
        path: '/',
        lazy: lazyRoute(() => import('../modules/resume/Resumes')),
        loader: async () => {
          const queryRef = loadQuery(
            getEnvironment(),
            (await import(
              '../modules/resume/__generated__/ResumesQuery.graphql'
            )) as unknown as PreloadableConcreteRequest<ResumesQuery>,
            {},
          );

          return {
            queryRef,
          };
        },
      },
      {
        path: '/resume',
        lazy: lazyRoute(() => import('../modules/resume/ResumeGenerate')),
      },
      {
        path: '/resume/:resumeId',
        lazy: lazyRoute(() => import('../modules/resume/ResumeEdit')),
        loader: async ({ params }) => {
          if (!params.resumeId) {
            throw new Response(`Missing resumeId`, { status: 422 });
          }

          const queryRef = loadQuery(
            getEnvironment(),
            (await import(
              '../modules/resume/__generated__/ResumeEditQuery.graphql'
            )) as unknown as PreloadableConcreteRequest<ResumeEditQuery>,
            {
              id: params.resumeId,
            },
          );
          return { queryRef };
        },
      },
      {
        path: '/user',
        lazy: lazyRoute(() => import('../modules/user/UserEdit')),
      },
    ],
  },
];
