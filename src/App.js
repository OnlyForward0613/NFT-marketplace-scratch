import "./App.css";
import Navbar from "./components/Navbar.js";
import Marketplace from "./components/Marketplace";
import Profile from "./components/Profile";
import SellNFT from "./components/SellNFT";
import NFTPage from "./components/NFTpage";
import Dashboard from "./components/Dashboard";
import ResellNFT from "./components/ResellNFT.js";
import TokenSwap from "./components/TokenSwap.js";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sellNFT" element={<SellNFT />} />
          <Route path="/nftPage/:tokenId" element={<NFTPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resellNFT" element={<ResellNFT />} />
          <Route path="/tokenswap" element={<TokenSwap />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
