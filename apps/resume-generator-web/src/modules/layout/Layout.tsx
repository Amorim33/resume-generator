import { Code, Flex, Link, Text } from '@radix-ui/themes';
import { useRoutePreloadedQuery } from '@resume-generator/relay';
import { FC } from 'react';
import { graphql } from 'react-relay';
import { Navigate, Outlet, useLocation, useRouteError } from 'react-router-dom';
import { LayoutQuery } from './__generated__/LayoutQuery.graphql';

export const Component: FC = () => {
  const location = useLocation();
  const query = useRoutePreloadedQuery<LayoutQuery>(graphql`
    query LayoutQuery {
      me {
        id
      }
      ...UserEdit_query
    }
  `);

  if (!query.me?.id && location.pathname !== '/user') {
    return <Navigate to="/user" />;
  }

  return (
    <Flex justify="center">
      <Outlet context={{ queryRef: query }} />
    </Flex>
  );
};
Component.displayName = 'Layout';

export const ErrorBoundary: FC = () => {
  const error = useRouteError();

  return (
    <Flex justify="center">
      <Flex direction="column" gap="3">
        <Text size="6" weight="bold">
          You are seeing this error because you are running it locally.
          <br />
          Please, open an issue on the repository:
        </Text>
        <Link
          size="6"
          href="https://github.com/Amorim33/resume-generator/issues"
        >
          https://github.com/Amorim33/resume-generator/issues
        </Link>
        <Text size="4" weight="bold">
          Error:
        </Text>
        <Code>
          {error instanceof Error
            ? error.message || error.name
            : 'Unknown error'}
        </Code>
        <Text size="4" weight="bold">
          Stack Trace:
        </Text>
        {error instanceof Error && <pre>{error.stack}</pre>}
      </Flex>
    </Flex>
  );
};
