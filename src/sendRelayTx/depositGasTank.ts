import { ethers } from "ethers";
import { requiredEnv } from "../utils/env";

const INFURA_PROJECT_ID = requiredEnv("INFURA_PROJECT_ID");
const ACCOUNT_PRIVATE_KEY = requiredEnv("ACCOUNT_PRIVATE_KEY");
const CHAIN_ID = requiredEnv("CHAIN_ID");

export async function deposit() {
  // Configure the ITX provider using your Infura credentials
  const itx = new ethers.providers.InfuraProvider(
    Number(CHAIN_ID),
    INFURA_PROJECT_ID
  );

  const signer = new ethers.Wallet(ACCOUNT_PRIVATE_KEY, itx);
  console.log(`Signer public address: ${signer.address}`);

  const depositTx = await signer.sendTransaction({
    // Address of the ITX deposit contract
    to: "0x015C7C7A7D65bbdb117C573007219107BD7486f9",
    // The amount of ether you want to deposit in your ITX gas tank
    value: ethers.utils.parseUnits("3", "ether"),
  });
  console.log("Mining deposit transaction...");
  console.log(`hash : ${depositTx.hash} `);

  // Waiting for the transaction to be mined
  const receipt = await depositTx.wait();

  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`);
}

deposit();
