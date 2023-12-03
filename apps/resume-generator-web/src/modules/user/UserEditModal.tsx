import { Cross1Icon } from '@radix-ui/react-icons';
import {
  Button,
  Dialog,
  Flex,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import { FC, Suspense } from 'react';
import Skeleton from 'react-loading-skeleton';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRoutePreloadedQuery } from '@resume-generator/relay';
import { useForm } from 'react-hook-form';
import { graphql } from 'react-relay';
import { z } from 'zod';
import { UserEditModalQuery } from './__generated__/UserEditModalQuery.graphql';

const userEditSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Name must be a string.',
      required_error: 'Name is required.',
    })
    .min(3, { message: 'Name must have at least 3 characters.' }),
  contact: z
    .string({
      invalid_type_error: 'Contact must be a string.',
      required_error: 'Contact is required.',
    })
    .min(1, { message: 'Contact is required.' }),
  about: z
    .string({
      invalid_type_error: 'About must be a string.',
      required_error: 'About is required.',
    })
    .min(20, { message: 'About must have at least 20 characters.' }),
  email: z
    .string({
      invalid_type_error: 'Email must be a string.',
      required_error: 'Email is required.',
    })
    .email({ message: 'Email must be valid.' }),
});

export const UserEditModal: FC = () => {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: me?.name ?? '',
      contact: me?.contact ?? '',
      about: me?.about ?? '',
      email: me?.email ?? '',
    },
  });

  return (
    <Dialog.Root defaultOpen open>
      <Dialog.Trigger>
        <Button>Edit profile</Button>
      </Dialog.Trigger>

      <Dialog.Content
        style={{
          maxWidth: '80%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* eslint-disable-next-line no-console --- TODO: add submit function */}
        <form onSubmit={handleSubmit((data) => console.log(data))}>
          <Flex direction="row" gap="9" justify="center">
            <Flex direction="column" gap="3" width="100%">
              <Dialog.Title>Edit profile</Dialog.Title>
              <Dialog.Description size="2" mb="4">
                Update your profile to improve your resume! 😁
              </Dialog.Description>

              <Flex direction="row" gap="5" justify="between">
                <div style={{ width: '100%' }}>
                  <Text as="label" htmlFor="name" size="2" mb="1" weight="bold">
                    Name
                  </Text>
                  <TextField.Input
                    {...register('name')}
                    placeholder="Enter your full name"
                  />
                  {errors.name?.message && (
                    <Text size="2" color="red">
                      {errors.name.message}
                    </Text>
                  )}
                </div>
                <div style={{ width: '100%' }}>
                  <Text as="label" htmlFor="name" size="2" mb="1" weight="bold">
                    Email
                  </Text>
                  <TextField.Input
                    {...register('email')}
                    placeholder="Enter your email"
                  />
                  {errors.email?.message && (
                    <Text size="2" color="red">
                      {errors.email.message}
                    </Text>
                  )}
                </div>
                <div style={{ width: '100%' }}>
                  <Text
                    as="label"
                    htmlFor="contact"
                    size="2"
                    mb="1"
                    weight="bold"
                  >
                    Contact
                  </Text>
                  <TextField.Input
                    {...register('contact')}
                    placeholder="Enter your preferred contact (e.g. email, phone number)"
                  />
                  {errors.contact?.message && (
                    <Text size="2" color="red">
                      {errors.contact.message}
                    </Text>
                  )}
                </div>
              </Flex>

              <div>
                <Text as="label" htmlFor="about" size="2" mb="1" weight="bold">
                  About
                </Text>
                <TextArea
                  {...register('about')}
                  size="3"
                  placeholder="Tell us about yourself! (e.g. your story, hobbies, interests, etc.)"
                  style={{ height: '400px' }}
                />
                {errors.about?.message && (
                  <Text size="2" color="red">
                    {errors.about.message}
                  </Text>
                )}
              </div>
            </Flex>
            <Flex direction="column" gap="7" style={{ maxWidth: '250px' }}>
              <Flex justify="end">
                <Dialog.Close>
                  <Button aria-label="Close" type="submit">
                    <Cross1Icon />
                  </Button>
                </Dialog.Close>
              </Flex>
              <img
                src="/question-mark.webp"
                alt="Question Mark"
                style={{ maxWidth: '350px', borderRadius: '10px' }}
              />
              <Text>
                <Text as="span" size="2" weight="bold">
                  Pro tip:
                </Text>{' '}
                Be as descriptive as possible about yourself, you can reuse your
                profile from{' '}
                <Text as="span" size="2" weight="bold">
                  Contra
                </Text>
                ,{' '}
                <Text as="span" size="2" weight="bold">
                  Linkedin
                </Text>
                ,{' '}
                <Text as="span" size="2" weight="bold">
                  Fiver
                </Text>
                , etc.
              </Text>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const UserEditModalSkeleton: FC = () => <Skeleton width={100} height={100} />;

export const Component: FC = () => (
  <Suspense fallback={<UserEditModalSkeleton />}>
    <UserEditModal />
  </Suspense>
);
Component.displayName = 'UserEditModal';
