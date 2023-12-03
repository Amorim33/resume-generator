import type { FetchFunction } from 'relay-runtime';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import type { CreateFetchFunctionOptions } from './fetch-function';
import { createFetchFunction } from './fetch-function';

const STORE_ENTRIES = 300;
const STORE_CACHE_RELEASE_TIME = 2 * 60 * 1000; // 2 mins
const environments = new Map<string, Environment>();

type CreateEnvironmentWithDefaultFetchFunctionOptions =
  CreateFetchFunctionOptions & {
    configName?: string;
  };

type CreateEnvironmentOptions =
  | CreateEnvironmentWithDefaultFetchFunctionOptions
  | {
      configName?: string;
      fetchFunction: FetchFunction;
    };

type WindowWithRelayEnvironment = Window & {
  relayEnvironment: Environment;
  debugRelayStore: () => void;
};

declare const window: WindowWithRelayEnvironment;

/** Creates a Relay environment with the default configuration. */
export const createEnvironment = ({
  configName = 'default',
  ...options
}: CreateEnvironmentOptions) => {
  const fetchFunction =
    'fetchFunction' in options
      ? options.fetchFunction
      : createFetchFunction(options);

  const network = Network.create(fetchFunction);
  const store = new Store(new RecordSource(), {
    gcReleaseBufferSize: STORE_ENTRIES,
    queryCacheExpirationTime: STORE_CACHE_RELEASE_TIME,
  });

  const environment = new Environment({
    configName,
    network,
    store,
  });
  environments.set(configName, environment);

  window.relayEnvironment = environment;
  window.debugRelayStore = () => environment.getStore().getSource().toJSON();

  return environment;
};

/**
 * Returns the Relay environment. Throws an error if the environment is not
 * created yet.
 */
export const getEnvironment = (configName = 'default') => {
  const environment = environments.get(configName);
  if (!environment) {
    throw new Error('Environment not created yet');
  }

  return environment;
};
