   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: "standalone",
     experimental: {
       serverActions: {
         // Codespaces: сайт открывается через *.app.github.dev, а сервер видит localhost
         allowedOrigins: ["localhost:3000", "*.app.github.dev"],
       },
     },
   };

   export default nextConfig;