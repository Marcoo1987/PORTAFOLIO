const PRICING_PLANS = [
    {
        id: "emprendedor",
        name: "Plan Emprendedor",
        price: "$200.000",
        period: "/pago único",
        description: "Perfecto para negocios pequeños que necesitan visibilidad rápida sin costos de mantención.",
        features: [
            { text: "Catálogo estático ultrarrápido", included: true },
            { text: "Diseño premium (Dark Mode)", included: true },
            { text: "Carrito de compras", included: true },
            { text: "Cierre de ventas vía WhatsApp", included: true },
            { text: "Sin base de datos", included: false },
            { text: "Sin panel autogestionable", included: false },
            { text: "Sin pago con tarjetas", included: false }
        ],
        cta: "Comenzar Ahora",
        popular: false
    },
    {
        id: "pro",
        name: "Plan Pro",
        price: "$500.000",
        period: "/pago único",
        description: "Para Pymes que buscan automatizar sus cobros y administrar su inventario de forma independiente.",
        features: [
            { text: "Panel de Administración privado", included: true },
            { text: "Base de datos PostgreSQL", included: true },
            { text: "Alojamiento de imágenes en Cloudinary", included: true },
            { text: "Checkout Mercado Pago (Tarjetas)", included: true, highlight: "#009ee3" },
            { text: "Cierre de ventas mixto (WP/Web)", included: true },
            { text: "Arquitectura básica (MVC)", included: false },
            { text: "Sin soporte nativo Docker", included: false }
        ],
        cta: "Obtener Plan Pro",
        popular: true
    },
    {
        id: "corporativo",
        name: "Plan Corporativo",
        price: "$1.000.000",
        period: "/pago único",
        description: "Solución *enterprise* pensada para escalabilidad, despliegues automáticos e integridad de datos.",
        features: [
            { text: "Todas las funciones del Plan Pro", included: true },
            { text: "Arquitectura Limpia por Capas (Services)", included: true },
            { text: "Soporte oficial Docker y Compose", included: true },
            { text: "Testing Automático (Jest Mocks)", included: true },
            { text: "Configuración CI/CD lista", included: true },
            { text: "Escalabilidad asegurada para equipos", included: true },
            { text: "Documentación técnica completa", included: true }
        ],
        cta: "Hablar con Ventas",
        popular: false,
        style: "color: #60a5fa;"
    }
];

export default PRICING_PLANS;
