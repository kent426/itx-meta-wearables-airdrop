import { TransactionReceipt } from "@ethersproject/providers";
import winston from "winston";
import { itx } from "./helpers/entities";
import { delay } from "./utils/delay";
import { retryPromise } from "./utils/retryPromise";

// const waitAndLogRelayTxs = async (relayTxs: string[]) => {};

export async function waitTransaction(
  relayTransactionHash: string,
  delayTime: number = 20000,
  receiptLogger: winston.Logger,
  beneficiaries: string[]
) {
  let mined = false;
  let minedreceipt: TransactionReceipt | null = null;

  while (!mined) {
    const statusResponse = await itx.send("relay_getTransactionStatus", [
      relayTransactionHash,
    ]);

    console.log("waiting TransactionReceipt: ", relayTransactionHash);

    if (statusResponse.broadcasts) {
      for (let i = 0; i < statusResponse.broadcasts.length; i++) {
        const bc = statusResponse.broadcasts[i];
        const receipt = await retryPromise(
          () => itx.getTransactionReceipt(bc.ethTxHash),
          5
        );
        if (receipt && receipt.confirmations && receipt.confirmations >= 1) {
          mined = true;
          minedreceipt = receipt;
          break;
        }
      }
    }
    await delay(delayTime);
  }
  receiptLogger.info({
    relayTransactionHash,
    beneficiaries,
    hash: minedreceipt?.transactionHash,
    effectiveGasPrice: minedreceipt?.effectiveGasPrice,
    gasUsed: minedreceipt?.gasUsed,
    status: minedreceipt?.status,
  });
  if (minedreceipt?.status == 0) throw "relayTransactionHash fail";

  return minedreceipt;
}
