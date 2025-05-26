import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { ModalAgregarImagen } from "./agregar-imagen-modal";
import { ModalAgregarTalla } from "./modal-agregar-talla";
import { ModalAgregarColor } from "./modal-agregar-color";

export function VerProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  interface Producto {
    codigo: string;
    nombre: string;
    descripcion: string;
    precioPublico: number;
    precioProveedor: number;
    descuento: number;
    stock: number;
    colors?: { color: string }[];
    categorias?: { nombre: string };
    tallas?: { talla: string }[];
    imagenes?: { url: string }[];
  }

  const [producto, setProducto] = useState<Producto | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageClick = (url: string) => {
    setPreviewImage(url);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  useEffect(() => {
    const fetchProducto = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/productos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducto(response.data);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProducto();
  }, [id]);

  const handleImageAdded = () => {
    // Refrescar las miniaturas después de agregar una imagen
    const fetchProducto = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/productos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducto(response.data);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProducto();
  };

  if (!producto) {
    return <div className="text-center mt-10">Cargando producto...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Detalles del Producto</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700">Código:</h2>
            <p className="text-gray-800">{producto.codigo}</p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700">Nombre:</h2>
            <p className="text-gray-800">{producto.nombre}</p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700">Descripción:</h2>
            <p className="text-gray-800">{producto.descripcion}</p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700">Precio Público:</h2>
            <p className="text-gray-800">${producto.precioPublico}</p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700">Precio Proveedor:</h2>
            <p className="text-gray-800">${producto.precioProveedor}</p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700">Descuento:</h2>
            <p className="text-gray-800">{producto.descuento}%</p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700">Stock:</h2>
            <p className="text-gray-800">{producto.stock}</p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700">Color:</h2>
            <p className="text-gray-800">{producto.colors?.map(colorObj => colorObj.color).join(", ")}</p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700">Categoría:</h2>
            <p className="text-gray-800">{producto.categorias?.nombre}</p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700">Tallas:</h2>
            <p className="text-gray-800">{producto.tallas?.map(talla => talla.talla).join(", ")}</p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Imágenes:</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {producto.imagenes?.map((imagen, index) => (
              <img
                key={index}
                src={imagen.url}
                alt={`Imagen ${index + 1}`}
                className="h-40 w-20 rounded-md shadow-md cursor-pointer object-cover"
                onClick={() => handleImageClick(imagen.url)}
              />
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            {
            id && <ModalAgregarImagen onImageAdded={handleImageAdded} productoId={id} />
            }
            {
            id && <ModalAgregarTalla onTallaAdded={handleImageAdded} productoId={id} />
            }
            {
            id && <ModalAgregarColor onColorAdded={handleImageAdded} productoId={id} />
            }
          </div>
        </div>
        {previewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-screen rounded-md"
              />
              <button
                onClick={closePreview}
                className="absolute top-2 right-2 bg-white text-black rounded-full p-2 shadow-md hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate(-1)}
            className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}