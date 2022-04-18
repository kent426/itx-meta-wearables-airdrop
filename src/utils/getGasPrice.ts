import { parseUnits } from "@ethersproject/units";
import { BigNumberish } from "@ethersproject/bignumber";
import Provider from "./Provider";
import { chains, CHAIN_ID } from "./accounts";
import { requiredEnv } from "./env";

export const POLYGON_CHAIN_ID = chains[CHAIN_ID];

const provider = Provider.Empty(POLYGON_CHAIN_ID);

export type GasData = {
  safeLow: number;
  standard: number;
  fast: number;
  fastest: number;
  blockTime: number;
  blockNumber: number;
};

export type GasPriceOptions = {
  speed?: "safeLow" | "standard" | "fast" | "fastest" | null;
  maxGasPrice?: number | null;
  minGasPrice?: number | null;
};

const matic_gas_url = requiredEnv("GAS_URL");

export const MIN_MATIC_GAS_PRICE = parseUnits(String(35), "gwei");

export async function getGasPrice(options: GasPriceOptions) {
  let gasPrice: BigNumberish;
  if (options.speed) {
    const req = await fetch(matic_gas_url);
    const data: GasData = await req.json();
    gasPrice = parseUnits(
      Math.floor(data[options.speed] * 1.2).toString(),
      "gwei"
    );
    // console.log("gasPrice ins :", gasPrice);
  } else {
    gasPrice = await provider.getGasPrice();
  }

  if (gasPrice.lt(MIN_MATIC_GAS_PRICE)) {
    gasPrice = MIN_MATIC_GAS_PRICE;
  }

  // if (options.minGasPrice) {
  //   const minGasPrice = parseUnits(String(options.minGasPrice), "gwei");
  //   if (gasPrice.lt(minGasPrice)) {
  //     gasPrice = minGasPrice;
  //   }
  // }

  // if (options.maxGasPrice) {
  //   const maxGasPrice = parseUnits(String(options.maxGasPrice), "gwei");
  //   if (gasPrice.gt(maxGasPrice)) {
  //     gasPrice = maxGasPrice;
  //   }
  // }

  // if (gasPrice.lt(MIN_MATIC_GAS_PRICE)) {
  //   throw new Error(
  //     `Gas price is lower than the network minimun: 30gewi.\nRead more here: https://forum.matic.network/t/recommended-min-gas-price-setting/2531`
  //   );
  // }

  return gasPrice;
}
