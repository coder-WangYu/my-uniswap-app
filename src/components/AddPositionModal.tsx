import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  IconButton,
  Avatar,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import SwapInput from './SwapInput';

interface Token {
  symbol: string;
  name: string;
  balance?: number;
  logo?: string;
}

interface AddPositionModalProps {
  open: boolean;
  onClose: () => void;
}

const AddPositionModal: React.FC<AddPositionModalProps> = ({ open, onClose }) => {
  const [fromValue, setFromValue] = useState<string>('0');
  const [toValue, setToValue] = useState<string>('0');
  const [feeTier, setFeeTier] = useState<string>('1.00%');
  const [lowPrice, setLowPrice] = useState<string>('');
  const [highPrice, setHighPrice] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(0);

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

  const handleMaxClick = () => {
    if (fromToken.balance) {
      setFromValue(fromToken.balance.toString());
    }
  };

  const handleCreate = () => {
    console.log('Creating position with:', {
      fromValue,
      toValue,
      feeTier,
      lowPrice,
      highPrice,
      priceRange,
    });
    onClose();
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'visible', // 确保弹窗内容不会被裁剪
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add position
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ 
        px: 3, 
        py: 2,
        overflow: 'visible', // 确保内容不会被裁剪
        '&.MuiDialogContent-root': {
          overflow: 'visible',
        },
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Deposit amounts */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Deposit amounts
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
              
              <SwapInput
                value={toValue}
                onChange={setToValue}
                token={toToken}
                onSelectToken={() => console.log('Select to token')}
              />
            </Box>
          </Box>

          {/* Fee tier */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Fee tier
            </Typography>
            <FormControl fullWidth>
              <Select
                value={feeTier}
                onChange={(e) => setFeeTier(e.target.value)}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                }}
              >
                <MenuItem value="0.05%">0.05%</MenuItem>
                <MenuItem value="0.30%">0.30%</MenuItem>
                <MenuItem value="1.00%">1.00%</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Set price range */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Set price range
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  placeholder="0.00"
                  value={lowPrice}
                  onChange={(e) => setLowPrice(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  USDC per ETH
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  placeholder="0.00"
                  value={highPrice}
                  onChange={(e) => setHighPrice(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  USDC per ETH
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Current price */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Current price
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              3,042.00
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              USDC per ETH
            </Typography>
            
            <Box sx={{ 
              px: 1, 
              pb: 2, // 添加底部padding为值标签留出空间
              overflow: 'visible', // 确保值标签可以显示
            }}>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                min={0}
                max={8000}
                step={100}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value.toFixed(2)}`}
                sx={{
                  color: 'primary.main',
                  '& .MuiSlider-thumb': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiSlider-valueLabel': {
                    // 确保值标签不会超出容器
                    '& .MuiSlider-valueLabelLabel': {
                      fontSize: '0.75rem',
                    },
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  0.00
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  8000.00
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            flex: 1,
            borderColor: 'divider',
            color: 'text.primary',
            textTransform: 'none',
            py: 1.5,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          sx={{
            flex: 1,
            textTransform: 'none',
            py: 1.5,
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPositionModal;
