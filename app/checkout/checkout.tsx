import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import colombiaData from "../../public/colombia.min.json";
import axios from 'axios';
import { formatearPrecioEnCOP } from "~/utils/utils";
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { Spinner } from "~/components/Spinner";

const departamentos = colombiaData.map((d) => d.departamento);

const departamentosCiudades = colombiaData.reduce((acc, d) => {
  acc[d.departamento] = d.ciudades;
  return acc;
}, {} as Record<string, string[]>);
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
  colors: Color;
  categorias: Categoria;
  tallas: Talla[];
  imagenes: Imagen[];
}

const validationSchema = Yup.object().shape({
  cedula: Yup.string()
    .matches(/^[0-9]+$/, 'La cédula debe contener solo números.')
    .required('La cédula es obligatoria.'),
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .required('El nombre es obligatorio.'),
  telefono: Yup.string()
    .matches(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos.')
    .required('El teléfono es obligatorio.'),
  departamento: Yup.string().required('El departamento es obligatorio.'),
  ciudad: Yup.string().required('La ciudad es obligatoria.'),
  correo: Yup.string()
    .email('El correo electrónico no es válido.')
    .required('El correo electrónico es obligatorio.'),
  direccion: Yup.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres.')
    .required('La dirección es obligatoria.'),
});

export function Checkout() {
  const formRef = useRef(null);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [tallaString, setTalla] = useState<Talla | undefined>();
  const [colorObj, setColor] = useState<Color | undefined>();
  const [numeroFactura, setNumeroFactura] = useState<string>(uuidv4());
  const { id, talla, color } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cedula: "",
    nombre: "",
    telefono: "",
    departamento: "" as keyof typeof departamentosCiudades,
    ciudad: "",
    correo: "",
    direccion: ""
  });
  const [errores, setErrores] = useState({
    cedula: "",
    nombre: "",
    telefono: "",
    departamento: "",
    ciudad: "",
    correo: "",
    direccion: ""
  });
  const [imagenPrincipal, setImagenPrincipal] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [wompiData, setWompiData] = useState<{ publicKey: string; integrityHash: string }>({
    publicKey: "",
    integrityHash: ""
  });
  const [redirect, setRedirect] = useState<string>('');
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleGuardarCompra = async (e: React.FormEvent, metodo: string) => {
    e.preventDefault();

    try {
      await validationSchema.validate(form, { abortEarly: false });

      const data = {
        client: {
          cedula: form.cedula,
          nombre: form.nombre,
          email: form.correo,
          telefono: form.telefono,
          direccion: form.direccion,
          departamento: form.departamento,
          ciudad: form.ciudad,
        },
        compra: {
          referencia: numeroFactura,
          cantidad: cantidad,
          estado: "Pendiente",
          descuento: producto?.descuento,
          productoId: producto?.id,
          tallaId: tallaString?.id,
          colorId: colorObj?.id,
          metodoPago: metodo,
          direccion: form.direccion,
          departamento: form.departamento,
          ciudad: form.ciudad,
        },
      };

      try {
      const response =  await axios.post(`${import.meta.env.VITE_API_BASE_URL}/compras/with-client`, data);
      console.log('Compra guardada:', response.data);
      setRedirect(`http://localhost:5173/transferencia/${id}/${response.data.id}`) // Updated to use template literals
        if (metodo === "transferencia") {
          const wompiForm = document.getElementById('wompi-form') as HTMLFormElement;
          if (wompiForm) {
            wompiForm.submit();
          }
        } else {
          navigate(`/contraentrega`);
        }
      } catch (error) {
        alert('Hubo un error al guardar la compra');
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const nuevosErrores = error.inner.reduce((acc: typeof errores, curr) => {
          if (curr.path) {
            acc[curr.path as keyof typeof errores] = curr.message;
          }
          return acc;
        }, { ...errores });
        setErrores(nuevosErrores);
      } else {
        console.error('Error al guardar la compra:', error);
        alert('Hubo un error al guardar la compra');
      }
    }
  };

  const processWompiPayment = async (referencia: string, monto: number) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/wompi/process-payment`, {
        referencia,
        monto,
      });
      setWompiData(response.data);
      console.log('Datos de Wompi procesados:', response.data);
    } catch (error) {
      console.error('Error al procesar el pago con Wompi:', error);
      alert('Hubo un error al procesar el pago con Wompi');
    }
  };

  const ciudades = form.departamento
    ? colombiaData.find((d) => d.departamento === form.departamento)?.ciudades || []
    : [];

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
  }, [id]);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tallas/${talla}`);
        setTalla(response.data);
      } catch (error) {
        console.error('Error al obtener la talla:', error);
      }
    };

    fetchProducto();
  }, [talla]);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/colors/${color}`);
        setColor(response.data);
      } catch (error) {
        console.error('Error al obtener el color:', error);
      }
    };

    fetchProducto();
  }, [color]);

  useEffect(() => {
    if (numeroFactura && producto) {
      const monto = producto.precioPublico * cantidad;
      processWompiPayment(numeroFactura, monto);
    }
  }, [numeroFactura, producto, cantidad]);

  const handleContraEntrega = async () => {
    setMostrarModal(true);
  };

  const confirmarContraEntrega = async (e: React.FormEvent) => {
    setMostrarModal(false);
    await handleGuardarCompra(e, 'contraentrega'); // Ejecuta la función handleGuardarCompra
  };

  if (!producto) {
    return <Spinner />;
  }

  return (
    <div className="font-sans text-gray-800 relative bg-white">
      <header className="bg-black py-4 shadow-md fixed top-0 w-full z-50 cursor-pointer">
        <div className="container mx-auto text-center" onClick={() => navigate(`/home/${id}`)}>
          <h1 className="text-white text-xl font-bold inline-block px-4 py-2 border-2 border-white rounded-lg">
            MEROK
          </h1>
        </div>
      </header>
      <div className="pt-16">
        <div className="max-w-7xl mx-auto p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">DETALLES DE LA COMPRA</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-500">Cédula</label>
                <input name="cedula" value={form.cedula} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-gray-600" />
                {errores.cedula && <p className="text-red-500 text-sm">{errores.cedula}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-500">Nombre completo</label>
                <div className="flex items-center space-x-4">
                  <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-gray-600" />
                </div>
                {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-500">Teléfono</label>
                <input name="telefono" value={form.telefono} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-gray-600" />
                {errores.telefono && <p className="text-red-500 text-sm">{errores.telefono}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-500">Departamento</label>
                <select name="departamento" value={form.departamento} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-gray-600">
                  <option value="">Seleccione...</option>
                  {departamentos.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
                {errores.departamento && <p className="text-red-500 text-sm">{errores.departamento}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-500">Ciudad</label>
                <select name="ciudad" value={form.ciudad} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-gray-600">
                  <option value="">Seleccione...</option>
                  {ciudades.map(ciudad => (
                    <option key={ciudad} value={ciudad}>{ciudad}</option>
                  ))}
                </select>
                {errores.ciudad && <p className="text-red-500 text-sm">{errores.ciudad}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-500">Dirección de envío</label>
                <input name="direccion" value={form.direccion} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-gray-600" />
                {errores.direccion && <p className="text-red-500 text-sm">{errores.direccion}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-500">Correo electrónico</label>
                <input name="correo" type="email" value={form.correo} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-gray-600" />
                {errores.correo && <p className="text-red-500 text-sm">{errores.correo}</p>}
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded shadow-md">
              <h3 className="text-xl font-semibold mb-4">Factura de compra</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Fecha: {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-sm text-gray-600">Número de factura: {numeroFactura}</p>
              </div>
              <div className="border-t border-gray-300 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Producto:</p>
                  <p className="font-medium">{producto.nombre}</p>
                </div>
                <img
                  src={imagenPrincipal || ""}
                  alt={producto.nombre}
                  className="w-16 h-16 object-contain rounded-lg"
                />
              </div>
              <div className="border-t border-gray-300 pt-4">
                <p className="text-sm text-gray-600">Talla:</p>

                <p className="font-medium">{tallaString?.talla || "Sin talla seleccionada"}</p>
              </div>
              <div className="border-t border-gray-300 pt-4 mb-2">
                <p className="text-sm text-gray-600">Color:</p>
                <div className="flex items-center">
                  <div className="font-medium">{colorObj?.color || "Sin color seleccionado"}</div>
                  <div id="color-box" className="w-8 h-8 ml-4 rounded border border-gray-300" style={{ backgroundColor: colorObj?.codigoColor || 'transparent' }}></div>
                </div>
              </div>
              <div className="border-t border-gray-300 pt-4">
                <p className="text-sm text-gray-600">Precio unitario:</p>
                <div className="flex items-center space-x-2">
                  <p className="line-through  text-gray-500">
                    {formatearPrecioEnCOP(producto.precioPublico + (producto.precioPublico * producto.descuento) / 100)}
                  </p>
                  <p className="text-green-500">{producto.descuento}%</p>
                </div>

                <p className="font-medium">{formatearPrecioEnCOP(producto.precioPublico)}</p>
              </div>
              <div className="border-t border-gray-300 pt-4">
                <p className="text-sm text-gray-600">Cantidad:</p>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setCantidad((prev) => Math.max(prev - 1, 1))}
                    className="bg-gray-200 px-4 py-2 border border-gray-300 rounded-l hover:bg-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.max(Number(e.target.value), 1))}
                    className="w-12 text-center border-t border-b border-gray-300 py-2"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => setCantidad((prev) => prev + 1)}
                    className="bg-gray-200 px-4  border border-gray-300 py-2 rounded-r hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-300 pt-4">
                <p className="text-sm text-gray-600">Total:</p>
                <p className="font-bold text-lg">{formatearPrecioEnCOP(producto.precioPublico)}</p>
              </div>
              <button
                onClick={handleContraEntrega}
                className="w-full bg-gray-700 text-white py-3 rounded hover:bg-gray-800 transition mt-6"
              >
                Contra Entrega
              </button>
              <form ref={formRef} action="https://checkout.wompi.co/p/" method="GET" id="wompi-form">
                <input type="hidden" name="public-key" value={wompiData?.publicKey} />
                <input type="hidden" name="currency" value="COP" />
                <input type="hidden" name="amount-in-cents" value={producto.precioPublico * 100} />
                <input type="hidden" name="reference" value={numeroFactura} />
                <input type="hidden" name="signature:integrity" value={wompiData.integrityHash} />
                <input type="hidden" name="redirect-url" value='https://paymentassync.site/' />
                <button
                  onClick={(e) => handleGuardarCompra(e, 'transferencia')}
                  className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition mt-6 boton-flotante"
                >
                  Pagar
                </button>
              </form>

              <div className="flex items-center justify-center mt-6">
                <p className="text-lg text-gray-600  mr-4">Pagos seguros con</p>
                <img src="/logo-wompi.svg" alt="Logo Wompi" className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
        {/* Footer con redes */}
        <footer className="bg-black text-white text-center py-6">
          <p>&copy; 2025 MEROK. Todos los derechos reservados.</p>
          <div className="mt-2 space-x-4">
            <a href="https://www.instagram.com/merok_tienda/" className="hover:underline">Instagram</a>
            <a href="#" className="hover:underline">Política de privacidad</a>
          </div>
        </footer>

        {/* Botón flotante de WhatsApp */}
        <a
          href="https://wa.me/573137950065?text=Hola%20me%20interesa%20un%20producto%20que%20vi%20en%20su%20página."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-15 right-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 48 48">
            <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6	C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path><path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"></path><path fill="#cfd8dc" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3	L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"></path><path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8	l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path><path fill="#fff" fill-rule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0	s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3	c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9	c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8	c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clip-rule="evenodd"></path>
          </svg>
        </a>
      </div>
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">¡Gracias por tu colaboración!</h2>
            <p className="text-gray-600 mb-4">
              Por favor, asegúrate de estar disponible para recibir y pagar tu pedido el día de la entrega.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarContraEntrega}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
