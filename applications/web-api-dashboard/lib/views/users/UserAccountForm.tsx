'use client';
import { useClientTranslations } from '@/lib/hooks/useClientTranslation';
import UserFormSchema from '@/lib/hooks/useFormSchema';
import { createUserSchema } from '@packages/common-types';
import { Form, IconButton, Icons, InputField, Row } from '@packages/daisy-ui-components';

const UserAccountForm = () => {
  const { t } = useClientTranslations();
  const { errors, register, handleSubmit } = UserFormSchema(createUserSchema);

  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
      <Row responsive="md" flexY="start">
        <InputField
          type="text"
          label={t('forms.users.phone')}
          placeholder="(xx) xxxxx-xxxx"
          before={<Icons iconType="phone" />}
          inputProps={register('phone')}
          error={errors.phone?.message?.toString()}
        />
        <InputField
          type="text"
          label={t('forms.users.phone2')}
          placeholder="(xx) xxxxx-xxxx"
          before={<Icons iconType="phone" />}
          inputProps={register('phone2')}
          error={errors.phone2?.message?.toString()}
        />
      </Row>
      <Row responsive="md" flexY="start">
        <InputField
          type="text"
          label={t('forms.users.city')}
          placeholder="San Francisco"
          before={<Icons iconType="address" />}
          inputProps={register('addressCity')}
          error={errors.addressCity?.message?.toString()}
        />
        <InputField
          size="lg"
          type="text"
          label={t('forms.users.street')}
          placeholder="Saint Artunes, 123"
          before={<Icons iconType="address" />}
          inputProps={register('addressStreet')}
          error={errors.addressStreet?.message?.toString()}
        />
      </Row>
      <Row responsive="md" flexY="start">
        <InputField
          type="text"
          label={t('forms.users.state')}
          placeholder="California"
          before={<Icons iconType="address" />}
          inputProps={register('addressState')}
          error={errors.addressState?.message?.toString()}
        />
        <InputField
          type="text"
          label={t('forms.users.zipCode')}
          placeholder="94103"
          before={<Icons iconType="address" />}
          inputProps={register('addressZip')}
          error={errors.addressZip?.message?.toString()}
        />
      </Row>

      <Row>
        <IconButton type="submit" iconType="save" color="primary">
          {t('forms.users.saveBtn')}
        </IconButton>
      </Row>
    </Form>
  );
};

export default UserAccountForm;
