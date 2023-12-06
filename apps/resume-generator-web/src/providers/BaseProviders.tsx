import { Theme } from '@radix-ui/themes';
import { FC, ReactNode, Suspense } from 'react';
import { Environment, RelayEnvironmentProvider } from 'react-relay';
import { RouterProvider, RouterProviderProps } from 'react-router-dom';

type BaseProvidersProps = {
  relayEnvironment: Environment;
  children: ReactNode;
};

export const BaseProviders: FC<BaseProvidersProps> = ({
  children,
  relayEnvironment,
}) => {
  return (
    <Theme accentColor="red" grayColor="sand" radius="large" scaling="95%">
      <Suspense>
        <RelayEnvironmentProvider environment={relayEnvironment}>
          {children}
        </RelayEnvironmentProvider>
      </Suspense>
    </Theme>
  );
};

type ProvidersProps = Omit<BaseProvidersProps, 'children'> & {
  router: RouterProviderProps['router'];
};

export const Providers: FC<ProvidersProps> = ({ router, ...props }) => {
  return (
    <BaseProviders {...props}>
      <RouterProvider router={router} />
    </BaseProviders>
  );
};
