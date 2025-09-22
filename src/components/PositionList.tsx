import React, { useEffect, useState } from 'react';
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
import { useLoading } from '../contexts/LoadingContext';
import { useQuery } from '@apollo/client/react';
import { GET_POSITIONS } from '../api';
import { formatEther } from 'viem';

interface PositionData {
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

const feeTier: Record<string, string> = {
  "500": "0.05%",
  "3000": "0.3%", 
  "10000": "1%"
}

const PoolList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [burnDialogOpen, setBurnDialogOpen] = useState(false);
  const [collectDialogOpen, setCollectDialogOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<PositionData | null>(null);
  const [burnAmount, setBurnAmount] = useState('');
  const [collectAmount, setCollectAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);
  const { isWalletConnected, address } = useUser();
  const [PositionData, setPositionData] = useState<PositionData[]>([]);
  const message = useMessage();
  const { data, loading, error } = useQuery(GET_POSITIONS);
  const { setLoading } = useLoading();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBurnClick = (pool: PositionData) => {
    setSelectedPool(pool);
    setBurnAmount(pool.liquidity);
    setBurnDialogOpen(true);
  };

  const handleCollectClick = (pool: PositionData) => {
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
    if(!isWalletConnected) {
      return message.error('请先连接钱包')
    }
    setAddModalOpen(true)
  }

  function dealPositionData(data: any) {
    // 处理数据
    const posData = data.map((pos: any) => {
      return {
        id: pos.id,
        tokenPair: {
          token1: pos.token0.symbol,
          token2: pos.token1.symbol,
          amount1: formatEther(BigInt(pos.token0.totalSupply)),
          amount2: formatEther(BigInt(pos.token1.totalSupply))
        },
        // feeTier: feeTier[pos.fee],
        feeTier: "0.05%",
        priceRange: {
          min: pos.tickLower,
          max: pos.tickUpper,
        },
        currentPrice: "3,092.77",
        liquidity: formatEther(BigInt(pos.liquidity)),
      }
    })
    setPositionData(posData)
  }

  useEffect(() => {
    setLoading(true, "正在获取代币列表...")
    if (loading) console.log(loading);
    if (error) console.log(error);
  
    if(data) {
      // @ts-ignore
      dealPositionData(data.positions_collection)
    }

    const timer = setTimeout(() => {
      setLoading(false)
    }, 200)

    return () => clearInterval(timer)
  }, [data, loading, error, isWalletConnected]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        头寸
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
              头寸列表
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
              添加头寸
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
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>头寸价值</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {PositionData.length > 0 && PositionData.map((pos) => (
                  <TableRow
                    key={pos.id}
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
                            {pos.tokenPair.token1} ({pos.tokenPair.amount1}) / {pos.tokenPair.token2} ({pos.tokenPair.amount2})
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={pos.feeTier}
                        size="small"
                        sx={{
                          backgroundColor: 'action.selected',
                          color: 'text.primary',
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {pos.priceRange.min} - {pos.priceRange.max}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {pos.currentPrice}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {pos.liquidity}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="销毁头寸">
                          <IconButton
                            size="small"
                            onClick={() => handleBurnClick(pos)}
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
                            onClick={() => handleCollectClick(pos)}
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
          count={PositionData.length}
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
        <DialogTitle>销毁头寸</DialogTitle>
        <DialogContent>
          {selectedPool && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                代币对: {selectedPool.tokenPair.token1} / {selectedPool.tokenPair.token2}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                当前头寸价值: {selectedPool.liquidity}
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
            警告：销毁头寸将永久移除您的头寸，您将收到相应的代币。
          </Alert>
          {actionSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              头寸销毁成功！
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
