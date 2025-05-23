import type { Route } from "./+types/home";
import { VerProducto } from "../dashboard/productos/ver-producto";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Productos" },
    { name: "description", content: "Detalles del Producto" },
  ];
}

export default function Home() {
  return <VerProducto />;
}
