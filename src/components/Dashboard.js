/* pages/dashboard.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import MarketplaceJSON from "../Marketplace.json";
import { Spin } from "antd";

export default function Dashboard() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );

    const data = await contract.fetchItemsListed();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        };
        return item;
      })
    );

    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "not-loaded")
    return (
      <div style={{ height: "100vh", overflow: "hidden" }}>
        <div className="flex flex-col place-items-center mt-40">
          <Spin tip="Loading..." size="large">
            <div className="content" />
          </Spin>
        </div>
      </div>
    );

  if (loadingState === "loaded" && !nfts.length)
    return (
      <div style={{ height: "100vh", overflow: "hidden" }}>
        <div className="flex flex-col place-items-center mt-40">
          <div className="mt-10 md:text-xl lg:text-3xl font-bold text-white">
            No NFTs listed
          </div>
        </div>
      </div>
    );

  if (nfts.length)
    return (
      <div>
        <div className="p-4">
          <h2 className="text-2xl py-2 text-center">
            {nfts.length}&nbsp;Items Listed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 pt-4">
            {nfts.map((nft, i) => (
              <div
                key={i}
                className="border justify-between place-items-center shadow rounded-xl overflow-hidden"
              >
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">
                    Price - {nft.price} Eth
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
