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
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen flex-col bg-paper">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<ShortenUrl />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shorten" element={<ShortenUrl />} />
              <Route element={<PrivateRoute />}>
                <Route path="/link-history" element={<LinkHistory />} />
                <Route path="/analytics/:urlId" element={<Analytics />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
