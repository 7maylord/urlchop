import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/navbar";
import Login from "./components/login";
import Register from "./components/register";
import ShortenUrl from "./components/shortenUrl";
import LinkHistory from "./components/linkHistory";
import Analytics from './components/analytics';
import NotFound from "./components/notFound";
import Footer from "./components/footer";

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
            <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}            
          </Routes>
        </div>
      </Router>
      <Footer />
    </AuthProvider>    
  );
};

export default App;
