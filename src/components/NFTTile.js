import axie from "../tile.jpeg";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";
import MarketplaceJSON from "../Marketplace.json";

function NFTTile(data) {
  const [message, updateMessage] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  async function getAddress() {
    try {
      const ethers = require("ethers");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      console.log("walletAddress: ", addr);
      setWalletAddress(addr);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAddress();
  }, []);

  const newTo = {
    pathname: "/nftPage/" + data.data.tokenId,
  };
  const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);

  async function buyNFT(tokenId, price) {
    try {
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
      const salePrice = ethers.utils.parseUnits(price, "ether");
      updateMessage("Buying the NFT... Please Wait (Upto 5 mins)");
      //run the executeSale function
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();

      alert("You successfully bought the NFT!");
      updateMessage("");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  return (
    <div className="border-2 rounded-xl ml-12 mt-5 mb-12 flex flex-col items-center w-48 md:w-72 shadow-2xl overflow-hidden">
      <Link to={newTo}>
        <img src={IPFSUrl} alt="" className="w-72 h-80 object-cover" />
      </Link>
      <div className="text-white w-full bg-white">
        <div className="p-4">
          <p
            style={{ height: "40px" }}
            className="text-xl font-semibold text-black"
          >
            {data.data.name}
          </p>
          <div style={{ overflow: "hidden" }}>
            <p className="text-gray-400">{data.data.description}</p>
          </div>
        </div>
        <div className="p-1 bg-black">
          <p className="text-lg text-white">{data.data.price} ETH</p>
          {walletAddress === data.data.seller ||
          walletAddress === data.data.owner ? (
            <Link to={"/resellNFT"} state={{tokenId: data.data.tokenId}}>
              <button className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded">
                Resell
              </button>
            </Link>
          ) : (
            <button
              className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
              onClick={() => buyNFT(data.data.tokenId, data.data.price)}
            >
              Buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NFTTile;
