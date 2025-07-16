<div align="center">
  <h1 align="center">🚗 AutoCatalog</h1>
  <p align="center">
    <strong>Marketplace Automotivo Inteligente</strong>
    <br />
    Uma plataforma full-stack moderna para a compra e venda de veículos, com foco em filtros detalhados e perfis de loja.
  </p>
</div>

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-4-3982CE?style=for-the-badge&logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8-00758F?style=for-the-badge&logo=mysql)
![Cloudinary](https://img.shields.io/badge/Cloudinary-blue?style=for-the-badge&logo=cloudinary)

</div>

<br>

---

## ✨ Funcionalidades Principais

*   **Catálogo Detalhado:** Anúncios de veículos com mais de 30 especificações técnicas, opcionais e histórico.
*   **Perfis de Usuário com Permissões:**
    *   👤 **Admin:** Controle total sobre a plataforma.
    *   🏢 **Loja (CNPJ):** Perfil de concessionária com página pública, veículos ilimitados e gerenciamento de vendedores.
    *   👨‍💼 **Vendedor (CPF):** Associado a uma loja, gerencia os anúncios da concessionária.
    *   🚗 **Vendedor Individual (CPF):** Anúncio limitado de veículos para pessoas físicas.
    *   🛒 **Comprador (CPF):** Navegação, busca e filtros avançados.
*   **Busca e Filtros Avançados:** Filtre por marca, modelo, ano, faixa de preço, localização e mais.
*   **Páginas de Loja:** Vitrine digital para cada concessionária com suas informações e veículos.
*   **Galeria de Imagens:** Upload de múltiplas imagens por veículo com armazenamento em nuvem.
*   **Autenticação Segura:** Sistema de login e registro baseado em JWT (JSON Web Tokens).
*   **Arquitetura Desacoplada:** Frontend e Backend independentes para maior escalabilidade.

---

## 🛠️ Stack de Tecnologias

| Categoria | Tecnologia |
| :--- | :--- |
| 🖥️ **Frontend** | `Next.js 14` (App Router), `TypeScript`, `TailwindCSS`, `React Hook Form`, `Zod` |
| ⚙️ **Backend (API)** | `Next.js 14 API Routes`, `TypeScript`, `Zod`, `JWT (jose)` |
| 🗃️ **Banco de Dados** | `MySQL`, `Prisma ORM` |
| ☁️ **Infra & Serviços** | `Cloudinary` (Upload de Imagens), `Node.js` |

---

## 🚀 Como Rodar o Projeto Localmente

Siga os passos abaixo para executar o AutoCatalog em sua máquina.

### **Pré-requisitos**
- [Node.js](https://nodejs.org/en/) (v18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Servidor [MySQL](https://dev.mysql.com/downloads/mysql/) rodando localmente.

### **Instalação**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/auto-catalog.git
    cd auto-catalog
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Ambiente:**
    *   Copie `.env.example` para `.env` e preencha com suas credenciais.
        ```bash
        cp .env.example .env
        ```
    *   Edite o arquivo `.env`:
        ```env
        # Banco de Dados
        DATABASE_URL="mysql://SEU_USUARIO:SUA_SENHA@localhost:3306/autocatalog"

        # Autenticação
        JWT_SECRET="GERAR_UM_SEGREDO_FORTE_E_LONGO_AQUI"

        # Cloudinary
        CLOUDINARY_CLOUD_NAME="SEU_CLOUD_NAME"
        CLOUDINARY_API_KEY="SUA_API_KEY"
        CLOUDINARY_API_SECRET="SEU_API_SECRET"
        ```

4.  **Configure o Banco de Dados:**
    *   Certifique-se de que seu servidor MySQL está rodando e o banco de dados `autocatalog` foi criado.
    *   Rode as migrações do Prisma:
        ```bash
        npx prisma migrate dev
        ```

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

6.  Pronto! Acesse <a href="http://localhost:3000">http://localhost:3000</a> em seu navegador.

---
<p align="center">
  <em>Este projeto foi desenvolvido como parte de um estudo full-stack.</em>
</p>