import express from "express";
import { ethers } from "ethers";
import Dash from "dash";

import User, { UserInterface } from "../models/user";
import jwt from "jsonwebtoken";
import { jwtAuth } from "./jwtMiddleware";
import PaperModel from "../models/paper";
import { getScholarDetails } from "../utils/scholar";
import getBlockchain from "../utils/ethers";

const router = express.Router();

declare global {
  namespace Express {
    interface Request {
      user: UserInterface;
    }
  }
}

router.get("/me", jwtAuth, async (req, res) => {
  res.status(201).json(req.user);
});

router.use("/external-adapter", async (req, res) => {
  try {
    const { scholarUrl, address } = req.body.data;

    const scholarDetails = await getScholarDetails(scholarUrl);

    const hindex = scholarDetails.hindex;

    let trustRating = 0;

    if (hindex <= 0) {
      trustRating = 10;
    } else if (hindex > 0 && hindex < 3) {
      trustRating = 50;
    } else if (hindex >= 3 && hindex < 6) {
      trustRating = 60;
    } else if (hindex >= 6 && hindex < 10) {
      trustRating = 85;
    } else {
      trustRating = 100;
    }

    res.status(200).send({
      data: {
        valid: scholarDetails.affiliation
          .toLocaleLowerCase()
          .includes(address.toLocaleLowerCase()),
        trustRating,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "server error" });
  }
});

router.post("/register", async (req, res) => {
  const { address, signature, scholarUrl } = req.body;

  try {
    
    if (
      ethers.utils.verifyMessage(
        "Click sign below to authenticate with Peer Review :)",
        signature
      ) ===
      ethers.utils.verifyMessage(
        "Click sign below to authenticate with Peer Review :)",
        signature
      )
    ) {
      const scholarDetails = await getScholarDetails(scholarUrl);

      if (
        !scholarDetails.affiliation
          .toLocaleLowerCase()
          .includes(address.toLocaleLowerCase())
      ) {
        return res.status(401).json({
          success: false,
          message: "You are not affiliated with this scholar",
        });
      }
      
      const user = new User({
        address,
        name: scholarDetails.name,
        email: scholarDetails.email,
        designation: scholarDetails.affiliation,
        scholarUrl: scholarUrl,
      });
      await user.save();
      return res.json({
        success: true,
        message: "User registered successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (err) {
    console.error("err", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.post("/updateTrustRating", jwtAuth, async (req, res) => {
  const user = req.user;
  const scholarUrl = req.user.scholarUrl;
  const scholarDetails = await getScholarDetails(scholarUrl);

  const hindex = scholarDetails.hindex;

  let trustRating = 0;

  if (hindex <= 0) {
    trustRating = 10;
  } else if (hindex > 0 && hindex < 3) {
    trustRating = 50;
  } else if (hindex >= 3 && hindex < 6) {
    trustRating = 60;
  } else if (hindex >= 6 && hindex < 10) {
    trustRating = 85;
  } else {
    trustRating = 100;
  }

  const bc = getBlockchain();

  const userContract = await bc.getUser(user.address);

  console.log(`Setting trust rating for ${user.address} to ${trustRating}`);
  console.log(userContract);
  await userContract.setTrustRating(trustRating);

  res.status(201).json({
    success: true,
    message: "Trust rating updated",
    trustRating,
  });
});

router.post("/login", async (req, res) => {
  const { address, signature } = req.body;
  const user = await User.findOne({ address });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  if (
    ethers.utils.verifyMessage(
      "Click sign below to authenticate with Peer Review :)",
      signature
    ) === address
  ) {
    const token = jwt.sign({ user }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    return res.status(201).json({ token });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid signature",
  });
});

router.get("/papers", jwtAuth, async (req, res) => {
  const papers = await PaperModel.find({
    user: req.user.address,
  });
  res.json(papers);
});

router.get("/scholar", jwtAuth, async (req, res) => {
  const scholarUrl = req.user.scholarUrl;
  const scholarDetails = await getScholarDetails(scholarUrl);

  res.json({
    success: true,
    scholarDetails,
  });
});

router.get("/:address", async (req, res) => {
  const { address } = req.params;
  const user = await User.findOne({ address });

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});

router.post("/dash", async (req, res) => {
  const clientOpts = {
    network: "testnet",
    wallet: {
      mnemonic: null, // this indicates that we want a new wallet to be generated
      // if you want to get a new address for an existing wallet
      // replace 'null' with an existing wallet mnemonic
      offlineMode: true, // this indicates we don't want to sync the chain
      // it can only be used when the mnemonic is set to 'null'
    },
  };

  const client = new Dash.Client(clientOpts);

  const createWallet = async () => {
    const account = await client.getWalletAccount();

    const mnemonic = client?.wallet?.exportWallet();
    const address = account.getUnusedAddress();
    console.log("Mnemonic:", mnemonic);
    console.log("Unused address:", address.address);
    res.json({ mnemonic, address: address.address });
  };

  createWallet()sa 
    .catch((e) => console.error("Something went wrong:\n", e))
    .finally(() => client.disconnect());

  // Handle wallet async errors
  client.on("error", (error, context) => {
    console.error(`Client error: ${error.name}`);
    console.error(context);
  });
});

export default router;
