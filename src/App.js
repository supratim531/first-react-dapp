import { contractABI, contractAddress } from "./utils";
import { ethers } from "ethers";
import './App.css';
import MainApp from "./MainApp";

function App() {
  const provider = new ethers.BrowserProvider(window.ethereum);

  const test1 = async () => {
    try {
      const res = await provider.send("eth_requestAccounts");
      console.log("res:", res);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const test2 = async () => {
    try {
      const res = await provider.getSigner();
      console.log("res:", res);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const test3 = async () => {
    try {
      const res = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, res);
      const name = await contract.name();
      console.log("name:", name);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const test4 = async () => {
    try {
      const signer = await provider.getSigner();
      console.log("signer:", signer);
    } catch (err) {
      console.log("err:", err);
    }
  }

  return (
    <div className="App">
      <MainApp />
    </div>
  );
}

export default App;
