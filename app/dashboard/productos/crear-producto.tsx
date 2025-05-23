import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export function CrearProducto() {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    precioPublico: 0,
    precioProveedor: 0,
    descuento: 0,
    stock: 0,
    colorsId: 0,
    categoriasId: 0,
  });
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [colores, setColores] = useState<{ id: number; color: string; codigoColor: string }[]>([]);
  const [tallas, setTallas] = useState<{ id: number; talla: string }[]>([]);
  const [categorias, setCategorias] = useState<{ id: number; nombre: string; codigo: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColores = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get("http://localhost:3000/colors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setColores(response.data);
      } catch (error) {
        console.error("Error al obtener los colores:", error);
      }
    };

    fetchColores();
  }, []);

  useEffect(() => {
    const fetchTallas = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get("http://localhost:3000/tallas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTallas(response.data);
      } catch (error) {
        console.error("Error al obtener las tallas:", error);
      }
    };

    fetchTallas();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get("http://localhost:3000/categorias", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.codigo.trim()) {
      errors.codigo = "El código es obligatorio.";
    }
    if (!formData.descripcion.trim()) {
      errors.descripcion = "La descripción es obligatoria.";
    }
    if (formData.precioPublico <= 0) {
      errors.precioPublico = "El precio público debe ser mayor a 0.";
    }
    if (formData.precioProveedor <= 0) {
      errors.precioProveedor = "El precio del proveedor debe ser mayor a 0.";
    }
    if (formData.descuento < 0 || formData.descuento > 100) {
      errors.descuento = "El descuento debe estar entre 0 y 100.";
    }
    if (formData.stock < 0) {
      errors.stock = "El stock no puede ser negativo.";
    }
    if (formData.colorsId <= 0) {
      errors.colorsId = "El ID de color debe ser mayor a 0.";
    }
    if (formData.categoriasId <= 0) {
      errors.categoriasId = "El ID de categoría debe ser mayor a 0.";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("access_token");
    try {
      await axios.post("http://localhost:3000/productos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/listar-productos");
    } catch (err) {
      console.error("Error al crear el producto:", err);
      setError({ general: "Hubo un error al crear el producto. Por favor, inténtalo de nuevo." });
    }
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
      <div className="bg-white mt-22 p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Producto</h2>
        {Object.keys(error).length > 0 && (
          <div className="text-red-500 text-sm mb-4">
            {Object.values(error).map((errMsg, index) => (
              <p key={index}>{errMsg}</p>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Código</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm p-2"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="precioPublico" className="block text-sm font-medium text-gray-700">Precio Público</label>
              <input
                type="number"
                id="precioPublico"
                name="precioPublico"
                value={formData.precioPublico}
                onChange={handleChange}
                className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="precioProveedor" className="block text-sm font-medium text-gray-700">Precio Proveedor</label>
              <input
                type="number"
                id="precioProveedor"
                name="precioProveedor"
                value={formData.precioProveedor}
                onChange={handleChange}
                className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm p-2"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="descuento" className="block text-sm font-medium text-gray-700">Descuento</label>
              <input
                type="number"
                id="descuento"
                name="descuento"
                value={formData.descuento}
                onChange={handleChange}
                className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm p-2"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="colorsId" className="block text-sm font-medium text-gray-700">Color</label>
            <select
              id="colorsId"
              name="colorsId"
              value={formData.colorsId}
              onChange={handleChange}
              className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm p-2"
              required
            >
              <option value="">Seleccione un color</option>
              {colores.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.color} ({color.codigoColor})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="categoriasId" className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              id="categoriasId"
              name="categoriasId"
              value={formData.categoriasId}
              onChange={handleChange}
              className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm p-2"
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre} ({categoria.codigo})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Atrás
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}