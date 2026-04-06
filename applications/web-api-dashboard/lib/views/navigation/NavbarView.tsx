'use client';
import useAuthentication from '@/lib/hooks/useAuthenticationAPI';
import { useClientTranslations } from '@/lib/hooks/useClientTranslation';
import useUserStore from '@/lib/store/user';
import {
  Breadcumbs,
  BreadcumbsProps,
  DescriptionMenu,
  DescriptionMenuProps,
  Menu,
  MenuProps,
  NavBar,
  NotificationList,
  Row,
  getDefaultLanguage,
} from '@packages/daisy-ui-components';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const getMenuItems = (pathname: string) => {
  const lang = getDefaultLanguage();
  const { t } = useClientTranslations();

  const descriptionMenuItems: DescriptionMenuProps['items'] = [
    {
      icon: 'home',
      label: t('navigation.home.label'),
      description: t('navigation.home.description'),
      href: `/${lang}/home/`,
      active: pathname === `/${lang}/home/`,
    },
    {
      icon: 'chart',
      label: t('navigation.dashboard.label'),
      description: t('navigation.dashboard.description'),
      href: `/${lang}/dashboard/`,
      active: pathname === `/${lang}/dashboard/`,
    },
    {
      icon: 'email',
      label: t('navigation.help.label'),
      description: t('navigation.help.description'),
      href: `/${lang}/help/`,
      active: pathname === `/${lang}/help/`,
    },
  ];

  const menuItems: MenuProps['items'] = [
    {
      icon: 'user',
      label: t('navigation.profile.label'),
      href: `/${lang}/profile/`,
      active: pathname === `/${lang}/profile/`,
    },
    {
      icon: 'settings',
      label: t('navigation.settings.label'),
      href: `/${lang}/settings/`,
      active: pathname === `/${lang}/settings/`,
    },
    {
      icon: 'signOut',
      label: t('navigation.logout.label'),
      href: `/${lang}/logout/`,
      active: pathname === `/${lang}/logout/`,
    },
  ];

  const pathItems: BreadcumbsProps['items'] = [];
  pathItems.push(descriptionMenuItems[0]);
  [...descriptionMenuItems, ...menuItems].forEach((item, i) => {
    if (i === 0) return;
    if (item?.active) pathItems.push(item);
  });

  return { descriptionMenuItems, menuItems, pathItems };
};

const notificationList = [
  { id: '1', message: 'Teste notification 1' },
  { id: '2', message: 'Teste notification 2' },
  { id: '3', message: 'Teste notification 3' },
  { id: '4', message: 'Teste notification 4' },
  { id: '5', message: 'Teste notification 5' },
];

const NavBarView = () => {
  const pathname = usePathname();
  const { refreshTokenQuery } = useAuthentication();
  const { descriptionMenuItems, menuItems, pathItems } = getMenuItems(pathname);
  const { user } = useUserStore();
  const { t } = useClientTranslations();

  useEffect(() => {
    refreshTokenQuery.refetch();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <NavBar
        title={t('navigation.appName')}
        userName={user?.name}
        userNotifications={notificationList.length}
        sidebarComponent={<DescriptionMenu items={descriptionMenuItems} />}
        userMenuComponent={<Menu items={menuItems} />}
        notificationsComponent={
          <NotificationList
            title={t('navigation.notifications.label')}
            noNotificationsMessage={t('navigation.notifications.emptyLabel')}
            notifications={notificationList}
          />
        }
      />
      <Row className="px-2 xl:px-0">
        <Breadcumbs items={pathItems} />
      </Row>
    </>
  );
};

export default NavBarView;
