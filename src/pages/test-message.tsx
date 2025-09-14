import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useMessage } from '../contexts/MessageContext';

const TestMessagePage = () => {
  const message = useMessage();

  const handleSuccess = () => {
    message.success('操作成功！');
  };

  const handleError = () => {
    message.error('操作失败！');
  };

  const handleWarning = () => {
    message.warning('请注意！');
  };

  const handleInfo = () => {
    message.info('这是一条信息');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        MUI Message 功能测试
      </Typography>
      
      <Stack spacing={2} direction="row" flexWrap="wrap">
        <Button variant="contained" color="success" onClick={handleSuccess}>
          成功消息
        </Button>
        
        <Button variant="contained" color="error" onClick={handleError}>
          错误消息
        </Button>
        
        <Button variant="contained" color="warning" onClick={handleWarning}>
          警告消息
        </Button>
        
        <Button variant="contained" color="info" onClick={handleInfo}>
          信息消息
        </Button>
      </Stack>
    </Box>
  );
};

export default TestMessagePage;
