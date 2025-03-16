import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Learn from "./pages/Learn";
import Lesson from "./pages/lesson";
import Home from "./pages/index";
import LoginScreen from "./pages/LoginScreen";
import Register from "./pages/RegisterScreen";
import LanguageList from "./pages/languageList";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Leaderboards from "./pages/leaderboard";

const App = () => {
  return (
    <div>
      {/* <Navbar></Navbar> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<Register />} />
        <Route path="/languageList" element={<LanguageList />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboards />} />
      </Routes>
    </div>
  );
};

export default App;
