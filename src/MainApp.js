import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { contractABI, contractAddress } from "./utils";

function MainApp() {
  const { ethereum } = window;
  const [fund, setFund] = useState(0);
  const [name, setName] = useState('');
  const [number, setNumber] = useState(0);
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [contractSigner, setContractSigner] = useState(null);
  const [contractProvider, setContractProvider] = useState(null);

  const fetchFund = async () => {
    try {
      const res = await contractProvider.getContractBalance();
      console.log("res:", res);
      const fund = ethers.formatEther(res);
      setFund(fund);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const fetchName = async () => {
    try {
      const res = await contractProvider.name();
      console.log("res:", res);
      setName(res);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const fetchNumber = async () => {
    try {
      const res = await contractProvider.getNumber();
      console.log("res:", res);
      setNumber(parseInt(res));
    } catch (err) {
      console.log("err:", err);
    }
  }

  const updateNumberByOne = async () => {
    try {
      const receipt = await contractSigner.setNumber(number + 1);
      const res = await receipt.wait();
      console.log("res:", res);
      fetchNumber();
      manageWallet(walletAddress);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const sendEtherToContract = async () => {
    try {
      const receipt = await contractSigner.sendEtherToContract({
        value: ethers.parseEther("0.0000001")
      });
      console.log("receipt:", receipt);
      const res = await receipt.wait();
      console.log("res:", res);
      fetchFund();
      manageWallet(walletAddress);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const manageWallet = async walletAddress => {
    try {
      const res = await ethereum.request({
        method: "eth_getBalance",
        params: [walletAddress, "latest"]
      });
      console.log("res:", res);
      const balanceInEther = ethers.formatEther(res);
      setWalletAddress(walletAddress);
      setWalletBalance(balanceInEther);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const connectMetaMask = async () => {
    if (ethereum) {
      try {
        const res = await ethereum.request({ method: "eth_requestAccounts" });
        console.log("res:", res);
        const walletAddress = res[0];
        manageWallet(walletAddress);
        const signer = await provider.getSigner();
        console.log("signer:", signer);
        setContractSigner(new ethers.Contract(contractAddress, contractABI, signer));
      } catch (err) {
        console.log("err:", err);
      }
    } else {
      alert("Install MetaMask first");
    }
  }

  useEffect(() => {
    if (ethereum) {
      console.log(ethereum);
      const provider = new ethers.BrowserProvider(ethereum);
      setProvider(provider);
      setContractProvider(new ethers.Contract(contractAddress, contractABI, provider));
    } else {
      alert("To use this application install MetaMask first");
    }
  }, []);

  useEffect(() => {
    fetchFund();
    fetchName();
    fetchNumber();
  }, [contractProvider]);

  return (
    <div>
      <h1>Conclusion Application</h1>
      {
        walletAddress ?
          <div>
            <h3>Wallet Address: {walletAddress}</h3>
            <h3>Wallet Balance: {walletBalance} ETH</h3>
          </div> :
          <button onClick={connectMetaMask}>Connect MetaMask</button>
      }
      <hr />
      {
        <div>
          <h2>Total Fund: {fund} ETH</h2>
          <div><b>Name: {name}</b></div>
          <div><b>Number: {number}</b></div>
          {
            walletAddress &&
            <button onClick={updateNumberByOne}>Update number by 1</button>
          }
          <br />
          {
            walletAddress &&
            <button onClick={sendEtherToContract}>Send 0.0000001 ETH to Contract</button>
          }
        </div>
      }
    </div>
  );
}

export default MainApp;
