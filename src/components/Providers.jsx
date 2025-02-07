"use client" ;
import { useEffect, useState } from 'react';
import { VerticalNavProvider } from '@/@menu/contexts/verticalNavContext';
import { SettingsProvider } from '@/@core/contexts/settingsContext';
import ThemeProvider from './theme';

// Assuming these return expected types like strings or simple objects
import { getMode, getSettingsFromCookie } from '@core/utils/serverHelpers';

const Providers = props => {
  const { children, direction } = props;
  const [mode, setMode] = useState(null); // Start with null for a loading state
  const [settingsCookie, setSettingsCookie] = useState(null);

  useEffect(() => {
    // Validate if values are correct before setting state
    const modeValue = getMode();
    const settingsCookieValue = getSettingsFromCookie();

    // Only update state if values are valid
    if (modeValue !== null && settingsCookieValue !== null) {
      setMode(modeValue);
      setSettingsCookie(settingsCookieValue);
    }
  }, []);

  // If mode or settingsCookie are still loading, display a loading state
  if (mode === null || settingsCookie === null) {
    return <p>Loading...</p>; // Or use a spinner component
  }

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <ThemeProvider direction={direction}>
          {children}
        </ThemeProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  );
};

export default Providers;
