import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import ThemeToggleButton from './ThemeToggleButton';

const AppHeader = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'transparent',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        color: 'text.primary', // 确保AppBar使用主题文字颜色
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            color: 'text.primary', // 明确设置文字颜色
          }}
        >
          MyUniswap
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThemeToggleButton />
          <ConnectButton />
        </Box>
      </Toolbar>
      
      {/* 使用绝对定位将导航按钮放置在中间 */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          gap: 1,
        }}
      >
        <Button 
          variant="text" 
          onClick={() => handleNavigation('/')}
          sx={{ 
            color: currentPath === '/' ? 'primary.main' : 'text.secondary',
            fontWeight: currentPath === '/' ? 600 : 500,
            textDecoration: currentPath === '/' ? 'underline' : 'none',
          }}
        >
          交换
        </Button>
        <Button 
          variant="text" 
          onClick={() => handleNavigation('/pool')}
          sx={{ 
            color: currentPath === '/pool' ? 'primary.main' : 'text.secondary',
            fontWeight: currentPath === '/pool' ? 600 : 500,
            textDecoration: currentPath === '/pool' ? 'underline' : 'none',
          }}
        >
          流动性池
        </Button>
        <Button 
          variant="text" 
          onClick={() => handleNavigation('/explore')}
          sx={{ 
            color: currentPath === '/explore' ? 'primary.main' : 'text.secondary',
            fontWeight: currentPath === '/explore' ? 600 : 500,
            textDecoration: currentPath === '/explore' ? 'underline' : 'none',
          }}
        >
          Explore
        </Button>
      </Box>
    </AppBar>
  );
};

export default AppHeader;
