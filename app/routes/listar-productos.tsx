import type { Route } from "./+types/home";
import { ListaProductos } from "../dashboard/productos/lista-productos";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Productos" },
    { name: "description", content: "Lista de Productos" },
  ];
}

export default function Home() {
  return <ListaProductos />;
}
