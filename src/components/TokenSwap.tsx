import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
} from '@mui/material';
import SwapInput from './SwapInput';
import SwapButton from './SwapButton';
import SwapToggle from './SwapToggle';

interface Token {
  symbol: string;
  name: string;
  balance?: number;
  logo?: string;
}

const TokenSwap = () => {
  const [fromValue, setFromValue] = useState<string>('0');
  const [toValue, setToValue] = useState<string>('0');
  
  const [fromToken, setFromToken] = useState<Token>({
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 23.491
  });
  
  const [toToken, setToToken] = useState<Token>({
    symbol: 'XRP',
    name: 'Ripple',
    balance: 0
  });

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    const tempValue = fromValue;
    setFromValue(toValue);
    setToValue(tempValue);
  };

  const handleSwap = () => {
    console.log('Swapping', fromValue, fromToken.symbol, 'for', toValue, toToken.symbol);
    // 这里将来可以添加实际的交换逻辑
  };

  const handleMaxClick = () => {
    if (fromToken.balance) {
      setFromValue(fromToken.balance.toString());
    }
  };

  const isSwapDisabled = fromValue === '0' || parseFloat(fromValue) <= 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        maxWidth: 480,
        width: '100%',
      }}
    >
      <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        交换
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SwapInput
          value={fromValue}
          onChange={setFromValue}
          token={fromToken}
          onSelectToken={() => console.log('Select from token')}
          showMax={true}
          onMaxClick={handleMaxClick}
        />
        
        <SwapToggle onClick={handleSwapTokens} />
        
        <SwapInput
          value={toValue}
          onChange={setToValue}
          token={toToken}
          onSelectToken={() => console.log('Select to token')}
        />
        
        <Box sx={{ mt: 2 }}>
          <SwapButton 
            onClick={handleSwap} 
            disabled={isSwapDisabled}
            text="交换"
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default TokenSwap;

