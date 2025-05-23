import type { Route } from "./+types/home";
import { ListaCompras } from "../dashboard/compras/compras";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lista de Compras" },
    { name: "description", content: "Lista de Compras" },
  ];
}

export default function CheckoutPage() {
  return <ListaCompras />;
}
