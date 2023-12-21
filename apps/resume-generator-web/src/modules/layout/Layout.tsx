import { MagicWandIcon, Pencil1Icon } from '@radix-ui/react-icons';
import {
  Box,
  Code,
  Flex,
  Heading,
  IconButton,
  Link,
  Text,
} from '@radix-ui/themes';
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
    <div>
      <Box
        width="100%"
        style={{
          boxShadow: '5px 5px 10px lightgray',
        }}
        p="4"
      >
        <Flex direction="row" justify="between" align="center">
          <Link href="/">
            <Heading>Resume Generator 🤖</Heading>
          </Link>

          <Flex direction="row" gap="2" align="center">
            <IconButton asChild aria-label="Generate Resume" size="4">
              <Link href="/resume">
                <MagicWandIcon />
              </Link>
            </IconButton>
            <IconButton asChild aria-label="Edit profile" size="4">
              <Link href="/user">
                <Pencil1Icon />
              </Link>
            </IconButton>
          </Flex>
        </Flex>
      </Box>
      <Outlet context={{ queryRef: query }} />
    </div>
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
