import { useQuery } from "@tanstack/react-query";

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  sparkline_in_7d?: { price: number[] };
}

export interface CoinDetailData extends CoinMarketData {
  description: { en: string };
  circulating_supply: number;
  max_supply: number | null;
}

export function useMarketData(page = 1, perPage = 100) {
  return useQuery({
    queryKey: ["coingecko", "markets", page, perPage],
    queryFn: async (): Promise<CoinMarketData[]> => {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`
      );
      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
        throw new Error("Failed to fetch market data");
      }
      return res.json();
    },
    refetchInterval: 60000, // Refresh every 60s
    staleTime: 30000,
  });
}

export function useCoinDetail(id: string) {
  return useQuery({
    queryKey: ["coingecko", "coin", id],
    queryFn: async (): Promise<CoinDetailData> => {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit exceeded.");
        throw new Error("Failed to fetch coin details");
      }
      const data = await res.json();
      return {
        id: data.id,
        symbol: data.symbol,
        name: data.name,
        image: data.image.large,
        current_price: data.market_data.current_price.usd,
        market_cap: data.market_data.market_cap.usd,
        market_cap_rank: data.market_cap_rank,
        total_volume: data.market_data.total_volume.usd,
        price_change_percentage_24h: data.market_data.price_change_percentage_24h,
        high_24h: data.market_data.high_24h.usd,
        low_24h: data.market_data.low_24h.usd,
        description: data.description,
        circulating_supply: data.market_data.circulating_supply,
        max_supply: data.market_data.max_supply,
      };
    },
    enabled: !!id,
    staleTime: 60000,
  });
}

export function useCoinChart(id: string, days: number = 7) {
  return useQuery({
    queryKey: ["coingecko", "chart", id, days],
    queryFn: async (): Promise<{ prices: [number, number][] }> => {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit exceeded.");
        throw new Error("Failed to fetch chart data");
      }
      return res.json();
    },
    enabled: !!id,
    staleTime: 5 * 60000, // 5 mins
  });
}
