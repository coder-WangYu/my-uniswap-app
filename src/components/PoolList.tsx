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
} from '@mui/material';
import { Add } from '@mui/icons-material';
import AddPositionModal from './AddPositionModal';

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
              onClick={() => setAddModalOpen(true)}
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
    </Box>
  );
};

export default PoolList;
