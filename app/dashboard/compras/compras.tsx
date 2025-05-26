import { useEffect, useState } from "react";
import axios from "axios";
import { formatearPrecioEnCOP } from "~/utils/utils";
import { useNavigate } from "react-router";

interface Compra {
    id: number;
    referencia: string;
    cantidad: string;
    estado: string;
    descuento: number;
    metodoPago: "contraentrega" | "transferencia";
    departamento: string;
    ciudad: string;
    direccion: string;
    transferenciaId?: string;
    createdAt: string;
    updatedAt: string;
    client: {
        cedula: string;
        nombre: string;
        email: string;
        telefono: string;
        direccion: string;
        ciudad: string;
        departamento: string;
    };
    producto: {
        nombre: string;
        precioPublico: number;
        imagenes: { url: string }[];
        descripcion: string;
    };
    talla: {
        talla: string;
    };
    color?: {
        color: string;
        codigoColor: string;
    };
}

export function ListaCompras() {
    const navigate = useNavigate();
    const [compras, setCompras] = useState<Compra[]>([]);
    const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);
    const fetchCompras = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/compras`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            setCompras(response.data);
        } catch (error) {
            console.error("Error al obtener las compras:", error);
        }
    };

    useEffect(() => {
        fetchCompras();
    }, []);

    const handleRowClick = (compra: Compra) => {
        setSelectedCompra(compra);
    };

    const closeModal = () => {
        setSelectedCompra(null);
    };

    const cambiarEstadoPedido = async (id: number, nuevoEstado: string) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/compras/${id}/estado`, {
                estado: nuevoEstado,
            });
            fetchCompras(); // Refrescar la lista de compras después de cambiar el estado
            alert("El estado del pedido ha sido actualizado a 'Enviado'.");
        } catch (error) {
            console.error("Error al cambiar el estado del pedido:", error);
            alert("Hubo un error al cambiar el estado del pedido.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <header className="bg-black py-4 shadow-md fixed top-0 w-full z-50">
                <div className="container mx-auto text-center cursor-pointer">
                    <h1 className="text-white text-xl font-bold inline-block px-4 py-2 border-2 border-white rounded-lg">
                        CIVICO
                    </h1>
                </div>
            </header>
            <div className="bg-white mt-15 p-8 rounded-lg shadow-lg max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Lista de Compras</h1>
                <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Referencia</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Cliente</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Producto</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Talla</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Color</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Cantidad</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Total</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Estado</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Método de Pago</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compras.map((compra, index) => (
                            <tr
                                key={compra.id}
                                className={`cursor-pointer ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                                onClick={() => handleRowClick(compra)}
                            >
                                <td className="px-4 py-2 border-b text-sm text-gray-700">{compra.referencia}</td>
                                <td className="px-4 py-2 border-b text-sm text-gray-700">{compra.client.nombre}</td>
                                <td className="px-4 py-2 border-b text-sm text-gray-700">{compra.producto.nombre}</td>
                                <td className="px-4 py-2 border-b text-sm text-gray-700">{compra.talla.talla}</td>
                                <td className="px-4 py-2 border-b text-sm text-gray-700">{compra.color?.color}</td>
                                <td className="px-4 py-2 border-b text-sm text-gray-700">{compra.cantidad}</td>
                                <td className="px-4 py-2 border-b text-sm text-gray-700 font-semibold">{formatearPrecioEnCOP(compra.producto.precioPublico * parseInt(compra.cantidad))}</td>
                                <td className="px-4 py-2 border-b text-sm text-gray-700">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      compra.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                      compra.estado === 'Enviado' ? 'bg-green-100 text-green-800' :
                                      compra.estado === 'Enviado-Contraentrega' ? 'bg-blue-100 text-blue-800' : ''
                                    }`}>
                                      {compra.estado}
                                    </span>
                                </td>
                                <td className="px-4 py-2 border-b text-sm text-gray-700 capitalize">{compra.metodoPago}</td>
                                <td className="px-4 py-2 border-b text-sm text-gray-700">{new Date(compra.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    onClick={() => navigate('/listar-productos')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mt-4"
                >
                    Ir a Listar Productos
                </button>
            </div>

            {selectedCompra && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 bg-gray-300 text-gray-700 rounded-full p-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Detalles del Producto</h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src={selectedCompra.producto.imagenes[0]?.url}
                                alt={selectedCompra.producto.nombre}
                                className="w-full md:w-1/2 h-auto object-contain rounded-md border border-gray-300 shadow-sm"
                            />
                            <div className="space-y-2 md:w-1/2">
                                <p className="text-gray-700"><strong>Producto:</strong> {selectedCompra.producto.nombre}</p>
                                <p className="text-gray-700"><strong>Descripción:</strong> {selectedCompra.producto.descripcion}</p>
                                <p className="text-gray-700"><strong>Precio:</strong> {formatearPrecioEnCOP(selectedCompra.producto.precioPublico)}</p>
                                <p className="text-gray-700"><strong>Talla:</strong> {selectedCompra.talla.talla}</p>
                                <p className="text-gray-700"><strong>Color:</strong> {selectedCompra.color?.color}</p>
                                <p className="text-gray-700"><strong>Cantidad:</strong> {selectedCompra.cantidad}</p>
                                <p className="text-gray-700"><strong>Cliente:</strong> {selectedCompra.client.nombre}</p>
                                <p className="text-gray-700"><strong>Cédula:</strong> {selectedCompra.client.cedula}</p>
                                <p className="text-gray-700"><strong>Correo:</strong> {selectedCompra.client.email}</p>
                                <p className="text-gray-700"><strong>Teléfono:</strong> {selectedCompra.client.telefono}</p>
                                <p className="text-gray-700"><strong>Dirección del Cliente:</strong> {selectedCompra.client.direccion}, {selectedCompra.client.ciudad}, {selectedCompra.client.departamento}</p>
                                <p className="text-gray-700"><strong>Dirección de Envío:</strong> {selectedCompra.direccion}, {selectedCompra.ciudad}, {selectedCompra.departamento}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button
                                onClick={() => cambiarEstadoPedido(selectedCompra.id, "Enviado")}
                                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                Enviado
                            </button>
                            <button
                                onClick={() => cambiarEstadoPedido(selectedCompra.id, "Pagado")}
                                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                Pagado
                            </button>
                            <button
                                onClick={() => cambiarEstadoPedido(selectedCompra.id, "Enviado-Contraentrega")}
                                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                Enviado-Contraentrega
                            </button>
                            <button
                                onClick={() => cambiarEstadoPedido(selectedCompra.id, "Entregado")}
                                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                Entregado
                            </button>
                            <button
                                onClick={() => cambiarEstadoPedido(selectedCompra.id, "Cancelado")}
                                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                Cancelado
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}