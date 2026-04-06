import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const UserFormSchema = <T,>(schema: T) => {
  // @ts-expect-error - typeError
  const resolver = zodResolver(schema);
  const { formState, register, handleSubmit, ...form } = useForm({
    resolver,
    shouldFocusError: true,
  });

  return {
    errors: formState.errors,
    setValue: form.setValue,
    watchValue: form.watch,
    register,
    handleSubmit,
  };
};

export default UserFormSchema;
