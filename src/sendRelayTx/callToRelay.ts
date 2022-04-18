import { ethers } from "ethers";
import { makeTx } from "./helpers/makeTx";
import { signAndSendToRelayer } from "./helpers/signAndSendToRelayer";

export const callToRelay = async ({
  to,
  data,
  gasLimit,
}: {
  to: string;
  data: any;
  gasLimit: string;
}) => {
  // console.log("data: ", data);
  // Create the transaction relay request
  const tx = makeTx({ to, data, gasLimit });

  const txinfo = await signAndSendToRelayer(tx);
  const { relayTransactionHash, sentAtBlock } = txinfo;
  return { relayTransactionHash, sentAtBlock, to };
};
