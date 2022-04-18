import { TxType } from "./TxType";

export const makeTx = ({ to, gasLimit, schedule = "fast", data }: TxType) => ({
  to,
  data,
  gasLimit,
  schedule,
});
