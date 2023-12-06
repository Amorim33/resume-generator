import {
  Button,
  Flex,
  Heading,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { graphql, useFragment, useMutation } from 'react-relay';
import { useOutletContext } from 'react-router-dom';
import { z } from 'zod';
import { OutletContext } from '../../lib/context';
import { saveSession } from '../../lib/session';
import { UserEditMutation } from './__generated__/UserEditMutation.graphql';
import { UserEdit_query$key } from './__generated__/UserEdit_query.graphql';

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

type UserEditInput = z.infer<typeof userEditSchema>;

type UserEditProps = {
  queryRef: UserEdit_query$key;
};

const UserEdit: FC<UserEditProps> = ({ queryRef }) => {
  const { me } = useFragment(
    graphql`
      fragment UserEdit_query on Query {
        me {
          id
          name
          email
          contact
          about
        }
      }
    `,
    queryRef,
  );

  const [userUpsert, isPendingUserUpsert] = useMutation<UserEditMutation>(
    graphql`
      mutation UserEditMutation($input: UserUpsertInput!) {
        UserUpsert(input: $input) {
          me {
            id
            name
            email
            contact
            about
          }
          errors {
            details
          }
        }
      }
    `,
  );

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

  const onUserUpsert: SubmitHandler<UserEditInput> = (values) => {
    userUpsert({
      variables: {
        input: {
          user: values,
        },
      },
      updater: (store) => {
        const newRecord = store
          .getRootField('UserUpsert')
          ?.getLinkedRecord('me');
        if (!newRecord) {
          return;
        }

        store.getRoot().setLinkedRecord(newRecord, 'me');
      },
      onCompleted: (data) => {
        if (data.UserUpsert?.errors?.length) {
          data.UserUpsert.errors.forEach((error) => {
            toast.error(error.details);
          });
          return;
        }

        if (!data.UserUpsert?.me) {
          toast.error('Unexpected error. Please try again.');
          return;
        }

        saveSession(data.UserUpsert.me.id);
        toast.success('Profile updated successfully.');
      },
      onError: () => {
        toast.error('Unexpected error. Please try again.');
      },
    });
  };

  return (
    <Flex p="5">
      <form onSubmit={handleSubmit(onUserUpsert)}>
        <Flex direction="row" gap="9" justify="center">
          <Flex direction="column" gap="3" width="100%">
            <Heading>Edit profile</Heading>
            <Text size="2" mb="4">
              Update your profile to improve your resume! 😁
            </Text>

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
                  disabled={!!me?.email}
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
          <Flex
            direction="column"
            justify="between"
            style={{ maxWidth: '250px' }}
          >
            <img
              src="/question-mark.webp"
              alt="Question Mark Cartoon"
              style={{ maxWidth: '350px', borderRadius: '10px' }}
              loading="lazy"
              decoding="async"
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

            <Button type="submit" disabled={isPendingUserUpsert}>
              {isPendingUserUpsert ? (
                <Text size="2">Saving...</Text>
              ) : (
                <Text size="2">Save</Text>
              )}
            </Button>
          </Flex>
        </Flex>
        <Toaster position="top-center" />
      </form>
    </Flex>
  );
};

export const Component: FC = () => {
  const { queryRef } = useOutletContext<OutletContext>();

  return (
    <Flex direction="column" align="center" gap="5">
      <UserEdit queryRef={queryRef} />
    </Flex>
  );
};
Component.displayName = 'UserEdit';
