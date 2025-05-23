import type { Route } from "./+types/home";
import { ConfirmacionTransferencia } from "../validar-compra/transferencia";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tranferencia" },
    { name: "description", content: "Transferencia" },
  ];
}

export default function CheckoutPage() {
  return <ConfirmacionTransferencia />;
}