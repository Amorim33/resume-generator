## @resume-generator/relay

This package contains useful [Relay](https://relay.dev/) utilities.

- `createEnvironment` - creates Relay environment with authentication support
- Custom fetch functions to support retries when running `queries`
- Authorization and error handling
- Useful hooks

### Usage

```ts
const relayEnvironment = createEnvironment({
  graphqlUrl: GRAPHQL_URL,
  getSession,
  onUnauthorized: clearSession,
});

export const App: FC = () => {
  return <Providers relayEnvironment={relayEnvironment} />;
};
```

### Hooks

#### useRoutePreloadedQuery

This hook is a wrapper around `usePreloadedQuery` that automatically preloads the query based on the current route (loaderData).

```ts
const { me } = useRoutePreloadedQuery<UserEditModalQuery>(graphql`
  query UserEditModalQuery {
    me {
      name
      contact
      about
      email
    }
  }
`);
```
