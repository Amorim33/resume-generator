import { Flex, IconButton } from '@radix-ui/themes';
import { FC, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { DownloadIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { z } from 'zod';
import { ControlledTextArea } from '../../components/ControlledTextArea';
import { usePDF } from 'react-to-pdf';
import { graphql, useMutation } from 'react-relay';
import { ResumeGenerateMutation } from './__generated__/ResumeGenerateMutation.graphql';

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

type ResumeGenerateInput = z.infer<typeof resumeGenerateSchema>;

const ResumeGenerate: FC = () => {
  const [html, setHtml] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeGenerateSchema),
    defaultValues: {
      experience: '',
      education: '',
      professionalGoal: '',
      skills: '',
      languages: '',
      projects: '',
      certifications: '',
    },
  });

  const [resumeGenerate, isPendingResumeGenerate] =
    useMutation<ResumeGenerateMutation>(graphql`
      mutation ResumeGenerateMutation($input: ResumeGenerateInput!) {
        ResumeGenerate(input: $input) {
          resume {
            html
          }
          errors {
            details
          }
        }
      }
    `);

  const onResumeGenerate: SubmitHandler<ResumeGenerateInput> = (values) => {
    resumeGenerate({
      variables: {
        input: values,
      },
      onCompleted: (data) => {
        if (data.ResumeGenerate?.errors?.length) {
          data.ResumeGenerate.errors.forEach((error) => {
            toast.error(error.details);
          });
          return;
        }

        if (!data.ResumeGenerate?.resume) {
          toast.error('Unexpected error. Please try again.');
          return;
        }

        setHtml(data.ResumeGenerate.resume.html);

        toast.success('Resume generated successfully.');
      },
      onError: () => {
        toast.error('Unexpected error. Please try again.');
      },
    });
  };

  const { targetRef, toPDF } = usePDF({ filename: 'resume.pdf' });

  return (
    <Flex direction="row" width="100%" gap="2" p="8">
      <form onSubmit={handleSubmit(onResumeGenerate)} style={{ width: '100%' }}>
        <Flex direction="column" gap="4">
          <ControlledTextArea
            name="experience"
            label="Professional experience"
            placeholder="Tell me about your professional experience."
            register={register}
            errors={errors}
          />

          <ControlledTextArea
            name="education"
            label="Education"
            placeholder="Tell me about your education background."
            register={register}
            errors={errors}
          />

          <ControlledTextArea
            name="skills"
            label="Skills"
            placeholder="Tell me about your hard and soft skills."
            register={register}
            errors={errors}
          />

          <ControlledTextArea
            name="professionalGoal"
            label="Professional goal"
            placeholder="What are your professional goals?"
            register={register}
            errors={errors}
          />

          <ControlledTextArea
            name="languages"
            label="Languages"
            placeholder="What languages do you speak and at what level?"
            register={register}
            errors={errors}
          />

          <ControlledTextArea
            name="projects"
            label="Projects"
            placeholder="Tell me about your professional projects."
            register={register}
            errors={errors}
          />

          <ControlledTextArea
            name="certifications"
            label="Certifications"
            placeholder="Tell me about your certifications as additional courses you have taken to enhance your skills."
            register={register}
            errors={errors}
          />

          <IconButton
            type="submit"
            size="4"
            aria-label="Save profile"
            disabled={isPendingResumeGenerate}
          >
            <PaperPlaneIcon />
          </IconButton>
        </Flex>
      </form>
      <Flex direction="column" gap="5" width="100%" align="end">
        <IconButton
          onClick={() => toPDF()}
          size="4"
          aria-label="Download Resume PDF"
        >
          <DownloadIcon />
        </IconButton>

        <div ref={targetRef} style={{ width: '100%' }}>
          {html && (
            <div contentEditable dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>
      </Flex>
      <Toaster position="top-center" />
    </Flex>
  );
};

export const Component: FC = () => {
  return (
    <Flex width="100%" height="100%">
      <ResumeGenerate />
    </Flex>
  );
};
Component.displayName = 'ResumeGenerate';
