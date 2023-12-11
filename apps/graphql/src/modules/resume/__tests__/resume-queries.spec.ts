import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { parse } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import {
  createResumeLoaders,
  resumeMock,
  userMock,
} from '@resume-generator/domain';
import { yoga } from '../../../app';

const executor = buildHTTPExecutor({
  fetch: yoga.fetch,
});

const resumeNodeQuery = parse(/* GraphQL */ `
  query ResumeNodeQuery($id: ID!) {
    resume: node(id: $id) {
      ... on Resume {
        id
        html
      }
    }
  }
`);

const resumeConnectionQuery = parse(/* GraphQL */ `
  query ResumeConnectionQuery($first: Int, $after: String) {
    resumes(first: $first, after: $after) {
      count
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          html
        }
      }
    }
  }
`);

it('queries resume from node interface', async () => {
  const result = await executor({
    document: resumeNodeQuery,
    context: {
      loaders: {
        resume: createResumeLoaders(),
      },
      user: userMock,
    },
    variables: {
      id: toGlobalId('Resume', resumeMock.id),
    },
  });

  expect(result).toEqual({
    data: {
      resume: {
        id: toGlobalId('Resume', resumeMock.id),
        html: resumeMock.html,
      },
    },
  });
});

it('queries resumes', async () => {
  const result = await executor({
    document: resumeConnectionQuery,
    context: {
      loaders: {
        resume: createResumeLoaders(),
      },
      user: userMock,
    },
    variables: {
      first: 1,
    },
  });

  expect(result).toEqual({
    data: {
      resumes: {
        count: 1,
        edges: [
          {
            node: {
              html: resumeMock.html,
              id: toGlobalId('Resume', resumeMock.id),
            },
          },
        ],
        pageInfo: {
          endCursor: expect.any(String),
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: expect.any(String),
        },
      },
    },
  });
});
