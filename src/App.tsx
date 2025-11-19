import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';

// Authentication Contexts
import { ClientAuthProvider } from './context/ClientAuthContext';
import { SellerAuthProvider } from './context/SellerAuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext'; // 👈 Add this

// Client Layout & Pages
import ClientAppLayout from './Client/ClientsComponent/Layout/ClientAppLayout';
import Home from './Client/ClientPages/Home';
import AllProduct from './Client/ClientPages/AllProducts';
import MyOrders from './Client/ClientPages/MyOrders';
import Cart from './Client/ClientPages/Cart';

// Seller Layout & Pages
import SellerAppLayout from './Seller/SellerComponent/Layout/SellerAppLayout';
import SellerDashboard from './Seller/SellerPages/SellerDashboard';
import OrderSection from './Seller/SellerPages/OrderSection';
import AddProduct from './Seller/SellerPages/AddProduct';
import ManageInventory from './Seller/SellerPages/ManageInventory';

// Seller Auth Page
import SellerAuthPage from './Seller/SellerPages/SellerAuthPage';

// Protected Route Component for Seller
import ProtectedSellerRoute from './Seller/SellerComponent/ProtectedSellerRoute';

// Get base URL for GitHub Pages
const basename = import.meta.env.BASE_URL;

const router = createBrowserRouter([
  // CLIENT ROUTES
  {
    path: "/",
    element: <ClientAppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/AllProduct",
        element: <AllProduct />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/my-orders",
        element: <MyOrders />,
      },
    ],
  },

  // SELLER AUTH ROUTE (Public - Login/Signup)
  {
    path: "/seller/auth",
    element: <SellerAuthPage />,
  },

  // SELLER ROUTES (Protected)
  {
    path: "/seller",
    element: (
      <ProtectedSellerRoute>
        <SellerAppLayout />
      </ProtectedSellerRoute>
    ),
    children: [
      {
        path: "/seller",
        element: <Navigate to="/seller/dashboard" replace />,
      },
      {
        path: "/seller/dashboard",
        element: <SellerDashboard />,
      },
      {
        path: "/seller/orders",
        element: <OrderSection />,
      },
      {
        path: "/seller/add-product",
        element: <AddProduct />,
      },
      {
        path: "/seller/inventory",
        element: <ManageInventory />,
      },
    ],
  },
], {
  basename: basename,
});

function App() {
  return (
    <ClientAuthProvider>
      <SellerAuthProvider>
        <ProductProvider>
          <OrderProvider>  {/* 👈 Add OrderProvider */}
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </OrderProvider>
        </ProductProvider>
      </SellerAuthProvider>
    </ClientAuthProvider>
  );
}

export default App;