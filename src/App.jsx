import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Learn from './pages/Learn';
import Lesson from './pages/lesson';
import Home from './pages/index';

const App = () => {
  return (
    <div>
      {/* <Navbar></Navbar> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/lesson" element={<Lesson />} />
      </Routes>
    </div>
  );
};

export default App;
