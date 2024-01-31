import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from "../Marketplace.json";
import { useLocation } from "react-router";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";

export default function ResellNFT() {
  let { state } = useLocation();
  const [image, setImage] = useState("");
  const [meta, setMeta] = useState({});

  useEffect(() => {
    getNFTData(state.tokenId);
  }, []);
  async function getNFTData(tokenId) {
    const ethers = require("ethers");
    let sumPrice = 0;

    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();

    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );

    const tokenURI = await contract.tokenURI(tokenId);
    console.log("tokenURI: ", tokenURI);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log("meataInfo: ", meta);
    setMeta(meta);
    setImage(meta.image);

    // let price = ethers.utils.formatUnits(i.price.toString(), "ether");
    // let item = {
    //   price,
    //   tokenId: i.tokenId.toNumber(),
    //   seller: i.seller,
    //   owner: i.owner,
    //   image: meta.image,
    //   name: meta.name,
    //   description: meta.description,
    // };
    // sumPrice += Number(price);
    // return item;

    // updateData(items);
    // updateFetched(true);
    // updateAddress(addr);
    // updateTotalPrice(sumPrice.toPrecision(3));
  }

  const ethers = require("ethers");
  const [message, updateMessage] = useState("");

  async function disableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = true;
    listButton.style.backgroundColor = "grey";
    listButton.style.opacity = 0.3;
  }

  async function enableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = false;
    listButton.style.backgroundColor = "#A500FF";
    listButton.style.opacity = 1;
  }

  async function listNFTForSale(e) {
    e.preventDefault();

    //Upload data to IPFS
    try {
      if (!meta.price) return;
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      disableButton();
      updateMessage(
        "Uploading NFT(takes 5 mins).. please dont click anything!"
      );

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer
      );

      //massage the params to be sent to the create NFT request
      const price = ethers.utils.parseUnits(meta.price, "ether");
      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();

      //actually create the NFT
      let transaction = await contract.resellToken(state.tokenId, price, {
        value: listingPrice,
      });
      await transaction.wait();

      alert("Successfully reselled your NFT!");
      enableButton();
      updateMessage("");
      setMeta({});
      window.location.replace("/");
    } catch (e) {
      alert("Upload error" + e);
    }
  }

  return (
    <div className="">
      {/* <Navbar></Navbar> */}
      <div className="flex flex-col place-items-center mt-10" id="nftForm">
        <form className="bg-white shadow-xl rounded px-8 pt-4 pb-8 mb-4">
          <h3 className="text-center font-bold text-purple-500 mb-8">
            Resell your NFT to the marketplace
          </h3>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="name"
            >
              NFT Name
            </label>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {meta.name}
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="description"
            >
              NFT Description
            </label>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {meta.description}
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price (in ETH)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Min 0.0000000000001 ETH"
              step="0.00000001"
              value={meta.price}
              onChange={(e) => {
                setMeta({ ...meta, price: e.target.value });
              }}
            ></input>
          </div>
          <div className="justify-center mx-auto">
            {image && <img className="rounded mt-4" width="350" src={image} />}
          </div>
          <br></br>
          <div className="text-red-500 text-center">{message}</div>
          <button
            onClick={(e) => listNFTForSale(e)}
            className="font-bold mt-0 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
            id="list-button"
          >
            List NFT
          </button>
        </form>
      </div>
    </div>
  );
}
