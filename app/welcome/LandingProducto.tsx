import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatearPrecioEnCOP } from '~/utils/utils';
import { Spinner } from '~/components/Spinner';

// Interfaces para representar la entidad Producto y sus relaciones
interface Color {
  id: number;
  color: string;
  codigoColor: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Imagen {
  id: number;
  url: string;
}

interface Talla {
  id: number;
  talla: string;
}

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precioPublico: number;
  precioProveedor: number;
  descuento: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  colors: Color[];
  categorias: Categoria;
  tallas: Talla[];
  imagenes: Imagen[];
}

export function LandingProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [talla, setTalla] = useState<number | undefined>();
  const [imagenPrincipal, setImagenPrincipal] = useState<string | null>(null);
  const [errorTalla, setErrorTalla] = useState("");

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/productos/${id}`);
        setProducto(response.data);
        setImagenPrincipal(response.data.imagenes[0].url);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    fetchProducto();
  }, []);

  const handleMiniaturaClick = (imagen: string) => {
    setImagenPrincipal(imagen);
  };

  const handleCompra = () => {
    if (!talla) {
      setErrorTalla("Por favor selecciona una talla antes de continuar.");
      return;
    }
    setErrorTalla("");
    navigate(`/checkout/${id}/${talla}`);
  };

  if (!producto) {
    return <Spinner />;
  }

  return (
    <div className="font-sans text-gray-800 relative bg-white">
      <header className="bg-black py-4 shadow-md fixed top-0 w-full z-50">
        <div className="container mx-auto text-center cursor-pointer" onClick={() => navigate(`/home/${id}`)}>
          <h1 className="text-white text-xl font-bold inline-block px-4 py-2 border-2 border-white rounded-lg">
            MEROK
          </h1>
        </div>
      </header>
      <div className="pt-16">
        {/* Galería */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="space-y-4 relative">
            <img
              src={imagenPrincipal || ''}
              alt="Principal"
              className="w-full h-auto max-h-[600px] object-contain rounded-xl shadow"
            />
            <div className="absolute top-4 right-4 bg-black text-white text-sm font-bold px-3 py-1 rounded">
              {producto.descuento}% OFF
            </div>
            <div className="grid grid-cols-5 gap-4">
              {producto.imagenes.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={`Mini ${img.id}`}
                  className="w-full h-24 object-contain rounded-md hover:scale-105 transition"
                  onClick={() => handleMiniaturaClick(img.url)}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <h1 className="text-3xl font-bold">{producto.nombre}</h1>
            <p className="text-gray-600 text-justify">{producto.descripcion}</p>
            <p className="text-2xl font-bold text-black">
              {formatearPrecioEnCOP(producto.precioPublico)}
            </p>
            <div className="flex flex-col text-sm">
              <p className="line-through text-gray-500">
                {formatearPrecioEnCOP(producto.precioPublico + (producto.precioPublico * producto.descuento) / 100)}
              </p>
              <p className="text-green-500">{producto.descuento}%</p>
            </div>
            <div className="mb-4">
              <label htmlFor="talla" className="block text-sm font-medium text-gray-700">Selecciona tu talla:</label>
              <select required onChange={(e) => setTalla(Number(e.target.value))} id="talla" name="talla" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-black focus:border-gray-300 sm:text-sm rounded-md">
                <option value="" disabled selected>Selecciona una talla</option>
                {producto.tallas.map((talla) => (
                  <option key={talla.id} value={talla.id}>
                    {talla.talla}
                  </option>
                ))}
              </select>
              {errorTalla && <p className="text-red-500 text-sm mt-1">{errorTalla}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">Selecciona tu color:</label>
              <div className="flex items-center mt-1">
                <select id="color" name="color" className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-black focus:border-gray-300 sm:text-sm rounded-md" onChange={(e) => {
                  const colorBox = document.getElementById('color-box');
                  if (colorBox) colorBox.style.backgroundColor = e.target.value;
                }}>
                  {producto.colors.map((color) => (
                    <option key={color.id} value={color.codigoColor}>
                      {color.color}
                    </option>
                  ))}
                </select>
                <div id="color-box" className="w-8 h-8 ml-4 rounded" style={{ backgroundColor: producto.colors.codigoColor }}></div>
              </div>
            </div>
            <button
              onClick={handleCompra}
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
            >
              Comprar ahora
            </button>
            <button className="bg-green-500 text-white px-6 py-3 font-semibold rounded-full hover:bg-green-600 transition ml-4" style={{ fontFamily: 'Arial, sans-serif' }} onClick={() => window.open('https://wa.me/1234567890', '_blank')}>Escríbenos</button>
            <div className="flex justify-center mb-4 mt-5">
              <img src="/envio.jpg" alt="Envíos a todo el país" className="w-42 h-auto rounded" />
              <img src="/logo-wompi.svg" alt="Logo Wompi" className="w-16 h-16" />
            </div>
          </div>
        </section>

        {/* Reseñas */}
        <section className="px-8 pb-12">
          <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                usuario: 'Juan Castellanos',
                texto: 'Excelente producto, superó mis expectativas.',
                estrellas: 5,
              },
              {
                usuario: 'María Gómez',
                texto: 'Buena calidad, y buena atencion.',
                estrellas: 4,
              },
              {
                usuario: 'Carlos López',
                texto: 'El producto es bueno, y cumple con lo prometido.',
                estrellas: 4,
              },
              {
                usuario: 'Ana Martínez',
                texto: 'Me encantó, lo recomiendo totalmente.',
                estrellas: 5,
              },
              {
                usuario: 'Luis Fernández',
                texto: 'Cumple con lo prometido, buena relación calidad-precio.',
                estrellas: 4,
              },
            ].map((resena, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                  <span className="font-semibold">{resena.usuario}</span>
                </div>
                <p className="text-gray-700 mb-2">{resena.texto}</p>
                <div className="text-yellow-400 text-lg">
                  {'★'.repeat(resena.estrellas)}{'☆'.repeat(5 - resena.estrellas)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer con redes */}
        <footer className="bg-black text-white text-center py-6">
          <p>&copy; 2025 CIVICO. Todos los derechos reservados.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:underline">Instagram</a>
            <a href="#" className="hover:underline">TikTok</a>
            <a href="#" className="hover:underline">Política de privacidad</a>
          </div>
        </footer>

        {/* Botón flotante de WhatsApp */}
        <a
          href="https://wa.me/573001112233"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-10 right-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 48 48">
            <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6	C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path><path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"></path><path fill="#cfd8dc" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3	L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"></path><path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8	l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path><path fill="#fff" fill-rule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0	s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3	c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9	c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8	c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clip-rule="evenodd"></path>
          </svg>
        </a>
      </div>
    </div>
  );
}