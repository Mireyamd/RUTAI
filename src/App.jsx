import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Entity001 from "./pages/Entity001";
import Entity002 from "./pages/Entity002";
import Entity003 from "./pages/Entity003";
import Manager from "./pages/Manager";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/e/001" element={<Entity001 />} />
        <Route path="/e/002" element={<Entity002 />} />
        <Route path="/e/003" element={<Entity003 />} />
        <Route path="/manager" element={<Manager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;