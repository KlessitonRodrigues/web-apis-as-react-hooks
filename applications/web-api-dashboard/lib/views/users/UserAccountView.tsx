'use client';
import useUserStore from '@/lib/store/user';
import { Column, DataDisplay, Icons, Row } from '@packages/daisy-ui-components';

const UserAccountView = () => {
  const { user } = useUserStore();

  return (
    <Row flexX="start" responsive="md" gap={4}>
      <Row className="border p-16 w-fit">
        <Icons iconType="user" iconSize="1.8rem" />
      </Row>
      <Column>
        <DataDisplay label="ID" value={user?.id || 'User Account'} />
        <DataDisplay label="Name" value={user?.name || 'User Account'} />
        <DataDisplay label="Email" value={user?.email || 'User Account'} />
      </Column>
    </Row>
  );
};

export default UserAccountView;
