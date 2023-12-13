import { OpenAI } from 'openai';

import {
  MutationResumeGenerateArgs,
  ResumeGeneratePayload,
} from '../../../__generated__/resolvers-types';
import { GraphQLContext } from '../../../lib/context';
import { createResumeRepository } from '@resume-generator/domain';
import { resumeResolveSchema } from '../resume-resolver';
import { z } from 'zod';

const openai = new OpenAI();

const resumeGenerateSchema = z.object({
  experience: z
    .string({
      invalid_type_error: 'Professional experience must be a text.',
      required_error: 'Professional experience is required.',
    })
    .min(20, {
      message: 'Professional experience must have at least 20 characters.',
    }),
  education: z
    .string({
      invalid_type_error: 'Education must be a text.',
      required_error: 'Education is required.',
    })
    .min(20, {
      message: 'Education must have at least 20 characters.',
    }),
  skills: z.string({
    invalid_type_error: 'Skills must be a text.',
  }),
  goals: z
    .string({
      invalid_type_error: 'Professional goal must be a text.',
    })
    .optional(),
  languages: z
    .string({
      invalid_type_error: 'Languages must be a text.',
    })
    .optional(),
  projects: z
    .string({
      invalid_type_error: 'Projects must be a text.',
    })
    .optional(),
  certifications: z
    .string({
      invalid_type_error: 'Certifications must be a text.',
    })
    .optional(),
});

export const resumeGenerateResolve = async (
  _: unknown,
  args: MutationResumeGenerateArgs,
  context: GraphQLContext,
): Promise<ResumeGeneratePayload> => {
  const { loaders, user } = context;
  const { input } = args;

  // TODO: Add middleware to check if user is logged in
  if (!user) {
    throw new Error('Unauthorized');
  }

  const {
    education,
    experience,
    certifications,
    goals,
    languages,
    projects,
    skills,
  } = resumeGenerateSchema.parse(input);

  const prompt = `
    # Resume Generator
    You are an assistant to a software engineer. You are helping them write their resume. They have provided you with the following information:

    ## Personal Information
    Name: ${user.name}
    Contact: ${user.contact}
    About: ${user.about}

    ## Professional Experience
    ${experience}

    ## Education
    ${education}

    ## Skills
    ${skills}

    ## Projects
    ${projects}

    ## Certifications
    ${certifications}

    ## Languages
    ${languages}

    ## Professional Goals
    ${goals}


    # Resume Guidelines
    You are to write a resume for the software engineer. The resume should be one page long and must follow the requirements below:
    - Add a header with the name and contact information of the software engineer (elaborate a great design for the header)
    - Add a section for the software engineer's professional experience, use all the information provided by the software engineer and improve the grammar
    - Add a section for the software engineer's education, use all the information provided by the software engineer and improve the grammar
    - Add a section for the software engineer's skills if they have any, use all the information provided by the software engineer and improve the grammar
    - Add a section for the software engineer's projects if they have any, use all the information provided by the software engineer and improve the grammar
    - Add a section for the software engineer's certifications if they have any, use all the information provided by the software engineer and improve the grammar
    - Add a section for the software engineer's languages if they have any, use all the information provided by the software engineer and improve the grammar, create a table with the languages and the level of proficiency, align left
    - Add a section for the software engineer's professional goals if they have any, use all the information provided by the software engineer and improve the grammar
    - If the content provided is not in English, translate it to English

    You have to return a HTML document with the resume in it (JUST RETURN THE GENERATED HTML DOCUMENT, THE STRING MUST BE VALID HTML).
    You have to add CSS to the HTML document to make it look modern.
    Create an innovative design for the resume.
    `;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'assistant',
        content: prompt,
      },
    ],
    model: 'gpt-4',
  });

  const { message } = completion.choices[0];

  if (!message.content) {
    return {
      resume: null,
      errors: [
        {
          code: 'GPT_FAILED',
          title: 'GPT failed to generate resume',
          details: 'Resume generation failed, please try again.',
        },
      ],
    };
  }

  // GPT-4 adds markdown markup
  const html = message.content.replaceAll(/```html|```/g, '');

  const resumeRepository = createResumeRepository(loaders.resume);

  const resume = await resumeRepository.create({
    html,
    user_id: user.id,
  });

  return {
    resume: resumeResolveSchema.parse(resume),
    errors: [],
  };
};
