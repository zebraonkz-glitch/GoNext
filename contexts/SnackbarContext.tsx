import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar } from 'react-native-paper';

interface SnackbarContextValue {
  showMessage: (message: string) => void;
  showError: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const showMessage = useCallback((text: string) => {
    setMessage(text);
    setVisible(true);
  }, []);

  const showError = useCallback((text: string) => {
    setMessage(text);
    setVisible(true);
  }, []);

  const value = useMemo(
    () => ({
      showMessage,
      showError,
    }),
    [showMessage, showError]
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={4000}
        action={{
          label: t('common.ok'),
          onPress: () => setVisible(false),
        }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextValue {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar должен использоваться внутри SnackbarProvider');
  }
  return context;
}
