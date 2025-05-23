import type { Route } from "./+types/home";
import { Checkout } from "../checkout/checkout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout" },
    { name: "description", content: "Checkout" },
  ];
}

export default function CheckoutPage() {
  return <Checkout />;
}
