import { ethers } from "ethers";
import { CHAIN_ID, INFURA_PROJECT_ID, ACCOUNT_PRIVATE_KEY } from "./constants";

export const itx = new ethers.providers.InfuraProvider(
  Number(CHAIN_ID),
  INFURA_PROJECT_ID
);

export const signer = new ethers.Wallet(ACCOUNT_PRIVATE_KEY, itx);
