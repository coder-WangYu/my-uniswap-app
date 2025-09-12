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
} from '@mui/material';
import { Search, ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface TokenData {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  change1h: number;
  change1d: number;
  fdv: number;
  volume24h: number;
  logo?: string;
}

const mockTokenData: TokenData[] = [
  {
    id: '1',
    rank: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    price: 4511.68,
    change1h: -0.15,
    change1d: 3.21,
    fdv: 10800000000,
    volume24h: 990900000,
  },
  {
    id: '2',
    rank: 2,
    name: 'Tether USD',
    symbol: 'USDT',
    price: 1.00,
    change1h: 0.00,
    change1d: 0.00,
    fdv: 169600000000,
    volume24h: 773400000,
  },
  {
    id: '3',
    rank: 3,
    name: 'USD Coin',
    symbol: 'USDC',
    price: 1.00,
    change1h: 0.00,
    change1d: 0.00,
    fdv: 72400000000,
    volume24h: 606400000,
  },
  {
    id: '4',
    rank: 4,
    name: 'Base ETH',
    symbol: 'ETH',
    price: 4511.58,
    change1h: 0.05,
    change1d: 2.91,
    fdv: 10800000000,
    volume24h: 441700000,
  },
  {
    id: '5',
    rank: 5,
    name: 'AICell',
    symbol: 'AICell',
    price: 0.00254,
    change1h: -0.01,
    change1d: -0.01,
    fdv: 2500000,
    volume24h: 304600000,
  },
  {
    id: '6',
    rank: 6,
    name: 'Binance Coin',
    symbol: 'BNB',
    price: 904.56,
    change1h: -0.08,
    change1d: 1.49,
    fdv: 1200000000,
    volume24h: 138300000,
  },
];

const TokensList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('volume');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(decimals)}B`;
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(decimals)}M`;
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(decimals)}K`;
    }
    return num.toFixed(decimals);
  };

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return price.toFixed(8);
    }
  };

  const getTokenLogo = (symbol: string) => {
    // 简单的token logo生成逻辑
    const colors = ['#1976d2', '#dc004e', '#2e7d32', '#f57c00', '#7b1fa2', '#d32f2f'];
    const colorIndex = symbol.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const filteredData = mockTokenData.filter(token =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'volume':
        return b.volume24h - a.volume24h;
      case 'price':
        return b.price - a.price;
      case 'change1d':
        return b.change1d - a.change1d;
      default:
        return a.rank - b.rank;
    }
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
                placeholder="搜索代币..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ 
                backgroundColor: 'background.paper',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
              }}
            >
              <MenuItem value="rank">排名</MenuItem>
              <MenuItem value="volume">24h 交易量</MenuItem>
              <MenuItem value="price">价格</MenuItem>
              <MenuItem value="change1d">24h 涨跌</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>代币名称</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>价格</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>1H</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>1D</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>FDV</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                24H 交易量
                <ArrowDownward sx={{ ml: 0.5, fontSize: 16 }} />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>1D 图表</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((token) => (
                <TableRow
                  key={token.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    cursor: 'pointer',
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {token.rank}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: getTokenLogo(token.symbol),
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {token.symbol.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {token.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {token.symbol}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ${formatPrice(token.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {token.change1h >= 0 ? (
                        <ArrowUpward sx={{ fontSize: 16, color: 'success.main' }} />
                      ) : (
                        <ArrowDownward sx={{ fontSize: 16, color: 'error.main' }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: token.change1h >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 500,
                        }}
                      >
                        {Math.abs(token.change1h).toFixed(2)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {token.change1d >= 0 ? (
                        <ArrowUpward sx={{ fontSize: 16, color: 'success.main' }} />
                      ) : (
                        <ArrowDownward sx={{ fontSize: 16, color: 'error.main' }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: token.change1d >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 500,
                        }}
                      >
                        {Math.abs(token.change1d).toFixed(2)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ${formatNumber(token.fdv)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ${formatNumber(token.volume24h)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: 80, height: 32 }}>
                      {/* 简单的价格图表模拟 */}
                      <svg width="80" height="32" viewBox="0 0 80 32">
                        <polyline
                          fill="none"
                          stroke={token.change1d >= 0 ? '#4caf50' : '#f44336'}
                          strokeWidth="2"
                          points="0,24 20,20 40,16 60,12 80,8"
                        />
                      </svg>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={sortedData.length}
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

export default TokensList;
