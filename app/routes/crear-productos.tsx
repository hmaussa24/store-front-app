import type { Route } from "./+types/home";
import { CrearProducto } from "../dashboard/productos/crear-producto";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Productos" },
    { name: "description", content: "Agregar productos" },
  ];
}

export default function Home() {
  return <CrearProducto />;
}
