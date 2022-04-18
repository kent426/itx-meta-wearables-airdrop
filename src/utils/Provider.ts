import type { ChainId } from "@dcl/schemas";
import { requiredEnv } from "./env";
import { JsonRpcProvider } from "@ethersproject/providers";
import type { Wallet } from "@ethersproject/wallet";
import { signTypedData, SignTypedDataVersion } from "@metamask/eth-sig-util";

const RPC_URLS = requiredEnv("RPC_URLS");

export default class Provider extends JsonRpcProvider {
  static Empty(chainId: ChainId) {
    return new JsonRpcProvider(
      {
        url: RPC_URLS[chainId],
        // headers: { Referer: "https://decentraland.org" },
      },
      chainId
    );
  }

  wallet: Wallet;

  constructor(wallet: Wallet, chainId: ChainId) {
    super(
      {
        url: RPC_URLS[chainId],
        // headers: { Referer: "https://decentraland.org" },
      },
      chainId
    );
    // console.log({
    //     url: RPC_URLS[chainId],
    //     // headers: { Referer: "https://decentraland.org" },
    //   },
    //   chainId)
    this.wallet = wallet;
  }

  async send(method: string, params: any[]): Promise<any> {
    switch (method) {
      case "eth_requestAccounts":
        return this.wallet
          ? [this.wallet.address.toString().toLowerCase()]
          : [];

      case "eth_signTypedData_v4":
        const [signer, raw] = (params || ["", ""]) as [string, string];
        if (!this.wallet) {
          throw new Error(`Empty account`);
        }

        if (
          this.wallet.address.toString().toLowerCase() !==
          signer.toString().toLowerCase()
        ) {
          throw new Error(
            `Invalid account: "${this.wallet.address.toString().toLowerCase()}"`
          );
        }

        // return account.sign(data).signature
        const data = JSON.parse(raw);
        return signTypedData({
          data,
          privateKey: Buffer.from(this.wallet.privateKey.slice(2), "hex"),
          version: SignTypedDataVersion.V4,
        });

      default:
        return super.send(method, params);
    }
  }
}
