// src/hooks/useTokens.ts
import { useQuery } from '@apollo/client/react'
import { GET_TOKENS, GET_TOKEN_DAY_DATA } from '../api'

export const useTokens = (first: number = 10, skip?: number) => {
  const { data, loading, error, refetch } = useQuery(GET_TOKENS, {
    variables: { first, skip },
    pollInterval: 10000, // 每10秒轮询一次
  })

  return {
    tokens: data?.tokens || [],
    loading,
    error,
    refetch
  }
}

export const useTokenDayData = (tokenId: string, first: number = 7) => {
  const { data, loading, error } = useQuery(GET_TOKEN_DAY_DATA, {
    variables: { tokenId, first },
    skip: !tokenId,
  })

  return {
    dayData: data?.tokenDayDatas || [],
    loading,
    error
  }
}