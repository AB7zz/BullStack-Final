import React from 'react'
import Home from './Home';
import HomeDetails from './HomeDetails';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

  return (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/HomeDetails" element={<HomeDetails />} />
          </Routes>
          </>
  );
}

export default App;
