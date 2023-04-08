import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
// Routy
import Home from './core/home';
// Helpers
import Layout from './helpers/layout';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
