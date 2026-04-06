'use client';

import {
  Column,
  RadioInputField,
  Selector,
  Switch,
  getDefaultLanguage,
  isDarkTheme,
  setDefaultLanguage,
  setTheme,
} from '@packages/daisy-ui-components';

const SettingsView = () => {
  const isDarkMode = isDarkTheme();

  return (
    <Column flexX="start" className="max-w-md">
      <Selector
        label="Language"
        defaultValue={getDefaultLanguage()}
        onChange={value => setDefaultLanguage(value)}
        options={[
          { label: 'English', value: 'en' },
          { label: 'Portuguese', value: 'pt' },
        ]}
      />
      <Switch
        label="Dark Mode"
        checked={isDarkMode}
        onChange={setDark => setTheme(setDark ? 'dark' : 'light')}
      />
    </Column>
  );
};

export default SettingsView;
