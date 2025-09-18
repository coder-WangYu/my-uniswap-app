import React, { useState, useMemo, useEffect, useRef } from "react";
import { Paper, Typography, Box, Alert, Link } from "@mui/material";
import { Warning, Info } from "@mui/icons-material";
import SwapInput from "./SwapInput";
import SwapButton from "./SwapButton";
import SwapToggle from "./SwapToggle";
import TokenSelectorModal from "./TokenSelectorModal";
import { tokensConfig } from "../lib/contracts";
import { useUser } from "../hooks/useUser";
import { Token } from "../interfaces";
import { useSwapRouter } from "../hooks/useSwapRouter";
import { useMessage } from "../contexts/MessageContext";

const TokenSwap = () => {
  const [fromToken, setFromToken] = useState<Token>({
    ...tokensConfig.ETH,
    balance: 0,
  });
  const [toToken, setToToken] = useState<Token>({
    ...tokensConfig.WYTokenA,
    balance: 0,
  });
  const [fromAmount, setFromAmount] = useState<{
    amount: string;
    token: Token;
  }>({
    amount: "0",
    token: fromToken,
  });
  const [toAmount, setToAmount] = useState<{ amount: string; token: Token }>({
    amount: "0",
    token: toToken,
  });
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false);
  const [selectingToken, setSelectingToken] = useState<"from" | "to">("from");
  const { isConnected, getTokenBalance } = useUser();
  const { quoteAmountOut, executeSwap } = useSwapRouter();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const message = useMessage();

  // 当fromToken或toToken变化时，更新对应的value
  useEffect(() => {
    setFromAmount((prev) => ({ ...prev, token: fromToken }));
  }, [fromToken]);

  useEffect(() => {
    setToAmount((prev) => ({ ...prev, token: toToken }));
  }, [toToken]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    const tempValue = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempValue);
  };

  // 处理代币交换
  const handleSwap = async () => {
    const result = await executeSwap(
      fromToken.address,
      toToken.address,
      fromAmount.amount
    );
    
    if(result === "success") {
      message.success("交易成功");
      await getBalance();
      setFromAmount((prev) => ({ ...prev, amount: "0" }));
      setToAmount((prev) => ({ ...prev, amount: "0" }));
    } else {
      message.error("交易失败");
    }
  };

  const handleMaxClick = () => {
    if (fromToken.balance) {
      setFromAmount((prev) => ({
        ...prev,
        amount: fromToken.balance!.toString(),
      }));
    }
  };

  const handleSelectFromToken = () => {
    setSelectingToken("from");
    setTokenSelectorOpen(true);
  };

  const handleSelectToToken = () => {
    setSelectingToken("to");
    setTokenSelectorOpen(true);
  };

  const handleTokenSelect = async (token: Token) => {
    const balance = await getTokenBalance(token);
    token.balance = Number(balance);

    if (selectingToken === "from") {
      setFromToken(token);
    } else {
      setToToken(token);
    }
  };

  // 处理fromAmount的amount变化
  const handlefromAmountChange = async (amount: string) => {
    setFromAmount((prev) => ({ ...prev, amount }));

    if (!amount || parseFloat(amount) === 0) {
      return;
    }

    // 清除之前的定时器
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 防抖
    debounceTimer.current = setTimeout(async () => {
      try {
        const amountOut = await quoteAmountOut(
          fromToken.address,
          toToken.address,
          amount
        );
        if (amountOut) {
          setToAmount((prev) => ({ ...prev, amount: amountOut.toString() }));
        }
      } catch (error) {
        message.error(`获取报价失败: ${error}`);
      }
    }, 500);
  };

  // 动态计算按钮文本和状态
  const { buttonText, isDisabled, errorMessage } = useMemo(() => {
    if (!isConnected) {
      return {
        buttonText: "点右上角连接钱包",
        isDisabled: true,
        errorMessage: null,
      };
    }

    const fromAmountValue = parseFloat(fromAmount.amount) || 0;

    // 如果购买代币未选择
    if (!toToken.symbol) {
      return {
        buttonText: "选择代币",
        isDisabled: true,
        errorMessage: null,
      };
    }

    // 如果输入金额为0或无效
    if (fromAmountValue === 0) {
      return {
        buttonText: "输入金额",
        isDisabled: true,
        errorMessage: null,
      };
    }

    // 如果余额不足
    if (
      fromToken.balance !== undefined &&
      fromAmountValue > fromToken.balance
    ) {
      return {
        buttonText: `${fromToken.symbol} 不足`,
        isDisabled: true,
        errorMessage: `${fromToken.symbol} 不足, 无法兑换`,
      };
    }

    // 如果金额足够
    return {
      buttonText: "立即交换",
      isDisabled: false,
      errorMessage: null,
    };
  }, [
    isConnected,
    fromAmount.amount,
    fromToken.balance,
    fromToken.symbol,
    toToken.symbol,
  ]);

  // 获取代币余额
  async function getBalance() {
    const balance1 = await getTokenBalance(fromToken);
    const balance2 = await getTokenBalance(toToken);
    setFromToken((prev) => ({ ...prev, balance: Number(balance1) }));
    setToToken((prev) => ({ ...prev, balance: Number(balance2) }));
  }

  useEffect(() => {
    if (isConnected) {
      getBalance();
    }
  }, [isConnected]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        maxWidth: 480,
        width: "100%",
      }}
    >
      <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        交换
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* 出售部分 */}
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            出售
          </Typography>
          <SwapInput
            value={fromAmount.amount}
            onChange={handlefromAmountChange}
            token={fromToken}
            onSelectToken={handleSelectFromToken}
            showMax={true}
            onMaxClick={handleMaxClick}
            showUsdValue={false}
            usdValue={
              fromToken.price
                ? (parseFloat(fromAmount.amount) * fromToken.price).toFixed(2)
                : "0"
            }
          />
        </Box>

        <SwapToggle onClick={handleSwapTokens} />

        {/* 购买部分 */}
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            购买
          </Typography>
          <SwapInput
            value={toAmount.amount}
            onChange={() => {}}
            token={toToken}
            onSelectToken={handleSelectToToken}
            showUsdValue={false}
            usdValue={
              toToken.price
                ? (parseFloat(toAmount.amount) * toToken.price).toFixed(2)
                : "0"
            }
            readOnly={true}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <SwapButton
            onClick={handleSwap}
            disabled={isDisabled}
            text={buttonText}
          />

          {/* 错误信息 */}
          {errorMessage && (
            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Warning sx={{ color: "warning.main", fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                {errorMessage}
              </Typography>
            </Box>
          )}

          {/* Gas费用说明 */}
          <Box sx={{ mt: 2 }}>
            <Alert
              severity="info"
              icon={<Info />}
              sx={{
                backgroundColor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
                "& .MuiAlert-message": {
                  width: "100%",
                },
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                这是在区块链上处理你的交易的费用。Uniswap 不从这些费用分成。
              </Typography>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "primary.main",
                  textDecoration: "underline",
                  "&:hover": {
                    textDecoration: "none",
                  },
                }}
              >
                了解详情
              </Link>
            </Alert>
          </Box>
        </Box>
      </Box>

      <TokenSelectorModal
        open={tokenSelectorOpen}
        onClose={() => setTokenSelectorOpen(false)}
        onSelectToken={handleTokenSelect}
        currentToken={selectingToken === "from" ? fromToken : toToken}
        title="选择代币"
      />
    </Paper>
  );
};

export default TokenSwap;
