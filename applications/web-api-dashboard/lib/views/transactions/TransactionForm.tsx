import { useClientTranslations } from '@/lib/hooks/useClientTranslation';
import UserFormSchema from '@/lib/hooks/useFormSchema';
import { createTransactionSchemas } from '@packages/common-types';
import {
  Column,
  ConfirmModal,
  CurrencyInputField,
  Form,
  IconButton,
  Icons,
  InputField,
  Row,
  Selector,
} from '@packages/daisy-ui-components';

const TransactionsForm = () => {
  const { t, lang } = useClientTranslations();
  const schemas = createTransactionSchemas({ lang });
  const formHandlers = UserFormSchema(schemas.createTransaction);
  const { errors, watchValue, register, handleSubmit, setValue } = formHandlers;

  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Column className="max-w-4xl">
        <Row flexY="start" responsive="sm">
          <InputField
            type="text"
            label={t('forms.transactions.name')}
            placeholder="John Doe"
            before={<Icons iconType="user" />}
            inputProps={register('name')}
            error={errors.name?.message?.toString()}
          />
          <InputField
            type="date"
            placeholder="dd/mm/yyyy"
            label={t('forms.transactions.date')}
            before={<Icons iconType="calendar" />}
            inputProps={register('date')}
            error={errors.date?.message?.toString()}
          />
        </Row>
        <Row flexY="start" responsive="sm">
          <Selector
            label={t('forms.transactions.type')}
            defaultValue={watchValue('type')}
            onChange={value => setValue('type', value)}
            options={[
              { label: 'Profit', value: 'profit' },
              { label: 'Revenue', value: 'revenue' },
            ]}
            error={errors.type?.message?.toString()}
          />
          <CurrencyInputField
            type="number"
            placeholder="0.00"
            label={t('forms.transactions.value')}
            before={<Icons iconType="dollar" />}
            inputProps={register('value')}
            error={errors.value?.message?.toString()}
          />
        </Row>
      </Column>
      <Row>
        <IconButton type="submit" iconType="save" color="primary">
          {t('forms.transactions.saveBtn')}
        </IconButton>
        <ConfirmModal
          color="error"
          message="Are you sure? to delete this"
          onConfirm={() => console.log('Deleted')}
        >
          <IconButton type="button" iconType="trash" color="error">
            {t('forms.transactions.deleteBtn')}
          </IconButton>
        </ConfirmModal>
      </Row>
    </Form>
  );
};

export default TransactionsForm;
