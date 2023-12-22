import { Flex, IconButton } from '@radix-ui/themes';
import { FC, useState } from 'react';

import { DownloadIcon } from '@radix-ui/react-icons';
import { useRoutePreloadedQuery } from '@resume-generator/relay';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Toaster } from 'react-hot-toast';
import { graphql } from 'react-relay';
import { usePDF } from 'react-to-pdf';
import { ResumeEditQuery } from './__generated__/ResumeEditQuery.graphql';

const ResumeEdit: FC = () => {
  const { resume } = useRoutePreloadedQuery<ResumeEditQuery>(graphql`
    query ResumeEditQuery($id: ID!) {
      resume: node(id: $id) {
        ... on Resume {
          html
        }
      }
    }
  `);
  const [html, setHtml] = useState(resume?.html);

  const { targetRef, toPDF } = usePDF({ filename: 'resume.pdf' });

  if (html === undefined) {
    return <div>Resume not found</div>;
  }

  return (
    <Flex direction="row" width="100%" gap="2" p="8">
      <CodeEditor
        value={html}
        language="html"
        onChange={(evn) => setHtml(evn.target.value)}
        padding={15}
        data-color-mode="light"
        style={{
          width: '100%',
          fontFamily:
            'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
      <Flex direction="column" gap="5" width="100%" align="end">
        <IconButton
          onClick={() => toPDF()}
          size="4"
          aria-label="Download Resume PDF"
        >
          <DownloadIcon />
        </IconButton>
        <div ref={targetRef} style={{ width: '100%' }}>
          <div style={{}} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </Flex>
      <Toaster position="top-center" />
    </Flex>
  );
};

export const Component: FC = () => {
  return (
    <Flex width="100%" height="100%">
      <ResumeEdit />
    </Flex>
  );
};
Component.displayName = 'ResumeEdit';
