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
  Avatar,
  Link,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import AddPositionModal from './AddPositionModal';

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
}

const mockPositionData: PositionData[] = [
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
  },
  {
    id: '4',
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
  },
  {
    id: '5',
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
  },
  {
    id: '6',
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
  },
  {
    id: '7',
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
  },
  {
    id: '8',
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
  },
  {
    id: '9',
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
  },
  {
    id: '10',
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
  },
];

const MyPositions = () => {
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
        Positions
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
              My Positions
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
              Add
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Token</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Fee tier</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Set price range</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Current price</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockPositionData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((position) => (
                  <TableRow
                    key={position.id}
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
                            {position.tokenPair.token1} ({position.tokenPair.amount1}) / {position.tokenPair.token2} ({position.tokenPair.amount2})
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {position.feeTier}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {position.priceRange.min} - {position.priceRange.max}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {position.currentPrice}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Link
                          component="button"
                          variant="body2"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                          onClick={() => console.log('Remove position', position.id)}
                        >
                          Remove
                        </Link>
                        <Link
                          component="button"
                          variant="body2"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                          onClick={() => console.log('Collect fees', position.id)}
                        >
                          Collect
                        </Link>
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
          count={mockPositionData.length}
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

export default MyPositions;
