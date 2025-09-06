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
  showMax?: boolean;
  onMaxClick?: () => void;
  placeholder?: string;
}

const SwapInput = ({
  value,
  onChange,
  token,
  onSelectToken,
  usdValue,
  showMax = false,
  onMaxClick,
  placeholder = "0.00",
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
        <TextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: '2rem',
              fontWeight: 600,
              color: 'text.primary',
            },
          }}
          sx={{
            flex: 1,
            '& .MuiInputBase-input': {
              padding: 0,
            },
          }}
        />
        
        <TokenSelector
          token={token}
          onSelect={onSelectToken}
          showBalance={true}
          showMax={showMax}
          onMaxClick={onMaxClick}
        />
      </Box>
      
      {usdValue && (
        <Typography variant="body2" color="text.secondary">
          ${usdValue}
        </Typography>
      )}
    </Box>
  );
};

export default SwapInput;

