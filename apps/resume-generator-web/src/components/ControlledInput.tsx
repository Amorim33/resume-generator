import {
  Flex,
  PropsWithoutRefOrColor,
  Text,
  TextField,
} from '@radix-ui/themes';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

type ControlledInputProps<TFieldValues extends FieldValues = FieldValues> =
  PropsWithoutRefOrColor<typeof TextField.Input> & {
    register: UseFormRegister<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    name: Path<TFieldValues>;
    label: string;
  };

export const ControlledInput = <
  TFieldValues extends FieldValues = FieldValues,
>({
  register,
  errors,
  name,
  label,
  ...props
}: ControlledInputProps<TFieldValues>) => {
  return (
    <Flex direction="column" gap="2" width="100%">
      <Text as="label" size="4" color="amber">
        {label}
      </Text>
      <TextField.Input {...register(name)} {...props} />
      {errors[name] && <Text color="red">{`${errors[name]?.message}`}</Text>}
    </Flex>
  );
};
