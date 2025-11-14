# GreenCart - E-Commerce Platform

![Deploy Status](https://github.com/Akash520820/Greencart/actions/workflows/deploy.yml/badge.svg)

A modern e-commerce platform built with React, TypeScript, and Vite. Features separate interfaces for customers and sellers.

## 🌐 Live Demo

Visit the live site: [https://Akash520820.github.io/Greencart](https://Akash520820.github.io/Greencart)

## ✨ Features

### Client Features
- 🛍️ Browse products by category
- 🔍 Search functionality
- 🛒 Shopping cart management
- 📦 Order tracking
- 👤 User authentication

### Seller Features
- 📊 Dashboard analytics
- 📦 Inventory management
- ➕ Add/Edit products
- 📋 Order management
- 🔐 Protected seller routes

## 🛠️ Built With

- **React** 19.2.0 - UI Library
- **TypeScript** 5.9.3 - Type Safety
- **Vite** 7.2.2 - Build Tool
- **React Router** 7.9.5 - Routing
- **Bootstrap** 5.3.8 - UI Framework
- **React Icons** 5.5.0 - Icons
- **React Hot Toast** 2.6.0 - Notifications

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- npm (v8.x or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
greencart-client/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── Client/                 # Client-facing components
│   │   ├── ClientPages/
│   │   └── ClientsComponent/
│   ├── Seller/                 # Seller-facing components
│   │   ├── SellerPages/
│   │   └── SellerComponent/
│   ├── context/                # React Context providers
│   ├── App.tsx
│   └── main.tsx
├── public/                     # Static assets
├── vite.config.ts             # Vite configuration
└── package.json
```

## 🚀 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

### Deployment Process:
1. Push to `main` branch
2. GitHub Actions workflow triggers
3. Build process runs
4. Deploy to GitHub Pages
5. Live site updates

### Manual Deployment:
Go to the repository → Actions → "Deploy React App to GitHub Pages" → Run workflow

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- React Team
- Vite Team
- Bootstrap Team

---

Made with ❤️ by Your Name