import type { NextPage } from 'next';
import Head from 'next/head';
import { CssBaseline, Box } from '@mui/material';
import { CustomThemeProvider } from '../contexts/ThemeContext';
import AppHeader from '../components/AppHeader';
import PoolList from '../components/PoolList';

const Pool: NextPage = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Head>
        <title>流动性池 - MyUniswap</title>
        <meta
          content="MyUniswap - 流动性池管理"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppHeader />
        
        <Box
          sx={{
            flex: 1,
            p: 3,
          }}
        >
          <PoolList />
        </Box>
      </Box>
    </CustomThemeProvider>
  );
};

export default Pool;
