import { Button, Flex, Link } from '@radix-ui/themes';
import { FC } from 'react';

import { useRoutePreloadedQuery } from '@resume-generator/relay';
import { graphql, usePaginationFragment } from 'react-relay';
import { ResumesQuery } from './__generated__/ResumesQuery.graphql';
import { Resumes_query$key } from './__generated__/Resumes_query.graphql';

type ResumesProps = {
  queryRef: Resumes_query$key;
};

const Resumes: FC<ResumesProps> = ({ queryRef }) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment Resumes_query on Query
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 5 }
        last: { type: "Int" }
        before: { type: String }
        after: { type: String, defaultValue: null }
      )
      @refetchable(queryName: "ResumesPaginationQuery") {
        resumes(first: $first, last: $last, after: $after, before: $before)
          @connection(key: "Resumes_query_resumes") {
          count
          edges {
            node {
              id
            }
          }
        }
      }
    `,
    queryRef,
  );

  return (
    <Flex direction="column" gap="5" width="100%">
      {data?.resumes?.edges?.map((edge) => (
        <Button key={edge?.node.id} asChild size="4">
          <Link href={`/resume/${edge?.node.id}`}>Open Resume</Link>
        </Button>
      ))}
      <Button
        size="4"
        disabled={!hasNext || isLoadingNext}
        onClick={() => loadNext(5)}
      >
        Load More
      </Button>
    </Flex>
  );
};

export const Component: FC = () => {
  const query = useRoutePreloadedQuery<ResumesQuery>(graphql`
    query ResumesQuery {
      ...Resumes_query
    }
  `);

  return (
    <Flex width="100%" height="100%">
      <Resumes queryRef={query} />
    </Flex>
  );
};
Component.displayName = 'Resumes';
