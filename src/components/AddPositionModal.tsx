import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Avatar,
  FormControl,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { Close, ArrowForward, ArrowBack } from "@mui/icons-material";
import TokenSelectorModal from "./TokenSelectorModal";
import { useUser } from "../hooks/useUser";
import { Token, Pool, PositionParams } from "../interfaces";
import { message } from "antd";
import { tokensConfig } from "../libs/contracts";
import { usePoolManager } from "../hooks/usePoolManager";
import { usePositionManager } from "../hooks/usePositionManager";
import { parseEther } from "viem";

interface FeeTier {
  id: string;
  fee: string;
  value: number;
  isSelected?: boolean;
}

interface AddPositionModalProps {
  open: boolean;
  onClose: () => void;
}

const AddPositionModal = ({ open, onClose }: AddPositionModalProps) => {
  const [selectedFromToken, setSelectedFromToken] = useState<Token>(
    tokensConfig.ETH
  );
  const [selectedToToken, setSelectedToToken] = useState<Token>(
    tokensConfig.WYTokenA
  );

  const [fromAmount, setFromAmount] = useState<{
    amount: string;
    token: Token;
  }>({ amount: "0", token: selectedFromToken });

  const [toAmount, setToAmount] = useState<{
    amount: string;
    token: Token;
  }>({ amount: "0", token: selectedToToken });
  const [selectedFeeTier, setSelectedFeeTier] = useState<string>("0.05%");
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false);
  const [selectingToken, setSelectingToken] = useState<"token1" | "token2">(
    "token1"
  );
  const [currentPage, setCurrentPage] = useState<"pair" | "deposit">("pair");
  const [minPrice, setMinPrice] = useState<string>("0");
  const [maxPrice, setMaxPrice] = useState<string>("0");
  const [token1Balance, setToken1Balance] = useState<number>(0);
  const [token2Balance, setToken2Balance] = useState<number>(0);
  const [currentPool, setCurrentPool] = useState<Pool | null>();
  const { getTokenBalance, address } = useUser();
  const { createPool, getPool } = usePoolManager();
  const { addLiquidity } = usePositionManager();

  const feeTiers: FeeTier[] = [
    {
      id: "500",
      fee: "0.05%",
      value: 500,
      isSelected: true,
    },
    {
      id: "3000",
      fee: "0.3%",
      value: 3000,
    },
    {
      id: "10000",
      fee: "1%",
      value: 10000,
    },
  ];

  // 重置所有状态
  const resetModal = () => {
    setCurrentPage("pair");
    setToken1Balance(0);
    setToken2Balance(0);
    setFromAmount({ amount: "0", token: selectedFromToken });
    setToAmount({ amount: "0", token: selectedToToken });
    setSelectedFeeTier("0.05%");
    setMinPrice("0");
    setMaxPrice("0");
  };

  // 处理关闭窗口
  const handleClose = () => {
    resetModal();
    onClose();
  };

  const calculateUSDValue = (amount: string, price: number) => {
    const numAmount = parseFloat(amount) || 0;
    return (numAmount * price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleSelectToken1 = () => {
    setSelectingToken("token1");
    setTokenSelectorOpen(true);
  };

  const handleSelectToken2 = () => {
    setSelectingToken("token2");
    setTokenSelectorOpen(true);
  };

  const handleTokenSelect = (token: Token) => {
    if (selectingToken === "token1") {
      setSelectedFromToken(token);
      setFromAmount({ ...fromAmount, token });
    } else {
      setSelectedToToken(token);
      setToAmount({ ...toAmount, token });
    }
  };

  const handleNextPage = async () => {
    await userCreatePool();

    setCurrentPage("deposit");
  };

  const handleCreate = async () => {
    await userAddLiquidity();

    handleClose();
  };

  const handlePrevPage = () => {
    setCurrentPage("pair");
    // 返回第一页时重置余额
    setToken1Balance(0);
    setToken2Balance(0);
  };

  // 创建池子pool
  async function userCreatePool() {
    try {
      const fee = feeTiers.filter((item) => item.fee === selectedFeeTier)[0]
        .value;
      const res = await createPool(selectedFromToken, selectedToToken, fee);

      if (res === "success") {
        // 获取账户代币数量
        const balance1 = await getTokenBalance(selectedFromToken);
        const balance2 = await getTokenBalance(selectedToToken);

        setToken1Balance(balance1 ? Number(balance1) : 0);
        setToken2Balance(balance2 ? Number(balance2) : 0);

        // 获取当前池子
        const pool = await getPool(selectedFromToken, selectedToToken, fee);
        setCurrentPool(pool as Pool);
      }
    } catch (error) {
      message.error(error as string);
    }
  }

  // 添加流动性
  // TODO: ETH币对存在问题
  async function userAddLiquidity() {
    if (!currentPool) return;

    const params: PositionParams = {
      token0: selectedFromToken.address,
      token1: selectedToToken.address,
      index: currentPool.index,
      amount0Desired: parseEther(fromAmount.amount),
      amount1Desired: parseEther(toAmount.amount),
      recipient: address as `0x${string}`,
      deadline: BigInt(Date.now() + 3000),
    };

    const res = await addLiquidity(params);

    if (res === "success") {
      message.success("添加流动性成功");
    } else {
      message.error("添加流动性失败");
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth={false}
      PaperProps={{
        sx: {
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          maxHeight: "90vh",
          overflow: "hidden",
          width: "480px",
          maxWidth: "90vw",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          px: 2,
          pt: 2,
        }}
      >
        添加流动性池
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: 2,
          py: 1,
          overflow: "auto",
          "&.MuiDialogContent-root": {
            overflow: "auto",
          },
        }}
      >
        {currentPage === "pair" ? (
          // 第一页：选择配对
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* 选择配对部分 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                选择配对
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                选择你想要提供流动性的代币。你可以在所有支持的网络上选择代币。
              </Typography>

              {/* 代币选择 */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {/* Token 1 */}
                <Box>
                  <Box
                    onClick={handleSelectToken1}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 2,
                        backgroundColor: "#6366f1",
                      }}
                    >
                      {selectedFromToken.symbol.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedFromToken.symbol}
                      </Typography>
                    </Box>
                    <Box sx={{ color: "text.secondary" }}>▼</Box>
                  </Box>
                </Box>

                {/* Token 2 */}
                <Box>
                  <Box
                    onClick={handleSelectToken2}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 2,
                        backgroundColor: "#22c55e",
                      }}
                    >
                      {selectedToToken.symbol.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedToToken.symbol}
                      </Typography>
                    </Box>
                    <Box sx={{ color: "text.secondary" }}>▼</Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* 费用等级部分 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                费用等级
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                通过提供流动性赚取的金额。选择适合你风险承受能力和投资策略的金额。
                <span style={{ color: "red" }}>
                  初始价格比率: 1:1 (可在创建后通过添加流动性调整)
                </span>
              </Typography>

              {/* 费用等级下拉选择 */}
              <FormControl fullWidth>
                <Select
                  value={selectedFeeTier}
                  onChange={(e) => setSelectedFeeTier(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "divider",
                    },
                    "& .MuiSelect-select": {
                      py: 2,
                    },
                  }}
                >
                  {feeTiers.map((tier) => (
                    <MenuItem key={tier.id} value={tier.fee}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {tier.fee}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        ) : (
          // 第二页：存入代币
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* 设定价格区间部分 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                设定价格区间
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                设定你希望提供流动性的价格区间。
              </Typography>

              {/* 价格区间输入 */}
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* 最低价格 */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    最低价格
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      backgroundColor: "background.default",
                    }}
                  >
                    <TextField
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          fontSize: "1.2rem",
                          fontWeight: 500,
                          color: "text.primary",
                        },
                      }}
                      sx={{
                        flex: 1,
                        "& .MuiInputBase-input": {
                          padding: 0,
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {selectedFromToken.symbol} = 1 {selectedToToken.symbol}
                    </Typography>
                  </Box>
                </Box>

                {/* 最高价格 */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    最高价格
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      backgroundColor: "background.default",
                    }}
                  >
                    <TextField
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          fontSize: "1.2rem",
                          fontWeight: 500,
                          color: "text.primary",
                        },
                      }}
                      sx={{
                        flex: 1,
                        "& .MuiInputBase-input": {
                          padding: 0,
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {selectedFromToken.symbol} = 1 {selectedToToken.symbol}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* 存入代币部分 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                存入代币
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                指定你的流动性资产贡献的代币金额。
              </Typography>

              {/* Token 1 输入 */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  mb: 1.5,
                }}
              >
                <Box sx={{ flex: 1, mr: 2 }}>
                  <TextField
                    value={fromAmount.amount}
                    onChange={(e) =>
                      setFromAmount({ ...fromAmount, amount: e.target.value })
                    }
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "text.primary",
                      },
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: 0,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {calculateUSDValue(
                      fromAmount.amount,
                      fromAmount.token.price || 0
                    )}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      backgroundColor: "#6366f1",
                    }}
                  >
                    {selectedFromToken.symbol.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedFromToken.symbol}
                    </Typography>
                    <Typography variant="caption" color="error.main">
                      {token1Balance} {selectedFromToken.symbol}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Token 2 输入 */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ flex: 1, mr: 2 }}>
                  <TextField
                    value={toAmount.amount}
                    onChange={(e) =>
                      setToAmount({ ...toAmount, amount: e.target.value })
                    }
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "text.primary",
                      },
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: 0,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {calculateUSDValue(
                      toAmount.amount,
                      toAmount.token.price || 0
                    )}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      backgroundColor: "#22c55e",
                    }}
                  >
                    {selectedToToken.symbol.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedToToken.symbol}
                    </Typography>
                    <Typography variant="caption" color="error.main">
                      {token2Balance} {selectedToToken.symbol}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.5, gap: 1.5 }}>
        {currentPage === "pair" ? (
          // 第一页：显示取消和下一步按钮
          <>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                flex: 1,
                borderColor: "divider",
                color: "text.primary",
                textTransform: "none",
                py: 1.5,
              }}
            >
              取消
            </Button>
            <Button
              onClick={handleNextPage}
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                flex: 1,
                textTransform: "none",
                py: 1.5,
              }}
            >
              下一步
            </Button>
          </>
        ) : (
          // 第二页：显示上一步和创建按钮
          <>
            <Button
              onClick={handlePrevPage}
              variant="outlined"
              startIcon={<ArrowBack />}
              sx={{
                flex: 1,
                borderColor: "divider",
                color: "text.primary",
                textTransform: "none",
                py: 1.5,
              }}
            >
              上一步
            </Button>
            <Button
              onClick={handleCreate}
              variant="contained"
              sx={{
                flex: 1,
                textTransform: "none",
                py: 1.5,
              }}
            >
              创建流动性池
            </Button>
          </>
        )}
      </DialogActions>

      <TokenSelectorModal
        open={tokenSelectorOpen}
        onClose={() => setTokenSelectorOpen(false)}
        onSelectToken={handleTokenSelect}
        currentToken={
          selectingToken === "token1" ? selectedFromToken : selectedToToken
        }
        title="选择代币"
      />
    </Dialog>
  );
};

export default AddPositionModal;
