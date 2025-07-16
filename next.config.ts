import type { NextConfig } from "next";

const nextConfig = {
  // Adicione esta configuração de imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Permite qualquer caminho dentro desse hostname
      },
    ],
  },
};

export default nextConfig;
