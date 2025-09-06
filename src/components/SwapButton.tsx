import React from 'react';
import { Button, Box } from '@mui/material';

interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
}

const SwapButton = ({
  onClick,
  disabled = false,
  text = '交换',
}: SwapButtonProps) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      fullWidth
      sx={{
        py: 2,
        fontSize: '1.1rem',
        fontWeight: 600,
        borderRadius: 3,
        textTransform: 'none',
        backgroundColor: disabled ? 'action.disabled' : 'primary.main',
        '&:hover': {
          backgroundColor: disabled ? 'action.disabled' : 'primary.dark',
        },
      }}
    >
      {text}
    </Button>
  );
};

export default SwapButton;

