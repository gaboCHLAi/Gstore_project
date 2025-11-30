 
 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Apply from "./pages/Apply";
import Admin from "./pages/Admin";
import Authorization from "./components/Authorization";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply/:id" element={<Apply />} />
        <Route path="/admin/authorization" element={<Authorization />} />
        <Route path="/admin/applications" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
