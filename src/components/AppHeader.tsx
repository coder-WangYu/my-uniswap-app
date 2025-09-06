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

const AppHeader: React.FC = () => {
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
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          MyUniswap
        </Typography>
        
        <ConnectButton />
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
          Swap
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
          Pool
        </Button>
        <Button 
          variant="text" 
          onClick={() => handleNavigation('/positions')}
          sx={{ 
            color: currentPath === '/positions' ? 'primary.main' : 'text.secondary',
            fontWeight: currentPath === '/positions' ? 600 : 500,
            textDecoration: currentPath === '/positions' ? 'underline' : 'none',
          }}
        >
          Position
        </Button>
      </Box>
    </AppBar>
  );
};

export default AppHeader;
