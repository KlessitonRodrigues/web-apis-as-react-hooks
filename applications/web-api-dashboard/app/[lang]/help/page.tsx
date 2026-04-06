import { useServerTranslations } from '@/lib/hooks/useServerTranslation';
import { NEXTJS } from '@packages/common-types';
import { Column, Paper, TitleIcon } from '@packages/daisy-ui-components';

export default async function HelpPage(props: NEXTJS.PageProps) {
  const { t } = await useServerTranslations(props);

  return (
    <Column>
      <Paper>
        <TitleIcon title={t('help.title')} icon="questionMark" />
      </Paper>
    </Column>
  );
}
