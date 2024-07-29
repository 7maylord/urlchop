import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ShortenUrl from "./components/ShortenUrl";
import LinkHistory from "./components/LinkHistory";
import Analytics from "./components/Analytics";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div  className="bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<ShortenUrl />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shorten" element={<ShortenUrl />} />
            <Route path="/link-history" element={<LinkHistory />} />
            <Route path="/analytics/:urlId" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />            
          </Routes>
        </div>
      </Router>
      <Footer />
    </AuthProvider>    
  );
};

export default App;
