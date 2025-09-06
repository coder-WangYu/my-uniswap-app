import React from 'react';
import { IconButton, Box } from '@mui/material';
import { SwapVert } from '@mui/icons-material';

interface SwapToggleProps {
  onClick: () => void;
}

const SwapToggle = ({ onClick }: SwapToggleProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        my: 1,
        position: 'relative',
      }}
    >
      <IconButton
        onClick={onClick}
        sx={{
          backgroundColor: 'background.paper',
          border: '2px solid',
          borderColor: 'divider',
          '&:hover': {
            backgroundColor: 'action.hover',
            borderColor: 'primary.main',
          },
          zIndex: 1,
        }}
      >
        <SwapVert sx={{ color: 'text.primary' }} />
      </IconButton>
    </Box>
  );
};

export default SwapToggle;

