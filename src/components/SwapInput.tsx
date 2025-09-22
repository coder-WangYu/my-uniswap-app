import React from 'react';
import {
  Box,
  TextField,
  Typography,
} from '@mui/material';
import TokenSelector from './TokenSelector';

interface Token {
  symbol: string;
  name: string;
  balance?: number;
  logo?: string;
}

interface SwapInputProps {
  value: string;
  onChange: (value: string) => void;
  token: Token;
  onSelectToken: () => void;
  usdValue?: string;
  showUsdValue?: boolean;
  showMax?: boolean;
  onMaxClick?: () => void;
  placeholder?: string;
  readOnly?: boolean;
}

const SwapInput = ({
  value,
  onChange,
  token,
  onSelectToken,
  usdValue,
  showUsdValue = false,
  showMax = false,
  onMaxClick,
  placeholder = "0.00",
  readOnly = false,
}: SwapInputProps) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 3,
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            value={value}
            onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
            placeholder={placeholder}
            variant="standard"
            disabled={readOnly}
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '2rem',
                fontWeight: 600,
                color: readOnly ? 'text.secondary' : 'text.primary',
                cursor: readOnly ? 'not-allowed' : 'text',
                '&.Mui-disabled': {
                  color: 'text.secondary',
                  WebkitTextFillColor: 'text.secondary',
                },
              },
            }}
            sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                padding: 0,
              },
              '& .MuiInputBase-root.Mui-disabled': {
                color: 'text.secondary',
              },
            }}
          />
        </Box>
        
        <TokenSelector
          token={token}
          onSelect={onSelectToken}
          showBalance={false}
          showMax={false}
        />
      </Box>
      
      {/* USD价值和余额对齐 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {showUsdValue && usdValue && (
          <Typography variant="body2" color="text.secondary">
            US${usdValue}
          </Typography>
        )}
        
        {/* 余额显示 */}
        {token.balance !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              余额: {token.balance}
            </Typography>
            {showMax && (
              <Typography 
                variant="body2" 
                color="primary.main"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={onMaxClick}
              >
                最大
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SwapInput;

