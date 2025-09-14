import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface MessageState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface MessageContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messageState, setMessageState] = useState<MessageState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showMessage = useCallback((message: string, severity: AlertColor) => {
    setMessageState({
      open: true,
      message,
      severity,
    });
  }, []);

  const handleClose = useCallback(() => {
    setMessageState(prev => ({
      ...prev,
      open: false,
    }));
  }, []);

  const messageApi = {
    success: (message: string) => showMessage(message, 'success'),
    error: (message: string) => showMessage(message, 'error'),
    warning: (message: string) => showMessage(message, 'warning'),
    info: (message: string) => showMessage(message, 'info'),
  };

  return (
    <MessageContext.Provider value={messageApi}>
      {children}
      <Snackbar
        open={messageState.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }} // 避免被导航栏遮挡
      >
        <Alert
          onClose={handleClose}
          severity={messageState.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {messageState.message}
        </Alert>
      </Snackbar>
    </MessageContext.Provider>
  );
};

export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
