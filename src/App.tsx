import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import User from "./pages/user/User";
import Admin from "./pages/admin/Admin";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/admin/:id" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
