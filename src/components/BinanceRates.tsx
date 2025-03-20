import React, { useEffect, useState } from "react";
import { subscribeToRates } from "../services/socket";

interface Rate {
  symbol: string;
  price: string;
  prevPrice: number;
}

const BinanceRates: React.FC = () => {
  const [rates, setCoins] = useState<Rate[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToRates((data) => {
      setCoins((prevCoins) => ({
        ...prevCoins,
        [data.symbol]: {
          price: data.price,
          prevPrice: prevCoins[data.symbol]?.price || 0,
        },
      }));
    });

    return () => {
      unsubscribe(); // Unsubscribe when component unmounts
    };
  }, []);

  const topCoins = Object.entries(rates)
    .slice(0, 10)
    .map(([symbol, { price, prevPrice }]) => ({
      symbol,
      price,
      isUp: parseFloat(price) >= prevPrice,
    }));

  return (
    <div className="container">
      <h2>Live Binance Prices</h2>
      <table>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Price (USDT)</th>
          </tr>
        </thead>
        <tbody>
          {topCoins.map((rate) => (
            <tr key={rate.symbol}>
              <td>{rate.symbol.toUpperCase()}</td>
              <td className={rate.isUp ? "price-up" : "price-down"}>
                  ${parseFloat(rate.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BinanceRates;
