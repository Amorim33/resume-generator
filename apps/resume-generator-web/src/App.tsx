import { FC } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import '@radix-ui/themes/styles.css';

import { createEnvironment } from '@resume-generator/relay';

import { GRAPHQL_URL } from './lib/config';
import { clearSession, getSession } from './lib/session';
import { Providers } from './providers/BaseProviders';
import { routes } from './routes/router';

const relayEnvironment = createEnvironment({
  graphqlUrl: GRAPHQL_URL,
  getSession,
  onUnauthorized: clearSession,
});

const router = createBrowserRouter(routes);

export const App: FC = () => {
  return <Providers relayEnvironment={relayEnvironment} router={router} />;
};
