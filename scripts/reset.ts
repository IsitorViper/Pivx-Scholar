// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { promises as fs } from "fs";

import { MongoClient } from "mongodb";
import { env } from "process";

async function main() {
  console.log("Connecting to MongoDB");
  const client = new MongoClient(process.env.MONGO_URL as string);
  await client.connect();

  const db = client.db();

  console.log("Deleting all collections");
  await db.collection("users").deleteMany({});
  await db.collection("paper").deleteMany({});
  await client.close();

  console.log("Deploying PeerReview contract");
  const PeerReview = await ethers.getContractFactory("PeerReview");
  console.log("Deploying 01...");

  const contract = await PeerReview.deploy();
  console.log("Deploying 2...");

  console.log("PeerReview---", PeerReview, "contract", contract);

  await contract.deployed();

  console.log("PeerReview deployed to:", contract.address);

  const BACKEND_ENV = `
MONGO_URL=${process.env.MONGO_URL}
TOKEN_KEY=secret
PEER_REVIEW_CONTRACT_ADDRESS=${contract.address}
DEV_URL=${process.env.DEV_URL}
PRIVATE_KEY=${process.env.PRIVATE_KEY}
`;

  // const BACKEND_ENV = `
  // MONGO_URL="mongodb+srv://mohamedasjadh:isRGsSkywprrZZU0@cluster0.ynapdyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  // TOKEN_KEY=secret
  // PEER_REVIEW_CONTRACT_ADDRESS=${contract.address}
  // DEV_URL=${process.env.DEV_URL}
  // PRIVATE_KEY=${process.env.PRIVATE_KEY}
  // `;

  console.log("Writing to backend .env file");
  await fs.writeFile("./backend/.env", BACKEND_ENV);

  const FRONTEND_ENV = `
REACT_APP_API_URL=http://ec2-54-158-0-218.compute-1.amazonaws.com:3001/
REACT_APP_PEER_REVIEW_CONTRACT_ADDRESS=${contract.address}
`;
  console.log("Writing to frontend .env file");
  await fs.writeFile("./frontend/.env", FRONTEND_ENV);

  const wallAdd = "0x4c91e377A53552097EF165f3195b811b75aac547";

  const walletAddresses = wallAdd?.split(",");

  const signer = ethers.provider.getSigner();
  if (walletAddresses) {
    for (const address of walletAddresses) {
      console.log(`Sending 5ETH to ${address}`);
      await signer.sendTransaction({
        to: address,
        value: ethers.utils.parseEther("5"),
      });
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
