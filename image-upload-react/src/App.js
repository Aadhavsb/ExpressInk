import React from "react";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Results from "./pages/Results";
import About from "./pages/About";
import Events from "./pages/Events";
import Login from "./pages/Login";

/*
import About from "./pages/about";
import SignUp from "./pages/signup";
import Contact from "./pages/contact";
*/

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/Results" element={<Results />} />
        <Route path="/About" element={<About />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        {/*<Route path="/contact" element={<Contact />} />
        <Route path="/sign-up" element={<SignUp />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
