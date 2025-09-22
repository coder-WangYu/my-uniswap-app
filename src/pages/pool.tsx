import type { NextPage } from 'next';
import Head from 'next/head';
import { CssBaseline, Box } from '@mui/material';
import { CustomThemeProvider } from '../contexts/ThemeContext';
import AppHeader from '../components/AppHeader';
import PositionList from '../components/PositionList';

const Pool: NextPage = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Head>
        <title>头寸 - MyUniswap</title>
        <meta
          content="MyUniswap - 头寸管理"
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
          <PositionList />
        </Box>
      </Box>
    </CustomThemeProvider>
  );
};

export default Pool;
