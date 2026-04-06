import { useServerTranslations } from '@/lib/hooks/useServerTranslation';
import SettingsView from '@/lib/views/system/SettingsView';
import { NEXTJS } from '@packages/common-types';
import { Column, Paper, TitleIcon } from '@packages/daisy-ui-components';

export default async function SettingsPage(props: NEXTJS.PageProps) {
  const { t } = await useServerTranslations(props);

  return (
    <Column>
      <Paper>
        <TitleIcon title={t('settings.title')} icon="settings" />
        <SettingsView />
      </Paper>
    </Column>
  );
}
