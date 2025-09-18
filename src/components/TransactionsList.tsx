import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Box,
  Typography,
  IconButton,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Link,
} from '@mui/material';
import { Search, ArrowUpward, ArrowDownward, SwapHoriz, Add, Remove } from '@mui/icons-material';

interface TransactionData {
  id: string;
  type: 'swap' | 'add' | 'remove';
  token1: {
    name: string;
    symbol: string;
    amount: number;
  };
  token2: {
    name: string;
    symbol: string;
    amount: number;
  };
  txHash: string;
  timestamp: number;
  gasUsed: number;
  gasPrice: number;
}

const mockTransactionData: TransactionData[] = [
  {
    id: '1',
    type: 'swap',
    token1: { name: 'Ethereum', symbol: 'ETH', amount: 1.5 },
    token2: { name: 'USD Coin', symbol: 'USDC', amount: 4500 },
    txHash: '0x1234...5678',
    timestamp: Date.now() - 300000, // 5分钟前
    gasUsed: 180000,
    gasPrice: 20,
  },
];

const TransactionsList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatNumber = (num: number, decimals: number = 4) => {
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(decimals)}B`;
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(decimals)}M`;
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(decimals)}K`;
    }
    return num.toFixed(decimals);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) {
      return `${days}天前`;
    } else if (hours > 0) {
      return `${hours}小时前`;
    } else if (minutes > 0) {
      return `${minutes}分钟前`;
    } else {
      return '刚刚';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return <SwapHoriz sx={{ color: 'primary.main' }} />;
      case 'add':
        return <Add sx={{ color: 'success.main' }} />;
      case 'remove':
        return <Remove sx={{ color: 'error.main' }} />;
      default:
        return <SwapHoriz sx={{ color: 'text.secondary' }} />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'swap':
        return '交换';
      case 'add':
        return '添加流动性';
      case 'remove':
        return '移除流动性';
      default:
        return '未知';
    }
  };

  const getTokenLogo = (symbol: string) => {
    const colors = ['#1976d2', '#dc004e', '#2e7d32', '#f57c00', '#7b1fa2', '#d32f2f'];
    const colorIndex = symbol.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const filteredData = mockTransactionData.filter(tx => {
    const matchesSearch = 
      tx.token1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.token1.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.token2.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.token2.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      {/* 搜索和筛选栏 */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box
            sx={{
              position: 'relative',
              backgroundColor: 'action.hover',
              borderRadius: 2,
              flex: 1,
              maxWidth: 300,
            }}
          >
            <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
              <Search sx={{ mr: 1, color: 'text.secondary' }} />
              <InputBase
                placeholder="搜索交易..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              sx={{ 
                backgroundColor: 'background.paper',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
              }}
            >
              <MenuItem value="all">所有类型</MenuItem>
              <MenuItem value="swap">交换</MenuItem>
              <MenuItem value="add">添加流动性</MenuItem>
              <MenuItem value="remove">移除流动性</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>类型</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>代币对</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>数量</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>交易哈希</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>时间</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Gas费用</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((tx) => (
                <TableRow
                  key={tx.id}
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
                      {getTransactionIcon(tx.type)}
                      <Chip
                        label={getTransactionTypeLabel(tx.type)}
                        size="small"
                        sx={{
                          backgroundColor: tx.type === 'swap' ? 'primary.main' : 
                                          tx.type === 'add' ? 'success.main' : 'error.main',
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: getTokenLogo(tx.token1.symbol),
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {tx.token1.symbol.charAt(0)}
                        </Avatar>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: getTokenLogo(tx.token2.symbol),
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            ml: -1,
                          }}
                        >
                          {tx.token2.symbol.charAt(0)}
                        </Avatar>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {tx.token1.symbol} / {tx.token2.symbol}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {tx.token1.amount} {tx.token1.symbol}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tx.token2.amount} {tx.token2.symbol}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`https://etherscan.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontFamily: 'monospace',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {tx.txHash}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatTime(tx.timestamp)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatNumber((tx.gasUsed * tx.gasPrice) / 1e18, 6)} ETH
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredData.length}
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
  );
};

export default TransactionsList;
