import { useState } from "react";
import axios from "axios";

export function ModalAgregarColor({ onColorAdded, productoId }: { onColorAdded: () => void; productoId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("");
  const [codigoColor, setCodigoColor] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "color") {
      setColor(value);
    } else if (name === "codigoColor") {
      setCodigoColor(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!color || !codigoColor) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/colors`,
        { color, codigoColor, productoId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onColorAdded();
      setIsOpen(false);
      setColor("");
      setCodigoColor("");
    } catch (err) {
      setError("Error al agregar el color. Por favor, intente nuevamente.");
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Agregar Color
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Agregar Color</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">Nombre del Color</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={color}
                  onChange={handleInputChange}
                  className="mt-1 block w-full text-gray-800 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="codigoColor" className="block text-sm font-medium text-gray-700">Código del Color</label>
                <input
                  type="text"
                  id="codigoColor"
                  name="codigoColor"
                  value={codigoColor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full text-gray-800 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}