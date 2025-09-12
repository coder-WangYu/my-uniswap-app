import type { NextPage } from 'next';
import Head from 'next/head';
import { CssBaseline, Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { CustomThemeProvider } from '../contexts/ThemeContext';
import AppHeader from '../components/AppHeader';
import TokensList from '../components/TokensList';
import PoolsList from '../components/PoolsList';
import TransactionsList from '../components/TransactionsList';

const Explore: NextPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <TokensList />;
      case 1:
        return <PoolsList />;
      case 2:
        return <TransactionsList />;
      default:
        return <TokensList />;
    }
  };

  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Head>
        <title>Explore - MyUniswap</title>
        <meta
          content="MyUniswap - 探索代币、流动性池和交易"
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
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            {/* 页面标题 */}
            <Box sx={{ mb: 3 }}>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 600, color: 'inherit' }}>
                Explore
              </h1>
            </Box>

            {/* 导航标签 */}
            <Box sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    minHeight: 48,
                    '&.Mui-selected': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  },
                }}
              >
                <Tab label="代币" />
                <Tab label="流动性池" />
                <Tab label="交易" />
              </Tabs>
            </Box>

            {/* 标签内容 */}
            {renderTabContent()}
          </Box>
        </Box>
      </Box>
    </CustomThemeProvider>
  );
};

export default Explore;
