import "dotenv/config";
import issueTokens from "../utils/issueTokens";
require("isomorphic-fetch");
const arra = ["0x03fFAbf308822b38e68D0F9ae926096117b632EF"];

const runWear = async () => {
  console.log("num:", arra.length);
  for (const rec of arra) {
    await issueTokens(
      "0xdEDDdeEDAb5f4F6124814D79c631B5Ca45023Ae4",
      [rec, rec],
      [0, 1],
      {
        speed: "fast",
      }
    );
  }
};

runWear();
