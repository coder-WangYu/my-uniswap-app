import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Box, CircularProgress, Backdrop, Typography } from '@mui/material';

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  setLoading: (loading: boolean, text?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('加载中...');

  const setLoading = (loading: boolean, text: string = '加载中...') => {
    setIsLoading(loading);
    setLoadingText(text);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, loadingText, setLoading }}>
      {children}
      
      {/* 全局Loading遮罩 */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.modal + 1, // 确保在弹窗上层
          backgroundColor: 'rgba(0, 0, 0, 0.85)', // 进一步加深背景颜色
        }}
        open={isLoading}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            padding: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <CircularProgress 
            size={70} 
            thickness={3}
            sx={{ 
              color: 'primary.main',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              fontWeight: 500,
              textAlign: 'center',
              maxWidth: 300,
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            {loadingText}
          </Typography>
        </Box>
      </Backdrop>
    </LoadingContext.Provider>
  );
};
