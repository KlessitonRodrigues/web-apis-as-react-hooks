'use client';
import useAuthentication from '@/lib/hooks/useAuthenticationAPI';
import { LoadScreen } from '@packages/daisy-ui-components';
import { Suspense, useEffect } from 'react';

const AuthPageContent = () => {
  const { refreshTokenQuery } = useAuthentication();

  useEffect(() => {
    refreshTokenQuery.refetch();
    // eslint-disable-next-line
  }, []);

  return <LoadScreen title="Authentication Form" />;
};

export default function AuthPage() {
  return (
    <Suspense fallback={<LoadScreen title="Authentication Form" />}>
      <AuthPageContent />
    </Suspense>
  );
}
