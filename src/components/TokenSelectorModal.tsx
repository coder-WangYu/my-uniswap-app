import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import { Close, Search, TrendingUp } from "@mui/icons-material";
import { tokensConfig } from "../libs/contracts";

interface Token {
  symbol: string;
  name: string;
  address: string;
  balance?: number;
  logo?: string;
  price?: number;
  volume24h?: number;
}

interface TokenSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelectToken: (token: Token) => void;
  currentToken?: Token;
  title?: string;
}

// 从contracts配置中获取代币数据
const mockTokens: Token[] = Object.values(tokensConfig).map((tokenConfig) => ({
  symbol: tokenConfig.symbol,
  name: tokenConfig.name,
  address: tokenConfig.address,
  balance: 0, // 默认余额为0，实际使用时需要从合约获取
  price: 1.0, // 默认价格，实际使用时需要从价格API获取
  volume24h: 1000000, // 默认24小时交易量
}));

// 热门代币 - 使用实际配置中的代币
const popularTokens = ["ETH", "AWY", "BWY", "CWY", "DWY"];

const TokenSelectorModal = ({
  open,
  onClose,
  onSelectToken,
  currentToken,
  title = "选择代币",
}: TokenSelectorModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 过滤代币
  const filteredTokens = useMemo(() => {
    if (!searchTerm) return mockTokens;
    return mockTokens.filter(
      (token) =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // 获取代币图标颜色
  const getTokenColor = (symbol: string) => {
    const colors: { [key: string]: string } = {
      ETH: "#6366f1",
      AWY: "#ef4444",
      BWY: "#f97316",
      CWY: "#eab308",
      DWY: "#22c55e",
      EWY: "#06b6d4",
      FWY: "#8b5cf6",
      GWY: "#ec4899",
      HWY: "#84cc16",
      IWY: "#f59e0b",
      JWY: "#10b981",
    };
    return colors[symbol] || "#6b7280";
  };

  // 格式化地址
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 格式化交易量
  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const handleTokenSelect = (token: Token) => {
    onSelectToken(token);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={false}
      PaperProps={{
        sx: {
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          maxHeight: "70vh",
          width: "480px",
          maxWidth: "90vw",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1.5,
          px: 2,
          pt: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2, py: 0, overflow: "hidden" }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* 搜索栏 */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="搜索代币"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.25,
                        }}
                      >
                        {["#ec4899", "#3b82f6", "#8b5cf6", "#f59e0b"].map(
                          (color, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 8,
                                height: 8,
                                backgroundColor: color,
                                borderRadius: 0.5,
                              }}
                            />
                          )
                        )}
                      </Box>
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
          </Box>

          {/* 热门代币 */}
          {!searchTerm && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
                {popularTokens.map((symbol) => {
                  const token = mockTokens.find((t) => t.symbol === symbol);
                  if (!token) return null;
                  return (
                    <Button
                      key={symbol}
                      variant="outlined"
                      size="small"
                      onClick={() => handleTokenSelect(token)}
                      sx={{
                        minWidth: "auto",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        borderColor: "divider",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "primary.main",
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: getTokenColor(symbol),
                            fontSize: "0.75rem",
                          }}
                        >
                          {symbol.charAt(0)}
                        </Avatar>
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {symbol}
                        </Typography>
                      </Box>
                    </Button>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* 排序说明 */}
          {!searchTerm && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <TrendingUp sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                按24小时代币交易量排序
              </Typography>
            </Box>
          )}

          {/* 代币列表 */}
          <Box sx={{ 
            flex: 1, 
            overflow: "auto",
            maxHeight: "300px",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
          }}>
            <List sx={{ p: 0 }}>
              {filteredTokens.slice(0, 10).map((token, index) => (
                <React.Fragment key={`${token.symbol}-${token.address}`}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleTokenSelect(token)}
                      sx={{
                        py: 1,
                        px: 0,
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: getTokenColor(token.symbol),
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          {token.symbol.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {token.name}
                            </Typography>
                            <Chip
                              label={token.symbol}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.75rem",
                                backgroundColor: "action.selected",
                                color: "text.primary",
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {formatAddress(token.address)}
                          </Typography>
                        }
                      />
                      {token.volume24h && (
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ${formatVolume(token.volume24h)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            24h 交易量
                          </Typography>
                        </Box>
                      )}
                    </ListItemButton>
                  </ListItem>
                  {index < filteredTokens.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSelectorModal;
