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
} from '@mui/material';
import { Search, ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface PoolData {
  id: string;
  token1: {
    name: string;
    symbol: string;
    address: string;
  };
  token2: {
    name: string;
    symbol: string;
    address: string;
  };
  fee: string;
  tvl: number;
  volume24h: number;
  volume7d: number;
  apr: number;
}

const mockPoolData: PoolData[] = [
  {
    id: '1',
    token1: { name: 'Ethereum', symbol: 'ETH', address: '0x...' },
    token2: { name: 'USD Coin', symbol: 'USDC', address: '0x...' },
    fee: '0.05%',
    tvl: 12500000,
    volume24h: 2500000,
    volume7d: 18000000,
    apr: 12.5,
  },
  {
    id: '2',
    token1: { name: 'Ethereum', symbol: 'ETH', address: '0x...' },
    token2: { name: 'Tether USD', symbol: 'USDT', address: '0x...' },
    fee: '0.3%',
    tvl: 8900000,
    volume24h: 1800000,
    volume7d: 12500000,
    apr: 8.7,
  },
  {
    id: '3',
    token1: { name: 'USD Coin', symbol: 'USDC', address: '0x...' },
    token2: { name: 'Tether USD', symbol: 'USDT', address: '0x...' },
    fee: '0.01%',
    tvl: 15600000,
    volume24h: 3200000,
    volume7d: 22000000,
    apr: 3.2,
  },
  {
    id: '4',
    token1: { name: 'Ethereum', symbol: 'ETH', address: '0x...' },
    token2: { name: 'Wrapped Bitcoin', symbol: 'WBTC', address: '0x...' },
    fee: '0.3%',
    tvl: 4200000,
    volume24h: 850000,
    volume7d: 6200000,
    apr: 15.8,
  },
  {
    id: '5',
    token1: { name: 'Base ETH', symbol: 'ETH', address: '0x...' },
    token2: { name: 'USD Coin', symbol: 'USDC', address: '0x...' },
    fee: '0.05%',
    tvl: 6800000,
    volume24h: 1400000,
    volume7d: 9800000,
    apr: 9.3,
  },
  {
    id: '6',
    token1: { name: 'Binance Coin', symbol: 'BNB', address: '0x...' },
    token2: { name: 'USD Coin', symbol: 'USDC', address: '0x...' },
    fee: '0.3%',
    tvl: 2100000,
    volume24h: 420000,
    volume7d: 2900000,
    apr: 11.2,
  },
];

const PoolsList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('tvl');

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

  const getTokenLogo = (symbol: string) => {
    const colors = ['#1976d2', '#dc004e', '#2e7d32', '#f57c00', '#7b1fa2', '#d32f2f'];
    const colorIndex = symbol.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const filteredData = mockPoolData.filter(pool =>
    pool.token1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.token1.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.token2.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.token2.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'tvl':
        return b.tvl - a.tvl;
      case 'volume24h':
        return b.volume24h - a.volume24h;
      case 'volume7d':
        return b.volume7d - a.volume7d;
      case 'apr':
        return b.apr - a.apr;
      default:
        return a.id.localeCompare(b.id);
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
                placeholder="搜索流动性池..."
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
              <MenuItem value="tvl">总锁定价值</MenuItem>
              <MenuItem value="volume24h">24h 交易量</MenuItem>
              <MenuItem value="volume7d">7d 交易量</MenuItem>
              <MenuItem value="apr">APR</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>池</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>费用</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>TVL</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>24h 交易量</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>7d 交易量</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>APR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: getTokenLogo(pool.token1.symbol),
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          {pool.token1.symbol.charAt(0)}
                        </Avatar>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: getTokenLogo(pool.token2.symbol),
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            ml: -1,
                          }}
                        >
                          {pool.token2.symbol.charAt(0)}
                        </Avatar>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {pool.token1.symbol} / {pool.token2.symbol}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pool.token1.name} / {pool.token2.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pool.fee}
                      size="small"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ${formatNumber(pool.tvl)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ${formatNumber(pool.volume24h)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ${formatNumber(pool.volume7d)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        color: pool.apr > 10 ? 'success.main' : pool.apr > 5 ? 'warning.main' : 'text.primary'
                      }}
                    >
                      {pool.apr.toFixed(2)}%
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

export default PoolsList;
