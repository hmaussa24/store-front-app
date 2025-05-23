import type { Route } from "./+types/home";
import { ConfirmacionContraEntrega} from "../validar-compra/contraentrega";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contra Entrega" },
    { name: "description", content: "Contra Entrega" },
  ];
}

export default function CheckoutPage() {
  return <ConfirmacionContraEntrega />;
}
