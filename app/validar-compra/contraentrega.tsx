import { useNavigate } from 'react-router';

export function ConfirmacionContraEntrega() {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-gray-800 relative bg-white">
      <header className="bg-black py-4 shadow-md fixed top-0 w-full z-50">
        <div className="container mx-auto text-center cursor-pointer" onClick={() => {}}>
          <h1 className="text-white text-xl font-bold inline-block px-4 py-2 border-2 border-white rounded-lg">
            CIVICO
          </h1>
        </div>
      </header>
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">¡Gracias por tu confianza!</h2>
          <p className="text-gray-600 mb-4">
            Tu pedido ha sido registrado exitosamente como "Contra Entrega". Pronto nos comunicaremos contigo mediante WhatsApp para confirmar los detalles de tu pedido.
          </p>
          <p className="text-gray-600 mb-6">Agradecemos tu colaboración y confianza en nosotros.</p>
        </div>
      </div>
    </div>
  );
}