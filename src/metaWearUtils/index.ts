import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
// import Provider from "./Provider";
import {
  getContract,
  ContractName,
  getExecuteMetaTransactionData,
  getSalt,
  getDomainData,
  getDataToSign,
  getSignature,
} from "decentraland-transactions";

import { chains, CHAIN_ID, getAccount } from "../utils/accounts";

import { signTypedData, SignTypedDataVersion } from "@metamask/eth-sig-util";
// import { NonceManager } from "@ethersproject/experimental";
import { ethers } from "ethers";
import memoize from "lodash.memoize";
import { getMinterRelated } from "./getMinterRelated";
import { signSignature } from "./signSignature";

export default async function getIssueTokensMetaData(
  nftAddress: string,
  beneficiaries: string[],
  tokens: (string | number)[]
) {
  const contractData = {
    ...getContract(ContractName.ERC721CollectionV2, chains[CHAIN_ID]),
    address: nftAddress,
  };

  const minterWallet = await getAccount()!;
  const { nonceManager } = await getMinterRelated(minterWallet, contractData);
  const nonce = await nonceManager.getTransactionCount();
  console.log("get nonce", nonce);
  // nonceManager.incrementTransactionCount();

  const nftiface = new ethers.utils.Interface(contractData.abi);

  console.log("beneficiaries", beneficiaries);
  console.log("tokens", tokens);

  const encoded = nftiface.encodeFunctionData("issueTokens", [
    beneficiaries,
    tokens,
  ]);

  const salt = getSalt(contractData.chainId);

  // const { abi, ...resttt } = contractData;
  // console.log("contractData", resttt);

  const domainData = getDomainData(salt, contractData);

  // console.log("domainData", domainData);

  const dataToSign = getDataToSign(
    minterWallet.address.toLowerCase(),
    String(nonce),
    encoded,
    domainData
  );
  // console.log("dataToSign", dataToSign);
  const signature = await signSignature(
    minterWallet,
    minterWallet.address.toLowerCase(),
    dataToSign
  );

  // console.log("signature", signature);

  const txData = getExecuteMetaTransactionData(
    minterWallet.address.toLowerCase(),
    signature,
    encoded
  );

  // console.log("txData", txData);

  return {
    txData,
    nonce,
  };
}
