import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Entity001 from './pages/Entity001';
import Entity002 from './pages/Entity002';
import Entity003 from './pages/Entity003';
import Manager from './pages/Manager';

export default function App() {
  return (
    // Layout mobile-first: fondo muy oscuro, texto claro, ocupa toda la pantalla
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4">
      <div className="max-w-md mx-auto">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/e/001" element={<Entity001 />} />
            <Route path="/e/002" element={<Entity002 />} />
            <Route path="/e/003" element={<Entity003 />} />
            <Route path="/manager" element={<Manager />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}