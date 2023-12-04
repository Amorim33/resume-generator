import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { parse } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { createUserLoaders, userMock } from '@resume-generator/domain';
import { yoga } from '../../../../app';

const executor = buildHTTPExecutor({
  fetch: yoga.fetch,
});

const meQuery = parse(/* GraphQL */ `
  mutation UserUpsertMutation($input: UserUpsertInput!) {
    UserUpsert(input: $input) {
      me {
        id
        name
        email
        contact
        about
      }
      errors {
        code
        title
        details
      }
    }
  }
`);

it('upsert the user', async () => {
  const user = userMock;

  const result = await executor({
    document: meQuery,
    context: {
      loaders: createUserLoaders(),
    },
    variables: {
      input: {
        user: {
          email: user.email,
          name: user.name,
          contact: user.contact,
          about: user.about,
        },
      },
    },
  });

  expect(result).toEqual({
    data: {
      UserUpsert: {
        me: {
          id: toGlobalId('User', user.id),
          email: user.email,
          name: user.name,
          contact: user.contact,
          about: user.about,
        },
        errors: [],
      },
    },
  });
});
