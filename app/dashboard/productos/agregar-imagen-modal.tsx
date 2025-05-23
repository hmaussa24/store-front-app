import { useState } from "react";
import axios from "axios";

export function ModalAgregarImagen({ onImageAdded, productoId }: { onImageAdded: () => void; productoId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = (url: string): boolean => {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocolo
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // dominio
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // o dirección IP (v4)
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // puerto y ruta
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // cadena de consulta
      '(\\#[-a-z\\d_]*)?$', // fragmento
      'i'
    );
    return !!urlPattern.test(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!validateUrl(value)) {
      setError('Por favor, ingrese una URL válida.');
    } else {
      setError('');
    }
    setUrl(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/imagenes`, { url, productosId: productoId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onImageAdded();
      setIsOpen(false);
      setUrl("");
    } catch (err) {
      setError("Error al agregar la imagen. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
      >
        Agregar Imagen
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Agregar Imagen</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={url}
                  onChange={handleInputChange}
                  className="mt-1 block w-full text-gray-400 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm p-2"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                  disabled={false}
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