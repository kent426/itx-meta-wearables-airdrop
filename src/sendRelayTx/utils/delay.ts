export const delay = (time: number = 1000) =>
  new Promise((res) => setTimeout(res, time));
