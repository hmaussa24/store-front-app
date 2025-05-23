import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export function ListaProductos() {
  interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    precioPublico: number;
    descuento: number;
    createdAt: string;
    tallas:{
            talla: string;
        };
    categorias:{
            nombre: string;
        };
    colors:{
            color: string;
            codigoColor: string;
        };
  }

  const [productos, setProductos] = useState<Producto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/productos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const handleCrearProducto = () => {
    navigate("/crear-producto");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <header className="bg-black py-4 shadow-md fixed top-0 w-full  cursor-pointer">
        <div className="container mx-auto text-center" onClick={() => navigate('/') }>
          <h1 className="text-white text-xl font-bold inline-block px-4 py-2 border-2 border-white rounded-lg">
            CIVICO
          </h1>
        </div>
      </header>
      <div className="min-h-screen bg-gray-100 px-4 py-25">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Lista de Productos</h1>
          <div className="flex justify-end mb-6">
            <button
              onClick={handleCrearProducto}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
            >
              Crear Producto
            </button>
            <button
              onClick={() => navigate('/compras')}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition ml-4"
            >
              Ir a Compras
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 border-b text-left font-semibold text-gray-700">Código</th>
                  <th className="py-3 px-6 border-b text-left font-semibold text-gray-700">Nombre</th>
                  <th className="py-3 px-6 border-b text-left font-semibold text-gray-700">Descripción</th>
                  <th className="py-3 px-6 border-b text-left font-semibold text-gray-700">Talla</th>
                  <th className="py-3 px-6 border-b text-left font-semibold text-gray-700">Color</th>
                  <th className="py-3 px-6 border-b text-left font-semibold text-gray-700">Categoria</th>
                  <th className="py-3 px-6 border-b text-left font-semibold text-gray-700">Precio Público</th>
                  <th className="py-3 px-6 border-b text-left font-semibold text-gray-700">Descuento</th>
                  <th className="py-3 px-6 border-b text-left font-semibold text-gray-700">Fecha de Creación</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id} className="cursor-pointer hover:bg-gray-100" onClick={() => navigate(`/ver-producto/${producto.id}`)}>
                    <td className="py-3 px-6 border-b text-gray-800">{producto.codigo}</td>
                    <td className="py-3 px-6 border-b text-gray-800">{producto.nombre}</td>
                    <td className="py-3 px-6 border-b text-gray-800 truncate max-w-xs">{producto.descripcion} </td>
                    <td className="py-3 px-6 border-b text-gray-800"> Talla {producto.tallas.talla}</td>
                    <td className="py-3 px-6 border-b text-gray-800"> {producto.colors.color}</td>
                    <td className="py-3 px-6 border-b text-gray-800">{producto.categorias.nombre}</td>
                    <td className="py-3 px-6 border-b text-gray-800">${producto.precioPublico}</td>
                    <td className="py-3 px-6 border-b text-gray-800">{producto.descuento}%</td>
                    <td className="py-3 px-6 border-b text-gray-800">{new Date(producto.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}