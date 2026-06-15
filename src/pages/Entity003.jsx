import { Link } from 'react-router-dom';

export default function Entity003() {
  return (
    <div className="flex flex-col mt-4">
      <Link to="/" className="text-gray-400 mb-6 underline text-lg">← Volver al inicio</Link>
      
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
        <span className="bg-yellow-500 text-gray-900 text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Estación 1
        </span>
        
        <h2 className="text-3xl font-bold mt-4 mb-2 text-white">Bienvenida al Recorrido</h2>
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          [Dato Mock] Te encuentras en la entrada principal. Desde aquí iniciaremos la exploración sensorial.
        </p>

        {/* Botones de acción temporales */}
        <button className="w-full bg-green-600 text-white font-bold py-4 rounded-xl text-xl mb-4">
          ▶ Reproducir Audio
        </button>
        
        <button className="w-full border-2 border-gray-500 text-gray-200 font-bold py-4 rounded-xl text-lg">
          Reportar barrera
        </button>
      </div>
    </div>
  );
}