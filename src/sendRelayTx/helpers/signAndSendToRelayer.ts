import { ethers } from "ethers";
import { itx, signer } from "./entities";
import { TxType } from "./TxType";
import { CHAIN_ID } from "./constants";
import { retryPromise } from "../utils/retryPromise";

export const signAndSendToRelayer = async (tx: TxType) => {
  const relayTransactionHashToSign = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "bytes", "uint", "uint", "string"],
      [tx.to, tx.data, tx.gasLimit, CHAIN_ID, tx.schedule]
    )
  );

  try {
    const signature = await signer.signMessage(
      ethers.utils.arrayify(relayTransactionHashToSign)
    );

    // Relay the transaction through ITX
    const sentAtBlock = await retryPromise(() => itx.getBlockNumber(), 3); // Stats
    // console.log("sentAtBlock", sentAtBlock);

    // fetches an object
    // {
    //   relayTransactionHash: string;
    // }
    const { relayTransactionHash } = await retryPromise(
      () => itx.send("relay_sendTransaction", [tx, signature]),
      3
    );
    // const relayTransactionHash = "ggggg";
    return {
      sentAtBlock,
      relayTransactionHash,
      to: tx.to,
    };
  } catch (e) {
    console.log("error: signAndSendToRelayer:", e);
    throw e;
  }
};
