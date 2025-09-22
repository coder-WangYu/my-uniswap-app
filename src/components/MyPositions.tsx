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
  Avatar,
  Link,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import AddPositionModal from "./AddPositionModal";
import { useUser } from "../hooks/useUser";
import { useLoading } from "../contexts/LoadingContext";
import { usePositionManager } from "../hooks/usePositionManager";
import { useMessage } from "../contexts/MessageContext";
import { GET_POSITIONS } from "../api";
import { useQuery } from "@apollo/client/react";

interface MyPositionsProps {
  positionData?: PositionData[];
}

interface PositionData {
  id: string;
  owner: string;
  tokenId: string;
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

const MyPositions = (props: MyPositionsProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [myPositions, setMyPositions] = useState<PositionData[]>([]);
  const { positionData } = props;
  const { address } = useUser();
  const { setLoading } = useLoading();
  const { burnToken, collectToken } = usePositionManager();
  const message = useMessage();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 收取奖励
  async function handleBurn(id: string) {
    setLoading(true, "正在收取奖励...");

    const result = await burnToken(id);
    setLoading(false);

    if (result === "success") {
      return message.success("收取奖励成功");
    } else {
      return message.error("收取奖励成功");
    }
  }

  // 销毁头寸
  async function handleCollect(id: string) {
    setLoading(true, "正在销毁头寸...");

    const result = await collectToken(id);
    setLoading(false);

    if (result === "success") {
      // TODO: 重新获取数据
      return message.success("销毁头寸成功");
    } else {
      return message.error("销毁头寸失败");
    }
  }

  useEffect(() => {
    setLoading(true, "正在获取头寸列表...");

    if (positionData && address) {
      setMyPositions(
        positionData.filter(
          (item) => item.owner.toLowerCase() === address.toLowerCase()
        )
      );
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearInterval(timer);
  }, [positionData, address]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        我的头寸
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
              我的头寸列表
            </Typography>
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
                  操作
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myPositions &&
                myPositions.map((position) => (
                  <TableRow
                    key={position.id}
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
                            {position.tokenPair.token1} (
                            {position.tokenPair.amount1}) /{" "}
                            {position.tokenPair.token2} (
                            {position.tokenPair.amount2})
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
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Link
                          component="button"
                          variant="body2"
                          sx={{
                            color: "primary.main",
                            textDecoration: "none",
                            cursor: "pointer",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                          onClick={() => handleBurn(position.tokenId)}
                        >
                          收回
                        </Link>
                        <Link
                          component="button"
                          variant="body2"
                          sx={{
                            color: "primary.main",
                            textDecoration: "none",
                            cursor: "pointer",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                          onClick={() => handleCollect(position.tokenId)}
                        >
                          销毁
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
          count={myPositions?.length ?? 0}
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
    </Box>
  );
};

export default MyPositions;
