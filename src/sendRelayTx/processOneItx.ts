import { callToRelay } from "./callToRelay";
import winston from "winston";
import getIssueTokensMetaData from "../metaWearUtils";
import { waitTransaction } from "./waitTransaction";

export const processOneItx = async ({
  itxLogger,
  receiptLogger,
  toNFTAddress,
  beneficiaries,
  tokenIds,
  gasLimit,
}: {
  itxLogger: winston.Logger;
  receiptLogger: winston.Logger;
  toNFTAddress: string;
  beneficiaries: string[];
  tokenIds: number[];
  gasLimit: string;
}) => {
  const { txData, nonce } = await getIssueTokensMetaData(
    toNFTAddress,
    beneficiaries,
    tokenIds
  );
  const { relayTransactionHash, sentAtBlock } = await callToRelay({
    to: toNFTAddress,
    data: txData.toLowerCase(),
    gasLimit,
  });
  itxLogger.info({
    relayTransactionHash,
    sentAtBlock,
    nonce,
    beneficiaries,
  });

  // async
  waitTransaction(
    relayTransactionHash,
    10000,
    receiptLogger,
    beneficiaries
  ).catch((e) => {
    console.warn("waitTransaction error:", e);
  });
  // receiptLogger.info({
  //   relayTransactionHash,
  //   beneficiaries,
  //   hash: receipt?.transactionHash,
  //   effectiveGasPrice: receipt?.effectiveGasPrice,
  //   gasUsed: receipt?.gasUsed,
  //   status: receipt?.status,
  // });
};
