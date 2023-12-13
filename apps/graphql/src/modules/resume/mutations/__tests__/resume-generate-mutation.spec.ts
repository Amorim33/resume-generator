import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { parse } from 'graphql';

import {
  createResumeLoaders,
  resumeMock,
  userMock,
} from '@resume-generator/domain';
import { yoga } from '../../../../app';

const executor = buildHTTPExecutor({
  fetch: yoga.fetch,
});

const resumeGenerateMutation = parse(/* GraphQL */ `
  mutation ResumeGenerateMutation($input: ResumeGenerateInput!) {
    ResumeGenerate(input: $input) {
      resume {
        html
      }
      errors {
        code
        title
        details
      }
    }
  }
`);

const input = {
  certifications: 'AWS Certified Cloud Practitioner',
  education: 'Bachelors in Computer Science',
  experience: 'Brilliant software engineer with 10 years of experience',
  goals: 'To be the best software engineer in the world',
  languages: 'English and Portuguese',
  projects: 'Resume Generator',
  skills: 'Typescript, React, Node, GraphQL, Relay',
};

it('generates a resume', async () => {
  const result = await executor({
    document: resumeGenerateMutation,
    context: {
      loaders: {
        resume: createResumeLoaders(),
      },
      user: userMock,
    },
    variables: {
      input,
    },
  });

  expect(result).toEqual({
    data: {
      ResumeGenerate: {
        resume: {
          html: resumeMock.html,
        },
        errors: [],
      },
    },
  });
});
