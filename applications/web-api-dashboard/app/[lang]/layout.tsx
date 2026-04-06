import { generateStaticParams, setTranslationEnv } from '@/lib/hooks/useServerTranslation';
import NavBarView from '@/lib/views/navigation/NavbarView';
import { NEXTJS } from '@packages/common-types';
import { LoadScreen, Page, PageContent, Toastify } from '@packages/daisy-ui-components';
import { Suspense } from 'react';

export { generateStaticParams };

export default async function PageLayout(props: NEXTJS.PageProps) {
  setTranslationEnv((await props.params)?.lang);

  return (
    <Suspense fallback={<LoadScreen />}>
      <Page>
        <NavBarView />
        <PageContent>{props.children}</PageContent>
        <Toastify />
      </Page>
    </Suspense>
  );
}
