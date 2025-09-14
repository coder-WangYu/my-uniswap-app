import React, { useEffect, useState } from "react";
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
  Divider,
  FormControl,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { Close, ArrowForward, ArrowBack } from "@mui/icons-material";
import TokenSelectorModal from "./TokenSelectorModal";
import { useUser } from "../hooks/useUser";
import { Token } from "../interfaces";
import { message } from "antd";
import { useCreatePool } from "../hooks/useCreatePool";
import { tokensConfig } from "../libs/contracts";

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
  const [selectedToken1, setSelectedToken1] = useState<Token>(tokensConfig.ETH);
  const [selectedToken2, setSelectedToken2] = useState<Token>(
    tokensConfig.WYTokenA
  );

  const [token1Amount, setToken1Amount] = useState<string>("0");
  const [token2Amount, setToken2Amount] = useState<string>("0");
  const [selectedFeeTier, setSelectedFeeTier] = useState<string>("0.05%");
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false);
  const [selectingToken, setSelectingToken] = useState<"token1" | "token2">(
    "token1"
  );
  const [currentPage, setCurrentPage] = useState<"pair" | "deposit">("pair");
  const [tickLower, setTickLower] = useState<string>("0");
  const [tickUpper, setTickUpper] = useState<string>("0");
  const [token1Balance, setToken1Balance] = useState<number>(0);
  const [token2Balance, setToken2Balance] = useState<number>(0);
  const { getTokenBalance } = useUser();
  const { createPool } = useCreatePool();

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
    setToken1Amount("0");
    setToken2Amount("0");
    setSelectedFeeTier("0.05%");
    setTickLower("0");
    setTickUpper("0");
  };

  // 处理关闭窗口
  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleCreate = async () => {
    console.log("Creating liquidity pool with:", {
      token1: selectedToken1,
      token2: selectedToken2,
      token1Amount,
      token2Amount,
      tickLower,
      tickUpper,
      fee: selectedFeeTier,
    });

    handleClose();
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
      setSelectedToken1(token);
    } else {
      setSelectedToken2(token);
    }
  };

  const handleNextPage = async () => {
    try {
      // 创建池子pool
      const fee = feeTiers.filter((item) => item.fee === selectedFeeTier)[0].value;
      const res = await createPool(selectedToken1, selectedToken2, fee);

      if (res === "success") {
        // 获取账户代币数量
        const balance1 = await getTokenBalance(selectedToken1);
        const balance2 = await getTokenBalance(selectedToken2);

        setToken1Balance(balance1 ? Number(balance1) : 0);
        setToken2Balance(balance2 ? Number(balance2) : 0);

        setCurrentPage("deposit");
      }
    } catch (error) {
      message.error(error as string);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage("pair");
    // 返回第一页时重置余额
    setToken1Balance(0);
    setToken2Balance(0);
  };

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
                      {selectedToken1.symbol.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedToken1.symbol}
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
                      {selectedToken2.symbol.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedToken2.symbol}
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
                      value={tickLower}
                      onChange={(e) => setTickLower(e.target.value)}
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
                      {selectedToken1.symbol} = 1 {selectedToken2.symbol}
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
                      value={tickUpper}
                      onChange={(e) => setTickUpper(e.target.value)}
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
                      {selectedToken1.symbol} = 1 {selectedToken2.symbol}
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
                    value={token1Amount}
                    onChange={(e) => setToken1Amount(e.target.value)}
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
                    {calculateUSDValue(token1Amount, selectedToken1.price || 0)}
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
                    {selectedToken1.symbol.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedToken1.symbol}
                    </Typography>
                    <Typography variant="caption" color="error.main">
                      {token1Balance} {selectedToken1.symbol}
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
                    value={token2Amount}
                    onChange={(e) => setToken2Amount(e.target.value)}
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
                    {calculateUSDValue(token2Amount, selectedToken2.price || 0)}
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
                    {selectedToken2.symbol.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedToken2.symbol}
                    </Typography>
                    <Typography variant="caption" color="error.main">
                      {token2Balance} {selectedToken2.symbol}
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
          selectingToken === "token1" ? selectedToken1 : selectedToken2
        }
        title="选择代币"
      />
    </Dialog>
  );
};

export default AddPositionModal;
