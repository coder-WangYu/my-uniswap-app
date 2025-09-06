import type { NextPage } from 'next';
import Head from 'next/head';
import { CssBaseline, Box } from '@mui/material';
import { CustomThemeProvider } from '../contexts/ThemeContext';
import AppHeader from '../components/AppHeader';
import MyPositions from '../components/MyPositions';

const Positions: NextPage = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Head>
        <title>Positions - MyUniswap</title>
        <meta
          content="MyUniswap - 我的持仓"
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
          <MyPositions />
        </Box>
      </Box>
    </CustomThemeProvider>
  );
};

export default Positions;
