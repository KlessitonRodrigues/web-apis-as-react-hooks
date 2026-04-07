import {
  generateStaticParams,
  setTranslationEnv,
  useServerTranslations,
} from '@/lib/hooks/useServerTranslation';
import { NEXTJS } from '@packages/common-types';
import { LoadScreen, NavBar, Page, PageContent, Toastify } from '@packages/daisy-ui-components';
import { Suspense } from 'react';

export { generateStaticParams };

export default async function PageLayout(props: NEXTJS.PageProps) {
  const { t } = await useServerTranslations(props);
  setTranslationEnv((await props.params)?.lang);

  return (
    <Suspense fallback={<LoadScreen />}>
      <Page>
        <NavBar title={t('navigation.appName')} />
        <PageContent>{props.children}</PageContent>
        <Toastify />
      </Page>
    </Suspense>
  );
}
