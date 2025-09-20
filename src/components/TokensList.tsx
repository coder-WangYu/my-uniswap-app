import React, { useEffect, useState } from "react";
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
  InputBase,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { Search, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { GET_TOKENS } from "../api";
import { useQuery } from "@apollo/client/react";
import { ignore } from "antd/es/theme/useToken";
import { useLoading } from "../contexts/LoadingContext";

interface TokenData {
  id: string;
  rank?: number;
  name: string;
  symbol: string;
  price?: number;
  change1h?: number;
  change1d?: number;
  fdv?: number;
  volume24h?: number;
}

const TokensList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  const { data, loading, error } = useQuery(GET_TOKENS);
  const { setLoading } = useLoading()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      return price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return price.toFixed(8);
    }
  };

  const getTokenLogo = (symbol: string) => {
    // 简单的token logo生成逻辑
    const colors = [
      "#1976d2",
      "#dc004e",
      "#2e7d32",
      "#f57c00",
      "#7b1fa2",
      "#d32f2f",
    ];
    const colorIndex = symbol.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  useEffect(() => {
    setLoading(true, "正在获取代币列表...")
    if (loading) console.log(loading);
    if (error) console.log(error);
  
    if(data) {
      // @ts-ignore
      setTokenData(data.tokens_collection)
    }

    const timer = setTimeout(() => {
      setLoading(false)
    }, 200)

    return () => clearInterval(timer)
  }, [data, loading, error]);

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      {/* 搜索和筛选栏 */}
      <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box
            sx={{
              position: "relative",
              backgroundColor: "action.hover",
              borderRadius: 2,
              flex: 1,
              maxWidth: 300,
            }}
          >
            <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
              <Search sx={{ mr: 1, color: "text.secondary" }} />
              <InputBase
                placeholder="搜索代币..."
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
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                代币名称
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                代币地址
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                价格
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                1H
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                1D
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                FDV
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                24H 交易量
                <ArrowDownward sx={{ ml: 0.5, fontSize: 16 }} />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                1D 图表
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tokenData.length > 0 &&
              tokenData.map((token) => (
                <TableRow
                  key={token.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                    cursor: "pointer",
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: getTokenLogo(token.symbol),
                          fontSize: "0.875rem",
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
                    <Typography variant="body2" color="text.secondary">
                      {`${token.id.slice(0, 5)}...${token.id.slice(27, 32)}`}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {/* ${formatPrice(token.price)} */}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {/* <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {token.change1h >= 0 ? (
                        <ArrowUpward
                          sx={{ fontSize: 16, color: "success.main" }}
                        />
                      ) : (
                        <ArrowDownward
                          sx={{ fontSize: 16, color: "error.main" }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            token.change1h >= 0 ? "success.main" : "error.main",
                          fontWeight: 500,
                        }}
                      >
                        {Math.abs(token.change1h)}%
                      </Typography>
                    </Box> */}
                  </TableCell>

                  <TableCell>
                    {/* <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {token.change1d >= 0 ? (
                        <ArrowUpward
                          sx={{ fontSize: 16, color: "success.main" }}
                        />
                      ) : (
                        <ArrowDownward
                          sx={{ fontSize: 16, color: "error.main" }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            token.change1d >= 0 ? "success.main" : "error.main",
                          fontWeight: 500,
                        }}
                      >
                        {Math.abs(token.change1d).toFixed(2)}%
                      </Typography>
                    </Box> */}
                  </TableCell>

                  <TableCell>
                    {/* <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ${formatNumber(token.fdv)}
                    </Typography> */}
                  </TableCell>

                  <TableCell>
                    {/* <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ${formatNumber(token.volume24h)}
                    </Typography> */}
                  </TableCell>
                  
                  <TableCell>
                    {/* <Box sx={{ width: 80, height: 32 }}>
                      <svg width="80" height="32" viewBox="0 0 80 32">
                        <polyline
                          fill="none"
                          stroke={token.change1d >= 0 ? "#4caf50" : "#f44336"}
                          strokeWidth="2"
                          points="0,24 20,20 40,16 60,12 80,8"
                        />
                      </svg>
                    </Box> */}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={tokenData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          "& .MuiTablePagination-toolbar": {
            color: "text.secondary",
          },
        }}
      />
    </Paper>
  );
};

export default TokensList;
