import type { Route } from "./+types/home";
import { LandingProducto } from "../welcome/LandingProducto";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MEROK" },
    { name: "description", content: "Bienvenido a CIVICO!" },
  ];
}

export default function Home() {
  return <LandingProducto />;
}
