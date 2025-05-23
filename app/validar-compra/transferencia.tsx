import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { Spinner } from "~/components/Spinner";

export function ConfirmacionTransferencia() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const { idp, idc } = useParams();
    const [transactionStatus, setTransactionStatus] = useState<string>('validating');
    const [isValidating, setIsValidating] = useState(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if (transactionStatus !== 'validating') {
            setIsValidating(false);
        }

        const fetchTransactionStatus = async () => {
            if (id) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_WOMPI_URL}${id}`, {
                        method: 'GET',
                    });
                    const result = await response.json();

                    switch (result.data.status) {
                        case 'APPROVED':
                            setTransactionStatus('success');
                            try {
                                await fetch(`${import.meta.env.VITE_API_BASE_URL}/compras/${idc}/transferencia-id`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ transferenciaId: id }),
                                });
                            } catch (error) {
                                console.error('Error al enviar el ID de transferencia:', error);
                            }
                            break;
                        case 'DECLINED':
                            setTransactionStatus('declined');
                            break;
                        default:
                            setTransactionStatus('error');
                            break;
                    }
                } catch (error) {
                    console.error('Error fetching transaction status:', error);
                    setTransactionStatus('error');
                }
            }
        };

        const timer = setTimeout(() => {
            fetchTransactionStatus();
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, transactionStatus]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <header className="bg-black py-4 shadow-md fixed top-0 w-full z-50">
                <div className="container mx-auto text-center cursor-pointer">
                    <h1 className="text-white text-xl font-bold inline-block px-4 py-2 border-2 border-white rounded-lg">
                        CIVICO
                    </h1>
                </div>
            </header>
            {isValidating && (
                <div className="flex flex-col items-center">
                    <Spinner />
                    <p className="text-gray-600 mt-4">Estamos validando tu transacción. Por favor, espera un momento...</p>
                </div>
            )}
            {transactionStatus === 'success' && (
                <div className="flex flex-col items-center bg-white p-8 rounded shadow-md text-center">
                    <h1 className="text-3xl font-bold text-green-600 mb-4">¡Pago Aprobado!</h1>
                    <p className="text-gray-700 mb-4">Tu pago ha sido procesado exitosamente. ¡Gracias por tu confianza!</p>
                    <p className="text-gray-700 mb-6">Pronto nos comunicaremos contigo mediante WhatsApp para confirmar los detalles de tu pedido.</p>
                    <button
                        onClick={() => window.location.href = `/home/${idp}`}
                        className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
                    >
                        Volver al inicio
                    </button>
                </div>
            )}
            {transactionStatus === 'declined' && (
                <div className="flex flex-col items-center bg-white p-8 rounded shadow-md text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Pago Rechazado</h1>
                    <p className="text-gray-700 mb-4">Lo sentimos, tu pago no pudo ser procesado.</p>
                    <p className="text-gray-700 mb-6">Por favor, verifica los datos de tu tarjeta o intenta nuevamente más tarde.</p>
                    <button
                        onClick={() => window.location.href = `/home/${idp}`}
                        className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
                    >
                        Volver al inicio
                    </button>
                </div>
            )}
            {transactionStatus === 'error' && (
                <div className="flex flex-col items-center bg-white p-8 rounded shadow-md text-center">
                    <h1 className="text-3xl font-bold text-yellow-600 mb-4">Error en la Transacción</h1>
                    <p className="text-gray-700 mb-4">Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
                    <p className="text-gray-700 mb-6">Si el problema persiste, contáctanos para obtener ayuda.</p>
                    <button
                        onClick={() => window.location.href = `https://wa.me/573053000000?text=Hola, tengo un problema con mi pago.`}
                        className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
                    >
                        Escribenos a WhatsApp
                    </button>
                </div>
            )}
        </div>
    );

}

