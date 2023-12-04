import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { parse } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { createUserLoaders, userMock } from '@resume-generator/domain';
import { yoga } from '../../../app';

const executor = buildHTTPExecutor({
  fetch: yoga.fetch,
});

const meQuery = parse(/* GraphQL */ `
  query MeQuery {
    me {
      id
      name
      email
      contact
      about
    }
  }
`);

it('queries me', async () => {
  const user = userMock;

  const result = await executor({
    document: meQuery,
    context: {
      loaders: createUserLoaders(),
      user,
    },
  });

  expect(result).toEqual({
    data: {
      me: {
        id: toGlobalId('User', user.id),
        email: user.email,
        name: user.name,
        contact: user.contact,
        about: user.about,
      },
    },
  });
});
