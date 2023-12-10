import { Flex, IconButton } from '@radix-ui/themes';
import { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';
import { z } from 'zod';
import { ControlledTextArea } from '../../components/ControlledTextArea';

const resumeGenerateSchema = z.object({
  experience: z
    .string({
      invalid_type_error: 'Professional experience must be a text.',
      required_error: 'Professional experience is required.',
    })
    .min(3, {
      message: 'Professional experience must have at least 20 characters.',
    }),
  education: z
    .string({
      invalid_type_error: 'Education must be a text.',
      required_error: 'Education is required.',
    })
    .min(3, {
      message: 'Education must have at least 20 characters.',
    }),
  professionalGoal: z
    .string({
      invalid_type_error: 'Professional goal must be a text.',
    })
    .optional(),
  skills: z
    .string({
      invalid_type_error: 'Skills must be a text.',
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
  courses: z
    .string({
      invalid_type_error: 'Courses must be a text.',
    })
    .optional(),
});

type ResumeGenerateInput = z.infer<typeof resumeGenerateSchema>;

const ResumeGenerate: FC = () => {
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
      courses: '',
    },
  });

  const onResumeGenerate: SubmitHandler<ResumeGenerateInput> = (values) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onResumeGenerate)}
      style={{ minWidth: '100%' }}
    >
      <Flex direction="column" gap="4" p="8">
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
          name="professionalGoal"
          label="Professional goal"
          placeholder="What are your professional goals?"
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
          name="courses"
          label="Courses"
          placeholder="Tell me about your additional courses you have taken to enhance your skills."
          register={register}
          errors={errors}
        />

        <IconButton type="submit" size="4" aria-label="Save profile">
          <PaperPlaneIcon />
        </IconButton>
      </Flex>

      <Toaster position="top-center" />
    </form>
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
