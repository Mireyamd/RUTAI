import { Link } from 'react-router-dom';

export default function Home() {
  // Clases de Tailwind para botones accesibles: grandes, con buen área de toque
  const buttonStyle = "block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 px-4 rounded-xl text-center text-lg mb-4 shadow-lg active:scale-95 transition-transform";

  return (
    <div className="flex flex-col justify-center min-h-[80vh]">
      <h1 className="text-4xl font-extrabold text-yellow-400 text-center mb-8 tracking-tight">RUTAI</h1>
      
      <nav>
        <Link to="/e/001" className={buttonStyle}>
          Estación 001: Bienvenida
        </Link>
        <Link to="/e/002" className={buttonStyle}>
          Estación 002: Sensorial
        </Link>
        <Link to="/e/003" className={buttonStyle}>
          Estación 003: Cierre
        </Link>
        
        <hr className="border-gray-700 my-6" />
        
        <Link to="/manager" className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded-xl text-center text-md">
          Panel Gestor
        </Link>
      </nav>
    </div>
  );
}