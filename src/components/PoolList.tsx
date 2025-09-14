import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { Add, LocalFireDepartment, AttachMoney } from '@mui/icons-material';
import AddPositionModal from './AddPositionModal';
import { useUser } from '../hooks/useUser';
import { useMessage } from '../contexts/MessageContext';

interface PoolData {
  id: string;
  tokenPair: {
    token1: string;
    token2: string;
    amount1: string;
    amount2: string;
  };
  feeTier: string;
  priceRange: {
    min: string;
    max: string;
  };
  currentPrice: string;
  liquidity: string;
}

const mockPoolData: PoolData[] = [
  {
    id: '1',
    tokenPair: {
      token1: 'ETH',
      token2: 'USDC',
      amount1: '2395.123',
      amount2: '23958.97',
    },
    feeTier: '1.00%',
    priceRange: {
      min: '2421.1866',
      max: '6197.9015',
    },
    currentPrice: '3,092.77',
    liquidity: '2024',
  },
  {
    id: '2',
    tokenPair: {
      token1: 'ETH',
      token2: 'USDC',
      amount1: '2395.123',
      amount2: '23958.97',
    },
    feeTier: '1.00%',
    priceRange: {
      min: '2421.1866',
      max: '6197.9015',
    },
    currentPrice: '3,092.77',
    liquidity: '2024',
  },
  {
    id: '3',
    tokenPair: {
      token1: 'ETH',
      token2: 'USDC',
      amount1: '2395.123',
      amount2: '23958.97',
    },
    feeTier: '1.00%',
    priceRange: {
      min: '2421.1866',
      max: '6197.9015',
    },
    currentPrice: '3,092.77',
    liquidity: '2024',
  },
];

const PoolList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [burnDialogOpen, setBurnDialogOpen] = useState(false);
  const [collectDialogOpen, setCollectDialogOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<PoolData | null>(null);
  const [burnAmount, setBurnAmount] = useState('');
  const [collectAmount, setCollectAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);
  const { isConnected, address } = useUser();
  const message = useMessage();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBurnClick = (pool: PoolData) => {
    setSelectedPool(pool);
    setBurnAmount(pool.liquidity);
    setBurnDialogOpen(true);
  };

  const handleCollectClick = (pool: PoolData) => {
    setSelectedPool(pool);
    setCollectAmount('0.5'); // 模拟可收集的费用
    setCollectDialogOpen(true);
  };

  const handleBurnConfirm = async () => {
    if (!selectedPool || !burnAmount) return;
    
    setActionLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      setActionSuccess(true);
      setTimeout(() => {
        setBurnDialogOpen(false);
        setActionSuccess(false);
        setActionLoading(false);
        setBurnAmount('');
        setSelectedPool(null);
      }, 1500);
    } catch (error) {
      setActionLoading(false);
    }
  };

  const handleCollectConfirm = async () => {
    if (!selectedPool || !collectAmount) return;
    
    setActionLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      setActionSuccess(true);
      setTimeout(() => {
        setCollectDialogOpen(false);
        setActionSuccess(false);
        setActionLoading(false);
        setCollectAmount('');
        setSelectedPool(null);
      }, 1500);
    } catch (error) {
      setActionLoading(false);
    }
  };

  function openAddModal() {
    if(!isConnected) {
      return message.error('请先连接钱包')
    }
    setAddModalOpen(true)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        流动性池
      </Typography>

      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              流动性池列表
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openAddModal()}
              sx={{
                textTransform: 'none',
                px: 3,
              }}
            >
              添加流动性池
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>代币</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>费用等级</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>设置价格范围</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>当前价格</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>流动性</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockPoolData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pool) => (
                  <TableRow
                    key={pool.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      cursor: 'pointer',
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: 'primary.main',
                              fontSize: '0.75rem',
                            }}
                          >
                            E
                          </Avatar>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: 'secondary.main',
                              fontSize: '0.75rem',
                              ml: -1,
                            }}
                          >
                            U
                          </Avatar>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {pool.tokenPair.token1} ({pool.tokenPair.amount1}) / {pool.tokenPair.token2} ({pool.tokenPair.amount2})
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pool.feeTier}
                        size="small"
                        sx={{
                          backgroundColor: 'action.selected',
                          color: 'text.primary',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {pool.priceRange.min} - {pool.priceRange.max}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {pool.currentPrice}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {pool.liquidity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="销毁流动性">
                          <IconButton
                            size="small"
                            onClick={() => handleBurnClick(pool)}
                            sx={{
                              color: 'error.main',
                              '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'white',
                              },
                            }}
                          >
                            <LocalFireDepartment fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="收集费用">
                          <IconButton
                            size="small"
                            onClick={() => handleCollectClick(pool)}
                            sx={{
                              color: 'success.main',
                              '&:hover': {
                                backgroundColor: 'success.light',
                                color: 'white',
                              },
                            }}
                          >
                            <AttachMoney fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockPoolData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            '& .MuiTablePagination-toolbar': {
              color: 'text.secondary',
            },
          }}
        />
      </Paper>

      <AddPositionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* Burn Dialog */}
      <Dialog open={burnDialogOpen} onClose={() => setBurnDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>销毁流动性</DialogTitle>
        <DialogContent>
          {selectedPool && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                代币对: {selectedPool.tokenPair.token1} / {selectedPool.tokenPair.token2}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                当前流动性: {selectedPool.liquidity}
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="销毁数量"
            value={burnAmount}
            onChange={(e) => setBurnAmount(e.target.value)}
            type="number"
            sx={{ mb: 2 }}
          />
          <Alert severity="warning" sx={{ mb: 2 }}>
            警告：销毁流动性将永久移除您的流动性头寸，您将收到相应的代币。
          </Alert>
          {actionSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              流动性销毁成功！
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBurnDialogOpen(false)} disabled={actionLoading}>
            取消
          </Button>
          <Button
            onClick={handleBurnConfirm}
            variant="contained"
            color="error"
            disabled={actionLoading || !burnAmount}
          >
            {actionLoading ? '处理中...' : '确认销毁'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Collect Dialog */}
      <Dialog open={collectDialogOpen} onClose={() => setCollectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>收集费用</DialogTitle>
        <DialogContent>
          {selectedPool && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                代币对: {selectedPool.tokenPair.token1} / {selectedPool.tokenPair.token2}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                可收集费用: {collectAmount} ETH
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="收集数量"
            value={collectAmount}
            onChange={(e) => setCollectAmount(e.target.value)}
            type="number"
            sx={{ mb: 2 }}
          />
          <Alert severity="info" sx={{ mb: 2 }}>
            收集费用将把您赚取的手续费转移到您的钱包中。
          </Alert>
          {actionSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              费用收集成功！
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCollectDialogOpen(false)} disabled={actionLoading}>
            取消
          </Button>
          <Button
            onClick={handleCollectConfirm}
            variant="contained"
            color="success"
            disabled={actionLoading || !collectAmount}
          >
            {actionLoading ? '处理中...' : '确认收集'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PoolList;
