import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { parse } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import { randomUUID } from 'crypto';
import { createUserLoaders, userMock } from '@resume-generator/domain';
import { yoga } from '../../../app';

const executor = buildHTTPExecutor({
  fetch: yoga.fetch,
});

const userNodeQuery = parse(/* GraphQL */ `
  query UserNodeQuery($id: ID!) {
    user: node(id: $id) {
      ... on User {
        id
        name
      }
    }
  }
`);

it('queries user from node interface', async () => {
  const result = await executor({
    document: userNodeQuery,
    context: {
      loaders: {
        user: createUserLoaders(),
      },
      user: userMock,
    },
    variables: {
      id: toGlobalId('User', userMock.id),
    },
  });

  expect(result).toEqual({
    data: {
      user: {
        id: toGlobalId('User', userMock.id),
        name: userMock.name,
      },
    },
  });
});

it('returns null if user is not in the context', async () => {
  const result = await executor({
    document: userNodeQuery,
    context: {
      loaders: {
        user: createUserLoaders(),
      },
    },
    variables: {
      id: toGlobalId('User', userMock.id),
    },
  });

  expect(result).toEqual({
    data: {
      user: null,
    },
  });
});

it('returns null if the requested user is not in the context', async () => {
  const result = await executor({
    document: userNodeQuery,
    context: {
      loaders: {
        user: createUserLoaders(),
      },
      user: {
        ...userMock,
        id: randomUUID(),
      },
    },
    variables: {
      id: toGlobalId('User', userMock.id),
    },
  });

  expect(result).toEqual({
    data: {
      user: null,
    },
  });
});
