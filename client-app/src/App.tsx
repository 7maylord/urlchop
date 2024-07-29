import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./component/Login";
import Register from "./component/Register";
import ShortenUrl from "./component/ShortenUrl";
import LinkHistory from "./component/LinkHistory";
import Analytics from "./component/Analytics";
import NotFound from "./component/NotFound";
import Footer from "./component/Footer";
import Navbar from "./component/Navbar";

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
