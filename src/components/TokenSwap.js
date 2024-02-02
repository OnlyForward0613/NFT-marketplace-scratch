import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import qs from "qs";
import { erc20abi } from "../utils";
import { BigNumber } from "@0x/utils";
import Web3 from "web3";

export default function TokenSwap() {
  const [isDisable, setIsDisable] = useState(true);
  const [tokenList, setTokenList] = useState();
  const [tokenFirst, setTokenFirst] = useState("");
  const [tokenFirstAmount, setTokenFirstAmount] = useState(0);
  const [tokenSecond, setTokenSecond] = useState("");
  const [tokenSecondAmount, setTokenSecondAmount] = useState(0);
  const [estimatedGas, setEstimatedGas] = useState(0);
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

  async function getPrice() {
    if (!tokenFirst || !tokenSecond || !tokenFirstAmount)
      return console.log(
        "input token amount",
        tokenFirst,
        tokenSecond,
        tokenFirstAmount
      );
    let amount = tokenFirstAmount * 10 * tokenFirst.decimals;
    console.log("amount: ", amount);
    const params = {
      sellToken: tokenFirst.address,
      buyToken: tokenSecond.address,
      sellAmount: amount,
    };
    const headers = { "0x-api-key": "f317b10b-aafd-4e4b-b2db-3a1845c6bb3d" };
    const response = await fetch(
      `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`,
      { headers }
    );
    const swapPriceJSON = await response.json();
    console.log("Price: ", swapPriceJSON);
    // Use the returned values to populate the buy Amount and the estimated gas in the UI
    setTokenSecondAmount(swapPriceJSON.buyAmount / 10 ** tokenSecond.decimals);
    setEstimatedGas(swapPriceJSON.estimatedGas);
  }

  useEffect(() => {
    connect();
    getTokenList();
  }, []);

  useEffect(() => {
    getPrice();
  }, [tokenFirstAmount]);
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

  async function getQuote(account) {
    console.log("Getting Quote");

    if (!tokenFirst || !tokenSecond || !tokenFirstAmount) return;
    console.log("amount: ", tokenFirst, tokenSecond, tokenFirstAmount);
    let amount = tokenFirstAmount * 10 ** tokenFirst.decimals;
    const params = {
      sellToken: tokenFirst.address,
      buyToken: tokenSecond.address,
      sellAmount: amount,
      // Set takerAddress to account
      takerAddress: account,
    };

    const headers = { "0x-api-key": "f317b10b-aafd-4e4b-b2db-3a1845c6bb3d" };
    // Fetch the swap quote.
    const response = await fetch(
      `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
      { headers }
    )
      .then((data) => {
        console.log("response:", data);
      })
      .catch((err) => {
        console.log("quoteError: ", err);
      });

    const swapQuoteJSON = await response.json();
    console.log("QuoteResponse: ", swapQuoteJSON);

    setTokenSecondAmount(swapQuoteJSON.buyAmount / 10 ** tokenSecond.decimals);
    setEstimatedGas(swapQuoteJSON.estimatedGas);

    return swapQuoteJSON;
  }

  async function trySwap() {
    let accounts = await window.ethereum.request({ method: "eth_accounts" });
    let takerAddress = accounts[0];
    // Log the the most recently used address in our MetaMask wallet
    // Pass this as the account param into getQuote() we built out earlier. This will return a JSON object trade order.
    const swapQuoteJSON = await getQuote(takerAddress);

    // Set up approval amount for the token we want to trade from
    const fromTokenAddress = tokenSecond.address;

    // In order for us to interact with a ERC20 contract's method's, need to create a web3 object. This web3.eth.Contract object needs a erc20abi which we can get from any erc20 abi as well as the specific token address we are interested in interacting with, in this case, it's the fromTokenAddrss
    // Read More: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#web3-eth-contract
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const web3 = new Web3(Web3.givenProvider);

    const ERC20TokenContract = new web3.eth.Contract(
      erc20abi,
      fromTokenAddress
    );
    console.log("setup ERC20TokenContract: ", ERC20TokenContract);
    // The max approval is set here. Using Bignumber to handle large numbers and account for overflow (https://github.com/MikeMcl/bignumber.js/)
    const maxApproval = new BigNumber(2).pow(256).minus(1);
    console.log("approval amount: ", maxApproval);

    // Grant the allowance target (the 0x Exchange Proxy) an  allowance to spend our tokens. Note that this is a txn that incurs fees.
    const tx = await ERC20TokenContract.methods
      .approve(swapQuoteJSON.allowanceTarget, maxApproval)
      .send({ from: takerAddress })
      .then((tx) => {
        console.log("tx: ", tx);
      });
    const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
    console.log("receipt: ", receipt);
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
                    className="mt-1 p-1 mx-3 w-[60%] leading-9 text-black focus:ring-blue-500 focus:border-blue-500 shadow-sm border-gray-300 rounded-md"
                    placeholder="amount"
                    onChange={(e) => setTokenFirstAmount(e.target.value)}
                    value={tokenFirstAmount}
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
                    className="mt-1 mx-3 p-1 w-[60%] text-black leading-9 focus:ring-blue-500 focus:border-blue-500 shadow-sm border-gray-300 rounded-md"
                    placeholder="amount"
                    value={tokenSecondAmount}
                    readOnly
                  />
                </div>
              </div>
              <div className="mt-6">
                <span className="text-lg text-white">
                  Estimated Gas: <span id="gas_estimate">{estimatedGas}</span>
                </span>
              </div>
              <button
                disabled={isDisable}
                className="enableSwapButton cursor-not-allowed mt-6 bg-blue-400 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded block w-full"
                onClick={() => trySwap()}
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
