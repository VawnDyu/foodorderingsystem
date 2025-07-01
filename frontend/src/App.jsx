// src/App.jsx

//React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//React Hooks
import React from 'react';

//React Toast
import { ToastContainer, toast } from 'react-toastify';

// Stylesheets
import 'react-toastify/dist/ReactToastify.css';
import './styles/globals.css';
import './styles/theme.css';

// Components
import PrivateRoute from './components/PrivateRoute';
import RequireAuth from './components/RequireAuth';
import Token from './components/TokenMonitor';

// Admin Routes
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Users from './pages/Users';

// Public Routes
import Signup from './pages/SignUp';
import Login from './pages/Login';
import Terms from './pages/TermsOfService';
import Privacy from './pages/PrivacyAndPolicy';

// Customer Routes
import Home from './components/Home';
import CustomerOrder from './pages/CustomerOrder';
import Cart from './pages/Cart';
import OrderDetails from './components/OrderDetails';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './components/CheckoutSuccess';
import OrderReceipt from './components/OrderReceipt';
import Account from './pages/Account';

// Cashier Routes
import Cashier from './pages/Cashier';
import CashierAccount from './components/CashierAccount';

// Chef Routes
import Chef from './pages/Chef';
import ChefAccount from './components/ChefAccount';

//Cart Contexts
import { CartProvider } from './contexts/CartContext'; // Import CartProvider


function App() {
  return (
    <CartProvider> {/* Wrap the entire app with CartProvider */}
      <Router>
        <ToastContainer position="top-center" autoClose={5000} closeButton={false} pauseOnHover={false} onClick={() => toast.dismiss()} toastClassName="custom-toast"
        bodyClassName="custom-toast-body" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* <Route path="/orderList" element={<OrderList />} /> */}

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <PrivateRoute requiredRole="Admin" redirectTo="/login">
                    <Dashboard />
                </PrivateRoute>
              </RequireAuth>
            }
          />

          <Route
            path="/menu"
            element={
              <RequireAuth>
                <PrivateRoute requiredRole="Admin" redirectTo="/login">
                    <Menu />
                </PrivateRoute>
              </RequireAuth>
            }
          />

          <Route
            path="/users"
            element={
              <RequireAuth>
                <PrivateRoute requiredRole="Admin" redirectTo="/login">
                    <Users />
                </PrivateRoute>
              </RequireAuth>
            }
          />


          {/*Customer Routes*/}

          <Route
            path="/order"
            element={
              <RequireAuth>
                  <PrivateRoute requiredRole="Customer" redirectTo="/login">
                    <CustomerOrder />
                  </PrivateRoute>
              </RequireAuth>
            }
          />

          <Route
            path="/order/:id"
            element={
              <RequireAuth>
                  <PrivateRoute requiredRole="Customer" redirectTo="/login">
                    <OrderDetails />
                  </PrivateRoute>
              </RequireAuth>
            }
          />

          <Route
            path="/cart"
            element={
              <RequireAuth>
                <PrivateRoute requiredRole="Customer" redirectTo="/login">
                  <Cart />
                </PrivateRoute>
              </RequireAuth>
            }
          />

          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <PrivateRoute requiredRole="Customer" redirectTo="/login">
                  <Checkout />
                </PrivateRoute>
              </RequireAuth>
            }
          />

          <Route path="/success" element={
            <RequireAuth>
              <PrivateRoute requiredRole="Customer" redirectTo="/login">
                  <CheckoutSuccess />
              </PrivateRoute>
            </RequireAuth>
            }
          />

          <Route path="/orders/:id" element={
            <RequireAuth>
              <PrivateRoute requiredRole="Customer" redirectTo="/login">
                  <OrderReceipt />
              </PrivateRoute>
            </RequireAuth>
            }
          />

          <Route path="/account" element={
            <RequireAuth>
              <PrivateRoute requiredRole="Customer" redirectTo="/login">
                  <Account />
              </PrivateRoute>
            </RequireAuth>
            }
          />

          {/* Cashier Routes */}
          <Route path='/cashier/dashboard' element={
            <RequireAuth>
              <PrivateRoute requiredRole="Cashier" redirectTo="login">
                  <Cashier />
              </PrivateRoute>
            </RequireAuth>
            }
          />

          <Route path='/cashier/account' element={
            <RequireAuth>
              <PrivateRoute requiredRole="Cashier" redirectTo="login">
                <CashierAccount />
              </PrivateRoute>
            </RequireAuth>
            }
          />

          {/* Chef Routes */}
          <Route path='/chef/dashboard' element={
            <RequireAuth>
              <PrivateRoute requiredRole="Chef" redirectTo="login">
                  <Chef />
              </PrivateRoute>
            </RequireAuth>
            }
          />

          <Route path='/chef/account' element={
            <RequireAuth>
              <PrivateRoute requiredRole="Chef" redirectTo="login">
                <ChefAccount />
              </PrivateRoute>
            </RequireAuth>
            }
          />

          <Route path="/token" element={<Token />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
