import { Flex, PropsWithoutRefOrColor, Text, TextArea } from '@radix-ui/themes';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

type ControlledTextAreaProps<TFieldValues extends FieldValues = FieldValues> =
  PropsWithoutRefOrColor<typeof TextArea> & {
    register: UseFormRegister<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    name: Path<TFieldValues>;
    label: string;
  };

export const ControlledTextArea = <
  TFieldValues extends FieldValues = FieldValues,
>({
  register,
  errors,
  name,
  label,
  ...props
}: ControlledTextAreaProps<TFieldValues>) => {
  return (
    <Flex direction="column" gap="2">
      <Text as="label" size="4" color="amber">
        {label}
      </Text>
      <TextArea rows={10} {...register(name)} {...props} />
      {errors[name] && <Text color="red">{`${errors[name]?.message}`}</Text>}
    </Flex>
  );
};
