import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface Token {
  symbol: string;
  name: string;
  balance?: number;
  logo?: string;
  price?: number;
}

interface FeeTier {
  id: string;
  fee: string;
  isSelected?: boolean;
}

interface AddPositionModalProps {
  open: boolean;
  onClose: () => void;
}

const AddPositionModal = ({ open, onClose }: AddPositionModalProps) => {
  const [selectedToken1, setSelectedToken1] = useState<Token>({
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 0,
    price: 4500.05
  });

  const [selectedToken2, setSelectedToken2] = useState<Token>({
    symbol: 'USDT',
    name: 'Tether USD',
    balance: 0,
    price: 1.00
  });

  const [token1Amount, setToken1Amount] = useState<string>('1');
  const [token2Amount, setToken2Amount] = useState<string>('4494.88095');

  const [selectedFeeTier, setSelectedFeeTier] = useState<string>('0.05%');

  const feeTiers: FeeTier[] = [
    {
      id: '0.05',
      fee: '0.05%',
      isSelected: true
    },
    {
      id: '0.01',
      fee: '0.01%'
    },
    {
      id: '0.3',
      fee: '0.3%'
    },
    {
      id: '1',
      fee: '1%'
    }
  ];

  const handleCreate = () => {
    console.log('Creating liquidity pool with:', {
      token1: selectedToken1,
      token2: selectedToken2,
      token1Amount,
      token2Amount,
      feeTier: selectedFeeTier,
    });
    onClose();
  };

  const calculateUSDValue = (amount: string, price: number) => {
    const numAmount = parseFloat(amount) || 0;
    return (numAmount * price).toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={false}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          maxHeight: '90vh',
          overflow: 'hidden',
          width: '480px',
          maxWidth: '90vw',
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
          添加流动性池
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ 
        px: 3, 
        py: 2,
        overflow: 'auto',
        '&.MuiDialogContent-root': {
          overflow: 'auto',
        },
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          {/* 选择配对部分 */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              选择配对
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              选择你想要提供流动性的代币。你可以在所有支持的网络上选择代币。
            </Typography>
            
            {/* 代币选择 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              {/* Token 1 */}
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 2, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    mr: 2,
                    backgroundColor: '#6366f1' // ETH purple color
                  }}>
                    E
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedToken1.symbol}
                    </Typography>
                  </Box>
                  <Box sx={{ color: 'text.secondary' }}>
                    ▼
                  </Box>
                </Box>
              </Box>

              {/* Token 2 */}
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 2, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    mr: 2,
                    backgroundColor: '#22c55e' // USDT green color
                  }}>
                    T
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedToken2.symbol}
                    </Typography>
                  </Box>
                  <Box sx={{ color: 'text.secondary' }}>
                    ▼
                  </Box>
                </Box>
              </Box>
            </Box>

          </Box>

          {/* 费用等级部分 */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              费用等级
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              通过提供流动性赚取的金额。选择适合你风险承受能力和投资策略的金额。
            </Typography>
            
            {/* 费用等级下拉选择 */}
            <FormControl fullWidth>
              <Select
                value={selectedFeeTier}
                onChange={(e) => setSelectedFeeTier(e.target.value)}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '& .MuiSelect-select': {
                    py: 2,
                  },
                }}
              >
                {feeTiers.map((tier) => (
                  <MenuItem key={tier.id} value={tier.fee}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {tier.fee}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          </Box>

          <Divider />

          {/* 存入代币部分 */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              存入代币
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              指定你的流动性资产贡献的代币金额。
            </Typography>
            
            {/* Token 1 输入 */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              mb: 2
            }}>
              <Box sx={{ flex: 1, mr: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main' }}>
                  {token1Amount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {calculateUSDValue(token1Amount, selectedToken1.price || 0)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1,
                  backgroundColor: '#6366f1'
                }}>
                  E
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedToken1.symbol}
                  </Typography>
                  <Typography variant="caption" color="error.main">
                    0 {selectedToken1.symbol}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Token 2 输入 */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}>
              <Box sx={{ flex: 1, mr: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main' }}>
                  {token2Amount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {calculateUSDValue(token2Amount, selectedToken2.price || 0)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1,
                  backgroundColor: '#22c55e'
                }}>
                  T
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedToken2.symbol}
                  </Typography>
                  <Typography variant="caption" color="error.main">
                    0 {selectedToken2.symbol}
                  </Typography>
                </Box>
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
          取消
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
          创建流动性池
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPositionModal;