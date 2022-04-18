import { DataToSign } from "decentraland-transactions";
import { Wallet } from "ethers";

export const signSignature = async (
  wallet: Wallet,
  signerAddress: string,
  rawData: DataToSign
) => {
  if (!wallet) {
    throw new Error(`Empty account`);
  }

  if (
    wallet.address.toString().toLowerCase() !==
    signerAddress.toString().toLowerCase()
  ) {
    throw new Error(
      `Invalid account: "${wallet.address.toString().toLowerCase()}"`
    );
  }

  // return account.sign(data).signature
  const res = await wallet._signTypedData(
    rawData.domain,
    { MetaTransaction: rawData.types.MetaTransaction },
    rawData.message
  );
  return res;
  // const data = JSON.parse(rawData);
  // return signTypedData({
  //   data,
  //   privateKey: Buffer.from(wallet.privateKey.slice(2), "hex"),
  //   version: SignTypedDataVersion.V4,
  // });
};
