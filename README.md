# itx-meta-wearables-airdrop

This repository uses [itx(infura transactions)](https://docs.infura.io/infura/features/transactions) to do decentralands wearable airdrop.

To try out the itx airdrop feature, fillout the `.env.example` parameters and rename it to `.env`. and locate the entry point of itx airdrop in [src/wears_itx/demo.ts](./src/wears/index.ts), and fill in the user addresses in the `droplist` array.

&nbsp;

The implementaion idea is to use itx to call the `executeMetaTransaction` from [Wearable V2 contract](https://github.com/decentraland/wearables-contracts/blob/master/contracts/commons/NativeMetaTransaction.sol) with the `IssueTokens` function selector and its arguments data as calldata in [here](https://github.com/decentraland/wearables-contracts/blob/master/contracts/collections/v2/ERC721BaseCollectionV2.sol) to execute the airdrop.

For every minter of Wearable V2, the meta transaction on the contract side uses sequential nonce management; we rely on itx to correctly process the airdrop sequence. And it is not fully tested. Use at your own risk.

&nbsp;

Some code are from [l2-airdrop](https://github.com/decentraland/l2-airdrop) and [decentraland-transactions](https://github.com/decentraland/decentraland-transactions).

Currrently, there is no cli for this project.

The entry point of the old way (calling `issueTokens` directly) is in [src/wears/index.ts](./src/wears/index.ts).

The entry point of the meta-transaction approach is in [src/wears_itx/demo.ts](./src/wears/index.ts).

### File structure for this project

- `src/wears` and `src/wears_itx` are two entry points, as mentioned above.

- `src/utils` is the folder for utils to load env variables and api to get gas price and stuff; they are mainly ported from [l2-airdrop](https://github.com/decentraland/l2-airdrop) with minor modification.

- `src/utils/sendRelayTx` contains:

  - `askGasTank` and `depositGasTank `, these two tasks are from [itx-tutorial](https://docs.infura.io/infura/features/transactions).

  - `logutils` folder has functions, firstly, to make log-folder with the name of current datetime to hold the logs; secondly, to create two internal loggers for logging itx-hash and itx-receipt.

  - `helpers` folder contains code to handle itx. mainly referenced from [itx-tutorial](https://docs.infura.io/infura/features/transactions).

  - `metaWearUtils` folder has code to handle signature signing from minter for meta-transaction. Code are modified from [decentraland-transactions](https://github.com/decentraland/decentraland-transactions). Because the npm of it does not contain src folder, this project places the modified the source code of decentraland-transactions under the root.
