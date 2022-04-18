import { delay } from "./delay";

export async function retryPromise<T>(
  promiseFn: () => Promise<T>,
  time: number,
  delayTime: number = 1000
): Promise<T> {
  try {
    const result = await promiseFn();
    return result;
  } catch (e) {
    if (time < 0) throw e;
    else {
      await delay(delayTime);
      return await retryPromise(() => promiseFn(), time - 1);
    }
  }
}
