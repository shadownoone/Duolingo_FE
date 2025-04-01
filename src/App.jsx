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
import { useEffect } from "react";
import { getCurrentUser } from "./services/Users/userService";
import { useDispatch } from "react-redux";
import { addCurrentUser } from "./features/user/userSlice";
import NotFound from "./pages/notFound";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();

      console.log(currentUser);

      dispatch(addCurrentUser(currentUser.data));
    };

    fetchUser();
  }, []);

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
        <Route path="/notfound" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
