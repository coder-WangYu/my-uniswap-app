import React, { useState, useMemo, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { Warning, Info } from '@mui/icons-material';
import SwapInput from './SwapInput';
import SwapButton from './SwapButton';
import SwapToggle from './SwapToggle';
import TokenSelectorModal from './TokenSelectorModal';
import { tokensConfig } from '../libs/contracts';
import { useUser } from '../hooks/useUser';

interface Token {
  symbol: string;
  name: string;
  balance?: number;
  logo?: string;
  address: string;
  price?: number;
  volume24h?: number;
}

const TokenSwap = () => {
  const [fromValue, setFromValue] = useState<string>('0');
  const [toValue, setToValue] = useState<string>('0');
  const [fromToken, setFromToken] = useState<Token>({
    ...tokensConfig.ETH,
    balance: 23.491,
    price: 3092.77,
  });
  const [toToken, setToToken] = useState<Token>({
    symbol: '',
    name: '选择代币',
    address: '',
    balance: 0,
    price: 0,
  });
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false);
  const [selectingToken, setSelectingToken] = useState<'from' | 'to'>('from');
  const { address, isConnected } = useUser();

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

  const handleSelectFromToken = () => {
    setSelectingToken('from');
    setTokenSelectorOpen(true);
  };

  const handleSelectToToken = () => {
    setSelectingToken('to');
    setTokenSelectorOpen(true);
  };

  const handleTokenSelect = (token: Token) => {
    if (selectingToken === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
  };

  // 动态计算按钮文本和状态
  const { buttonText, isDisabled, errorMessage } = useMemo(() => {
    if(!isConnected) {
      return {
        buttonText: '点右上角连接钱包',
        isDisabled: true,
        errorMessage: null
      };
    }

    const fromAmount = parseFloat(fromValue) || 0;
    
    // 如果购买代币未选择
    if (!toToken.symbol) {
      return {
        buttonText: '选择代币',
        isDisabled: true,
        errorMessage: null
      };
    }
    
    // 如果输入金额为0或无效
    if (fromAmount === 0) {
      return {
        buttonText: '输入金额',
        isDisabled: true,
        errorMessage: null
      };
    }
    
    // 如果余额不足
    if (fromToken.balance !== undefined && fromAmount > fromToken.balance) {
      return {
        buttonText: `${fromToken.symbol} 不足`,
        isDisabled: true,
        errorMessage: `${fromToken.symbol} 不足, 无法兑换`
      };
    }
    
    // 如果金额足够
    return {
      buttonText: '立即交换',
      isDisabled: false,
      errorMessage: null
    };
  }, [isConnected, fromValue, fromToken.balance, fromToken.symbol, toToken.symbol]);

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
        {/* 出售部分 */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
            出售
          </Typography>
          <SwapInput
            value={fromValue}
            onChange={setFromValue}
            token={fromToken}
            onSelectToken={handleSelectFromToken}
            showMax={true}
            onMaxClick={handleMaxClick}
            showUsdValue={true}
            usdValue={fromToken.price ? (parseFloat(fromValue) * fromToken.price).toFixed(2) : '0'}
          />
        </Box>
        
        <SwapToggle onClick={handleSwapTokens} />
        
        {/* 购买部分 */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
            购买
          </Typography>
          <SwapInput
            value={toValue}
            onChange={setToValue}
            token={toToken}
            onSelectToken={handleSelectToToken}
            showUsdValue={true}
            usdValue={toToken.price ? (parseFloat(toValue) * toToken.price).toFixed(2) : '0'}
          />
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <SwapButton 
            onClick={handleSwap} 
            disabled={isDisabled}
            text={buttonText}
          />
          
          {/* 错误信息 */}
          {errorMessage && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning sx={{ color: 'warning.main', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                {errorMessage}
              </Typography>
            </Box>
          )}
          
          {/* Gas费用说明 */}
          <Box sx={{ mt: 2 }}>
            <Alert 
              severity="info" 
              icon={<Info />}
              sx={{ 
                backgroundColor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                这是在区块链上处理你的交易的费用。Uniswap 不从这些费用分成。
              </Typography>
              <Link
                href="#"
                variant="body2"
                sx={{ 
                  color: 'primary.main', 
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'none'
                  }
                }}
              >
                了解详情
              </Link>
            </Alert>
          </Box>
        </Box>
      </Box>

      <TokenSelectorModal
        open={tokenSelectorOpen}
        onClose={() => setTokenSelectorOpen(false)}
        onSelectToken={handleTokenSelect}
        currentToken={selectingToken === 'from' ? fromToken : toToken}
        title="选择代币"
      />
    </Paper>
  );
};

export default TokenSwap;

