import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
// Routy - Obecné
import Home from './core/home';
// Routy - Pro přihlášené
import Profile from './core/profile';
import Management from './core/management';
// Routy - Přihlašování / Odhlašovánáí
import Login from './core/login';
import Signout from './helpers/signout';
// Helpers
import Layout from './helpers/layout';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* Pro přihlášené */}
            <Route path="profile" element={<Profile />}></Route>
            <Route path="management" element={<Management />}></Route>
            {/* Přihlašování / Odhlašovánáí */}
            <Route path="login" element={<Login />}></Route>
            <Route path="signout" element={<Signout />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
