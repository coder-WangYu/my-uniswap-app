import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useLoading } from '../contexts/LoadingContext';

const TestLoadingPage: React.FC = () => {
  const { setLoading } = useLoading();

  const handleTestLoading = () => {
    setLoading(true, "测试加载中...");
    
    // 模拟异步操作
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handleTestLongLoading = () => {
    setLoading(true, "长时间加载测试...");
    
    // 模拟长时间异步操作
    setTimeout(() => {
      setLoading(false);
    }, 8000);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          全局Loading测试
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          点击下面的按钮测试全局loading功能。loading期间页面会被遮罩，无法进行其他操作。
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={handleTestLoading}
            sx={{ minWidth: 150 }}
          >
            测试3秒Loading
          </Button>
          
          <Button 
            variant="contained" 
            color="secondary"
            onClick={handleTestLongLoading}
            sx={{ minWidth: 150 }}
          >
            测试8秒Loading
          </Button>
        </Box>
        
        <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
          注意：Loading期间整个页面会被遮罩，无法点击任何按钮或进行其他操作。
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestLoadingPage;
