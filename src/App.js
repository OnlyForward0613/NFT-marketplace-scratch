import "./App.css";
import Navbar from "./components/Navbar.js";
import Marketplace from "./components/Marketplace";
import Profile from "./components/Profile";
import SellNFT from "./components/SellNFT";
import NFTPage from "./components/NFTpage";
import Dashboard from "./components/Dashboard";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route path="/nftPage" element={<NFTPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sellNFT" element={<SellNFT />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
