import React, { useEffect, useState } from 'react';
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
import { GET_POOLS } from '../api';
import { useQuery } from '@apollo/client/react';
import { useLoading } from '../contexts/LoadingContext';

interface PoolData {
  id: string;
  token0: {
    id: string;
    symbol: string;
  };
  token1: {
    id: string;
    symbol: string;
  };
  fee: string;
  tvl?: number;
  volume24h?: number;
  volume7d?: number;
  apr?: number;
}

const feeTier: Record<string, string> = {
  "500": "0.05%",
  "3000": "0.3%", 
  "10000": "1%"
}

const PoolsList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [poolData, setPoolData] = useState<PoolData[]>([]);
  const { data, loading, error } = useQuery(GET_POOLS);
  const { setLoading } = useLoading()

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

  useEffect(() => {
    setLoading(true, "正在获取流动性池列表...")
    if(loading) console.log(loading)
    if(error) console.log(error)
    
    if(data) {
      // @ts-ignore
      setPoolData(data.pools_collection)
    }

    const timer = setTimeout(() => {
      setLoading(false)
    }, 200)

    return () => clearInterval(timer)
  }, [data, loading, error])

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
            {poolData.length && poolData.map((pool) => (
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
                            backgroundColor: getTokenLogo(pool.token0.symbol),
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          {pool.token0.symbol.charAt(0)}
                        </Avatar>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: getTokenLogo(pool.token1.symbol),
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            ml: -1,
                          }}
                        >
                          {pool.token1.symbol.charAt(0)}
                        </Avatar>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {pool.token0.symbol} / {pool.token1.symbol}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {`${pool.token0.id.slice(0, 5)}...${pool.token0.id.slice(27, 32)}`} 
                          <span style={{padding: "0 5px" }}>/</span>
                          {`${pool.token1.id.slice(0, 5)}...${pool.token1.id.slice(27, 32)}`}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={feeTier[pool.fee] || `${pool.fee}%`}
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
                      {/* ${formatNumber(pool.tvl)} */}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {/* ${formatNumber(pool.volume24h)} */}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {/* ${formatNumber(pool.volume7d)} */}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {/* <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        color: pool.apr > 10 ? 'success.main' : pool.apr > 5 ? 'warning.main' : 'text.primary'
                      }}
                    >
                      {pool.apr.toFixed(2)}%
                    </Typography> */}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={poolData.length}
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
