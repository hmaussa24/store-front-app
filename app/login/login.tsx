import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("access_token", response.data.access_token);
      navigate('/compras'); // Aquí puedes manejar la redirección o mostrar un mensaje de éxito
    } catch (err) {
      console.error("Error en el login:", err);
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <header className="bg-black py-4 shadow-md fixed top-0 w-full z-50 cursor-pointer">
      <div className="container mx-auto text-center" onClick={() => navigate('/') }>
        <h1 className="text-white text-xl font-bold inline-block px-4 py-2 border-2 border-white rounded-lg">
          CIVICO
        </h1>
      </div>
    </header>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-gray-400  sm:text-lg p-3 text-gray-800"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-gray-400  sm:text-lg p-3 text-gray-800"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}