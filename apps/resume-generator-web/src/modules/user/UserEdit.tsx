import { Flex, Heading, IconButton, Text } from '@radix-ui/themes';
import { animated, useSpring } from '@react-spring/web';
import { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { graphql, useFragment, useMutation } from 'react-relay';
import { useOutletContext } from 'react-router-dom';
import { z } from 'zod';
import { ControlledInput } from '../../components/ControlledInput';
import { ControlledTextArea } from '../../components/ControlledTextArea';
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

  const [springs, api] = useSpring(() => ({
    from: { opacity: 0, x: 2500 },
    to: { opacity: 1, x: 0 },
  }));

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

        api.start({
          from: {
            x: 0,
          },
          to: {
            x: 2500,
          },
          onRest: () => {
            api.start({
              from: {
                x: 2500,
              },
              to: {
                x: 0,
              },
            });
          },
        });

        saveSession(data.UserUpsert.me.id);
        toast.success('Profile updated successfully.');
      },
      onError: () => {
        toast.error('Unexpected error. Please try again.');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onUserUpsert)} style={{ minWidth: '100%' }}>
      <Flex direction="column" gap="4" p="8">
        <Flex direction="column" gap="3" width="100%">
          <Heading size="9" color="amber">
            Edit profile
          </Heading>
          <Text size="6" mb="4">
            Update your profile to improve your resume! 😁
          </Text>

          <Flex direction="row" gap="5" justify="between">
            <ControlledInput
              name="name"
              label="Name"
              register={register}
              errors={errors}
              placeholder="Enter your name"
            />

            <ControlledInput
              name="email"
              label="Email"
              register={register}
              errors={errors}
              placeholder="Enter your email"
              disabled={!!me?.email}
            />
            <ControlledInput
              name="contact"
              label="Contact"
              register={register}
              errors={errors}
              placeholder="Enter your preferred contact (it will be used on your resume)"
            />
          </Flex>

          <ControlledTextArea
            name="about"
            label="About"
            register={register}
            errors={errors}
            rows={20}
          />
        </Flex>
        <Text size="4" color="amber">
          <Text as="span" weight="bold">
            Pro tip:
          </Text>{' '}
          Be as descriptive as possible about yourself, you can reuse your
          profile from{' '}
          <Text as="span" weight="bold">
            Contra
          </Text>
          ,{' '}
          <Text as="span" weight="bold">
            Linkedin
          </Text>
          ,{' '}
          <Text as="span" weight="bold">
            Fiver
          </Text>
          , etc.
        </Text>
        <animated.div style={springs}>
          <IconButton
            type="submit"
            disabled={isPendingUserUpsert}
            size="4"
            aria-label="Save profile"
          >
            <PaperPlaneIcon />
          </IconButton>
        </animated.div>
      </Flex>

      <Toaster position="top-center" />
    </form>
  );
};

export const Component: FC = () => {
  const { queryRef } = useOutletContext<OutletContext>();

  return (
    <Flex width="100%" height="100%">
      <UserEdit queryRef={queryRef} />
    </Flex>
  );
};
Component.displayName = 'UserEdit';
