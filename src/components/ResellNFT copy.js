/* pages/resell-nft.js */
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Marketplace from "../Marketplace.json";

export default function ResellNFT(props) {
  // const [formInput, updateFormInput] = useState({ price: '', image: '' })
  // // const { id, tokenURI } = router.query
  // const { image, price } = formInput

  // useEffect(() => {
  //   fetchNFT()
  // }, [id])

  // async function fetchNFT() {
  //   if (!tokenURI) return
  //   const meta = await axios.get(tokenURI)
  //   updateFormInput(state => ({ ...state, image: meta.data.image }))
  // }

  // async function listNFTForSale() {
  //   if (!price) return
  //   const web3Modal = new Web3Modal()
  //   const connection = await web3Modal.connect()
  //   const provider = new ethers.providers.Web3Provider(connection)
  //   const signer = provider.getSigner()

  //   const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
  //   let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
  //   let listingPrice = await contract.getListPrice()

  //   listingPrice = listingPrice.toString()
  //   let transaction = await contract.resellToken(id, priceFormatted, { value: listingPrice })
  //   await transaction.wait()

  //   window.location.replace("/");
  // }

  // return (
    // <div className="flex justify-center">
    //   <div className="w-1/2 flex flex-col pb-12">
    //     <input
    //       placeholder="Asset Price in Eth"
    //       className="mt-2 border rounded p-4"
    //       onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
    //     />
    //     {
    //       image && (
    //         <img className="rounded mt-4" width="350" src={image} />
    //       )
    //     }
    //     <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
    //       List NFT
    //     </button>
    //   </div>
    // </div>
  // )
  return (
    <h1>{props}</h1>
  )
}