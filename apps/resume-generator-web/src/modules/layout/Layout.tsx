import { Code, Flex, Link, Text } from '@radix-ui/themes';
import { FC } from 'react';
import { Outlet, useRouteError } from 'react-router-dom';

export const Component: FC = () => {
  return (
    <div>
      <Outlet />
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
