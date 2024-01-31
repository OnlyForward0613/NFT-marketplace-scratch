import React, { useEffect, useState } from "react";
// import Modal from "../atoms/Modal";
import { Modal } from "antd";

export default function TokenSwap() {
  const [isDisable, setIsDisable] = useState(true);
  const [tokenList, setTokenList] = useState();
  const [tokenFirst, setTokenFirst] = useState("");
  const [tokenSecond, setTokenSecond] = useState("");
  const [isFirst, setIsFirst] = useState(false);
  const [isSecond, setIsSecond] = useState(false);
  const [visible, setVisible] = useState(false);

  const hideModal = () => {
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  async function getTokenList() {
    console.log("initializing");
    let response = await fetch("https://tokens.coingecko.com/uniswap/all.json");
    let tokenListJSON = await response.json();
    console.log("listing available tokens: ", tokenListJSON.tokens);
    setTokenList(tokenListJSON.tokens);
  }

  useEffect(() => {
    connect();
    getTokenList();
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

  return (
    <div style={{ height: "70vh" }}>
      <Modal
        title="Select a token"
        open={visible}
        onOk={hideModal}
        onCancel={hideModal}
        okText="Ok"
        cancelText="Cancel"
        okType="danger"
        width={"20vw"}
      >
        <div>
          {tokenList &&
            tokenList.map((token) => {
              return (
                <div
                  className="py-1 cursor-pointer"
                  onClick={() => {
                    if (isFirst) setTokenFirst(token);
                    if (isSecond) setTokenSecond(token);
                    hideModal();
                  }}
                  key={token.address}
                >
                  <img
                    src={token.logoURI}
                    key={token.decimals}
                    className="inline"
                  />
                  <span className="ml-3">{token.symbol}</span>
                </div>
              );
            })}
        </div>
      </Modal>
      <div className="max-w-2xl mx-auto py-6 mt-20 sm:px-6 lg:px-8 bg-black text-white rounded-2xl">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-2xl font-medium leading-6 p-2">Swap</h3>
            <div className="mt-5">
              <div className="grid grid-cols-1 gap-6">
                <div className="col-span-6 sm:col-span-3 bg-gray-700 p-5 rounded-lg border-solid border-2 border-gray-500">
                  {tokenFirst ? (
                    <div
                      className="cursor-pointer text-md font-medium text-white w-[30%] bg-transparent inline-block"
                      onClick={showModal}
                    >
                      <img
                        src={tokenFirst.logoURI}
                        key={tokenFirst.address}
                        className="inline ml-6"
                      />
                      <span className="ml-3">{tokenFirst.symbol}</span>
                    </div>
                  ) : (
                    <button
                      className="text-md font-medium text-white w-[30%]"
                      onClick={() => {
                        setIsFirst(true);
                        setIsSecond(false);
                        showModal();
                      }}
                    >
                      SELECT A TOKEN
                    </button>
                  )}
                  <input
                    type="text"
                    name="token1"
                    id="token1"
                    className="mt-1 mx-3 w-[60%] leading-9 text-black focus:ring-blue-500 focus:border-blue-500 shadow-sm border-gray-300 rounded-md"
                    placeholder="amount"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3 bg-gray-700 p-5 rounded-lg border-solid border-2 border-gray-500">
                  {tokenSecond ? (
                    <div
                      className="cursor-pointer text-md font-medium text-white w-[30%] bg-transparent inline-block"
                      onClick={showModal}
                    >
                      <img
                        src={tokenSecond.logoURI}
                        key={tokenSecond.address}
                        className="inline ml-6"
                      />
                      <span className="ml-3">{tokenSecond.symbol}</span>
                    </div>
                  ) : (
                    <button
                      className="text-md font-medium text-white w-[30%]"
                      onClick={() => {
                        setIsSecond(true);
                        setIsFirst(false);
                        showModal();
                      }}
                    >
                      SELECT A TOKEN
                    </button>
                  )}
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
