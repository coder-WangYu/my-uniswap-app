import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import {
  Add,
  LocalFireDepartment,
  AttachMoney,
  Person,
} from "@mui/icons-material";
import AddPositionModal from "./AddPositionModal";
import MyPositions from "./MyPositions";
import { useUser } from "../hooks/useUser";
import { useMessage } from "../contexts/MessageContext";
import { useLoading } from "../contexts/LoadingContext";
import { useQuery } from "@apollo/client/react";
import { GET_POSITIONS } from "../api";
import { formatEther } from "viem";

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
  "10000": "1%",
};

const PoolList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showMyPositions, setShowMyPositions] = useState(false);
  const { isWalletConnected } = useUser();
  const [PositionData, setPositionData] = useState<PositionData[]>([]);
  const message = useMessage();
  const { data, loading, error } = useQuery(GET_POSITIONS);
  const { setLoading } = useLoading();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function openAddModal() {
    if (!isWalletConnected) {
      return message.error("请先连接钱包");
    }
    setAddModalOpen(true);
  }

  function handleMyPositionsClick() {
    if (!isWalletConnected) {
      return message.error("请先连接钱包");
    }
    setShowMyPositions(true);
  }

  function dealPositionData(data: any) {
    // 处理数据
    const posData = data.map((pos: any) => {
      return {
        id: pos.id,
        tokenPair: {
          token1: pos.token0.symbol,
          token2: pos.token1.symbol,
          amount1: Number(formatEther(BigInt(pos.token0.totalSupply))).toFixed(
            4
          ),
          amount2: Number(formatEther(BigInt(pos.token1.totalSupply))).toFixed(
            4
          ),
        },
        // feeTier: feeTier[pos.fee],
        feeTier: "0.05%",
        priceRange: {
          min: pos.tickLower,
          max: pos.tickUpper,
        },
        currentPrice: "3,092.77",
        liquidity: Number(formatEther(BigInt(pos.liquidity))).toFixed(4),
      };
    });
    setPositionData(posData);
  }

  useEffect(() => {
    setLoading(true, "正在获取代币列表...");
    if (loading) console.log(loading);
    if (error) console.log(error);

    if (data) {
      // @ts-ignore
      dealPositionData(data.positions_collection);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearInterval(timer);
  }, [data, loading, error]);

  // 如果显示我的头寸，则渲染 MyPositions 组件
  if (showMyPositions) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="text"
            onClick={() => setShowMyPositions(false)}
            sx={{
              textTransform: "none",
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            ← 返回头寸列表
          </Button>
        </Box>
        <MyPositions />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        头寸
      </Typography>

      <Paper
        elevation={0}
        sx={{
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              头寸列表
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Person />}
                onClick={() => handleMyPositionsClick()}
                sx={{
                  textTransform: "none",
                  px: 3,
                }}
              >
                我的头寸
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => openAddModal()}
                sx={{
                  textTransform: "none",
                  px: 3,
                }}
              >
                添加头寸
              </Button>
            </Box>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                  代币
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                  费用等级
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                  设置价格范围
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                  当前价格
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                  头寸价值
                </TableCell>
                {/* <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>操作</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {PositionData.length > 0 &&
                PositionData.map((pos) => (
                  <TableRow
                    key={pos.id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: "primary.main",
                              fontSize: "0.75rem",
                            }}
                          >
                            E
                          </Avatar>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: "secondary.main",
                              fontSize: "0.75rem",
                              ml: -1,
                            }}
                          >
                            U
                          </Avatar>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {pos.tokenPair.token1} ({pos.tokenPair.amount1}) /{" "}
                            {pos.tokenPair.token2} ({pos.tokenPair.amount2})
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={pos.feeTier}
                        size="small"
                        sx={{
                          backgroundColor: "action.selected",
                          color: "text.primary",
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
                      <Typography variant="body2">{pos.liquidity}</Typography>
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
            borderTop: "1px solid",
            borderColor: "divider",
            "& .MuiTablePagination-toolbar": {
              color: "text.secondary",
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
