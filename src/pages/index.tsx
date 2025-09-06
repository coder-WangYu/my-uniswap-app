import type { NextPage } from 'next';
import Head from 'next/head';
import { CssBaseline, Box } from '@mui/material';
import { CustomThemeProvider } from '../contexts/ThemeContext';
import AppHeader from '../components/AppHeader';
import TokenSwap from '../components/TokenSwap';

const Home: NextPage = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Head>
        <title>MyUniswap</title>
        <meta
          content="MyUniswap - 去中心化代币交换"
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <TokenSwap />
        </Box>
      </Box>
    </CustomThemeProvider>
  );
};

export default Home;
