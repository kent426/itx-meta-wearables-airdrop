import { getNonce } from "decentraland-transactions";
import { chains, CHAIN_ID } from "../utils/accounts";
import Provider from "../utils/Provider";
import { Wallet } from "ethers";

const cache: Record<
  string,
  {
    nonceManager: {
      getTransactionCount: () => number;
    };
  }
> = {};

// import { JsonRpcSigner } from "@ethersproject/providers";
export const getMinterRelated = async (
  minterWallet: Wallet,
  contractData: any
): Promise<{
  nonceManager: {
    getTransactionCount: () => number;
  };
}> => {
  // console.log(minterWallet.address);
  if (!cache[minterWallet.address]) {
    // const minterSigner = minterProvider.getSigner(minterWallet.address);
    const nonce = await getNonce(
      new Provider(minterWallet, chains[CHAIN_ID]),
      minterWallet.address,
      contractData.address
    );
    const intnonce = parseInt(nonce, 16);
    console.log("minter address:", minterWallet.address);
    console.log("init nonce num from contract:", nonce);
    const nonceManager = ((initnonce) => {
      var nonce = initnonce;
      return {
        getTransactionCount: () => {
          nonce = Number(nonce) + 1;
          return nonce - 1;
        },
        // incrementTransactionCount: () => {
        //   nonce = nonce + 1;
        // },
      };
    })(intnonce);
    cache[minterWallet.address] = {
      // minterProvider,
      // minterSigner,
      nonceManager,
    };
  }
  return cache[minterWallet.address];
};
