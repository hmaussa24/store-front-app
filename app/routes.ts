import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    route('home/:id', 'routes/home.tsx'),
    route('checkout/:id/:talla/:color', 'routes/checkoutpage.tsx'),
    route('login', 'routes/login.tsx'),
    route('listar-productos', 'routes/listar-productos.tsx'),
    route('crear-producto', 'routes/crear-productos.tsx'),
    route('ver-producto/:id', 'routes/ver-producto.tsx'),
    route('contraentrega', 'routes/contraentrega.tsx'),
    route('transferencia/:idp/:idc', 'routes/transferencia.tsx'),
    route('compras', 'routes/compras.tsx'),
] satisfies RouteConfig;
