import { useServerTranslations } from '@/lib/hooks/useServerTranslation';
import SignOutView from '@/lib/views/authentication/SignOutView';
import { NEXTJS } from '@packages/common-types';
import { Column, Paper, Text } from '@packages/daisy-ui-components';

export default async function LogoutPage(props: NEXTJS.PageProps) {
  const { t } = await useServerTranslations(props);

  return (
    <Column>
      <Paper>
        <Text>{t('logout.confirmation')}</Text>
        <SignOutView />
      </Paper>
    </Column>
  );
}
