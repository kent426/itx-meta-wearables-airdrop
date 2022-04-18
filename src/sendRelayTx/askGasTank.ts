import * as ethers from "ethers";
import { requiredEnv } from "../utils/env";
import { delay } from "./utils/delay";

const INFURA_PROJECT_ID = requiredEnv("INFURA_PROJECT_ID");
const ACCOUNT_PRIVATE_KEY = requiredEnv("ACCOUNT_PRIVATE_KEY");
const CHAIN_ID = requiredEnv("CHAIN_ID");

async function askGasTank() {
  // Configure the ITX provider using your Infura credentials
  const itx = new ethers.providers.InfuraProvider(
    Number(CHAIN_ID),
    INFURA_PROJECT_ID
  );

  // Create a signer instance based on your private key
  const signer = new ethers.Wallet(ACCOUNT_PRIVATE_KEY, itx);
  console.log(`Signer public address: ${signer.address}`);

  // Check your existing ITX balance
  // balance is added by sending eth to the deposit address: 0x015C7C7A7D65bbdb117C573007219107BD7486f9
  // balance is deducted everytime you send a relay transaction
  const { balance } = await itx.send("relay_getBalance", [signer.address]);
  console.log(`Current ITX balance: ` + ethers.utils.formatEther(balance));
}

const asks = async () => {
  while (true) {
    askGasTank();
    await delay(2000);
  }
};

asks();
