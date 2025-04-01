import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Profile from "./components/Auth/Profile";
import Dashboard from './components/Auth/Dashboard';
function App() {
  return (
    <Router>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
