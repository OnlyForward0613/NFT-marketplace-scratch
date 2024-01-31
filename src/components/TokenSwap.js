import React, { useEffect, useState } from "react";
import Modal from "../atoms/Modal";

export default function TokenSwap() {
  const [isDisable, setIsDisable] = useState(true);
  let testData='';
  useEffect(() => {
    connect();
    testData='testData';
  }, []);
  function updateButton() {
    const ethereumButton = document.querySelector(".enableSwapButton");
    setIsDisable(false);
    ethereumButton.classList.remove("hover:bg-blue-200");
    ethereumButton.classList.remove("bg-blue-400");
    ethereumButton.classList.remove("cursor-not-allowed");
    ethereumButton.classList.add("hover:bg-green-700");
    ethereumButton.classList.add("bg-green-500");
  }
  async function connect() {
    /** MetaMask injects a global API into websites visited by its users at `window.ethereum`. This API allows websites to request users' Ethereum accounts, read data from blockchains the user is connected to, and suggest that the user sign messages and transactions. The presence of the provider object indicates an Ethereum user. Read more: https://ethereum.stackexchange.com/a/68294/85979**/

    // Check if MetaMask is installed, if it is, try connecting to an account
    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("connecting");
        // Requests that the user provides an Ethereum address to be identified by. The request causes a MetaMask popup to appear. Read more: https://docs.metamask.io/guide/rpc-api.html#eth-requestaccounts
        await window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then(() => {
            console.log("ethereum detected");
            updateButton();
          });
      } catch (error) {
        console.log(error);
      }
    }
    // Ask user to install MetaMask if it's not detected
    else {
      console.log("Please install MetaMask");
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ height: "70vh" }}>
      <Modal isOpen={isModalOpen} onClose={closeModal} children={testData}>
        <h1>Modal Content</h1>
        <button onClick={closeModal}>Close Modal</button>
      </Modal>
      <div className="max-w-2xl mx-auto py-6 mt-20 sm:px-6 lg:px-8 bg-black text-white rounded-2xl">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-2xl font-medium leading-6 p-2">Swap</h3>
            <div className="mt-5">
              <div className="grid grid-cols-1 gap-6">
                <div className="col-span-6 sm:col-span-3 bg-gray-700 p-5 rounded-lg border-solid border-2 border-gray-500">
                  <button
                    className="text-md font-medium text-white w-[30%]"
                    onClick={openModal}
                  >
                    SELECT A TOKEN
                  </button>
                  <input
                    type="text"
                    name="token1"
                    id="token1"
                    className="mt-1 mx-3 w-[60%] leading-9 text-black focus:ring-blue-500 focus:border-blue-500 shadow-sm border-gray-300 rounded-md"
                    placeholder="amount"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3 bg-gray-700 p-5 rounded-lg border-solid border-2 border-gray-500">
                  <button
                    htmlFor="token2"
                    className="text-md font-medium text-white w-[30%]"
                  >
                    SELECT A TOKEN
                  </button>
                  <input
                    type="text"
                    name="token2"
                    id="token2"
                    className="mt-1 mx-3 w-[60%] leading-9 focus:ring-blue-500 focus:border-blue-500 shadow-sm border-gray-300 rounded-md"
                    placeholder="amount"
                  />
                </div>
              </div>
              <div className="mt-6">
                <span className="text-lg text-white">
                  Estimated Gas: <span id="gas_estimate"></span>
                </span>
              </div>
              <button
                disabled={isDisable}
                className="enableSwapButton cursor-not-allowed mt-6 bg-blue-400 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded block w-full"
              >
                Swap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
