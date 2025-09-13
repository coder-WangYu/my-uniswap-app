import React from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

interface Token {
  symbol: string;
  name: string;
  balance?: number;
  logo?: string;
}

interface TokenSelectorProps {
  token: Token;
  onSelect: () => void;
  showBalance?: boolean;
  showMax?: boolean;
  onMaxClick?: () => void;
}

const TokenSelector = ({
  token,
  onSelect,
  showBalance = false,
  showMax = false,
  onMaxClick,
}: TokenSelectorProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {showBalance && token.balance !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            余额: {token.balance}
          </Typography>
          {showMax && (
            <Button
              size="small"
              variant="text"
              onClick={onMaxClick}
              sx={{
                minWidth: 'auto',
                px: 1,
                py: 0.5,
                fontSize: '0.75rem',
                color: 'primary.main',
                textTransform: 'none',
              }}
            >
              最大
            </Button>
          )}
        </Box>
      )}
      
      <Button
        variant="outlined"
        onClick={onSelect}
        endIcon={<KeyboardArrowDown />}
        sx={{
          borderColor: 'divider',
          color: 'text.primary',
          textTransform: 'none',
          px: 2,
          py: 1,
          borderRadius: 2,
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {token.symbol ? (
            <>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: 'primary.main',
                  fontSize: '0.75rem',
                }}
              >
                {token.symbol.charAt(0)}
              </Avatar>
              <Typography variant="body1" fontWeight={600}>
                {token.symbol}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" fontWeight={600} color="primary.main">
              {token.name}
            </Typography>
          )}
        </Box>
      </Button>
    </Box>
  );
};

export default TokenSelector;

