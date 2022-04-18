import {
  createItxLogger,
  createReceiptLogger,
} from "../sendRelayTx/logutils/logger";
import { mkdirLogFolder } from "../sendRelayTx/logutils/mkdirLogFolder";
import { processOneItx } from "../sendRelayTx/processOneItx";
import { delay } from "../sendRelayTx/utils/delay";

// var limit = promiseLimit(1);
const run = async ({
  userAddressList,
  tokenIds,
  toNFTAddress,
  gasLimit,
}: {
  userAddressList: string[];
  tokenIds: number[];
  toNFTAddress: string;
  gasLimit: string;
}) => {
  console.log("start runnning, user list len", userAddressList.length);
  const thisTimeFolder = new Date().toLocaleString().replace(/\//g, "-");
  const folderPath = await mkdirLogFolder({
    thisTimeFolder,
  });
  const itxLogger = createItxLogger({ folderPath });
  const receiptLogger = createReceiptLogger({ folderPath });

  let count = 0;
  let ran = 0;
  for (let oneUserAddress of userAddressList) {
    console.log(" user list len left", userAddressList.length - ran);
    await processOneItx({
      itxLogger,
      receiptLogger,
      toNFTAddress,
      beneficiaries: new Array(tokenIds.length).fill(oneUserAddress), // align with number of tokenIds
      tokenIds,
      gasLimit,
    });

    ran++;
    if (count++ > 20) {
      await delay(20000);
      count = 0;
    } else {
      await delay(2500);
    }
  }
};

const droplist: string[] = [];

run({
  userAddressList: droplist,
  tokenIds: [0],
  toNFTAddress: "0xdEDDdeEDAb5f4F6124814D79c631B5Ca45023Ae4",
  gasLimit: "500000",
}).catch((e) => {
  console.warn("run", e);
});
