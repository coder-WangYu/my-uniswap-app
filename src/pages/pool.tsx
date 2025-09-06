import type { NextPage } from 'next';
import Head from 'next/head';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { darkTheme } from '../theme/theme';
import AppHeader from '../components/AppHeader';
import PoolList from '../components/PoolList';

const Pool: NextPage = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Head>
        <title>Pool - MyUniswap</title>
        <meta
          content="MyUniswap - 流动性池"
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
    </ThemeProvider>
  );
};

export default Pool;
