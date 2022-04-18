import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
// import Provider from "./Provider";
import { getContract, ContractName } from "decentraland-transactions";

import { getGasPrice } from "./getGasPrice";
import { chains, CHAIN_ID, getAccount } from "./accounts";
import { parseEther } from "@ethersproject/units";

export type GasPriceOptions = {
  speed?: "safeLow" | "standard" | "fast" | "fastest" | null;
  maxGasPrice?: number | null;
  minGasPrice?: number | null;
};

export const POLYGON_CHAIN_ID = chains[CHAIN_ID];
// const provider = Provider.Empty(POLYGON_CHAIN_ID);

// const txs = new Map<string, string>();
let count = 0;
export default async function issueTokens(
  address: string,
  beneficiaries: string[],
  tokens: (string | number)[],
  options: Partial<GasPriceOptions> = {}
) {
  const data = {
    ...getContract(ContractName.ERC721CollectionV2, chains[CHAIN_ID]),
    address,
  };
  const contract = new Contract(data.address, data.abi);
  const pupulated = await contract.populateTransaction.issueTokens(
    beneficiaries,
    tokens
  );
  const encoded = pupulated.data!;
  const account = await getAccount()!;

  let hash: string;

  const gasPrice = BigNumber.from(20000000000);
  let gasLimit;
  try {
    gasLimit = await account.estimateGas({
      to: address,
      data: encoded,
      gasPrice,
    });
  } catch (e) {
    gasLimit = BigNumber.from(250000);
  }
  console.log("gasPrice", gasPrice.toNumber());
  console.log("gasLimit", gasLimit.toNumber());
  console.log("beneficiary: ", beneficiaries);
  const tx = await account.sendTransaction({
    to: address,
    data: encoded,
    gasLimit,
    gasPrice,
    nonce: 3,
  });
  hash = tx.hash;
  console.log("tx.nonce:", tx.nonce);
  console.log(`new transaction: https://polygonscan.com/tx/${hash}`);
  console.log("sent");
  await tx.wait(1);
  // hash = tx.hash;

  console.log("count: ", ++count);

  //   txs.set(accountAddress!, hash);
  // console.log(`new transaction: https://polygonscan.com/tx/${hash}`);
  // return hash;
}
