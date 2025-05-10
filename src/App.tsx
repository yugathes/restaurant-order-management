
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { MenuProvider } from "./context/MenuContext";
import { TableProvider } from "./context/TableContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tables from "./pages/Tables";
import Orders from "./pages/Orders";
import Kitchen from "./pages/Kitchen";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MenuProvider>
        <OrderProvider>
          <TableProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />

                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/tables"
                    element={
                      <ProtectedRoute>
                        <Tables />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/kitchen"
                    element={
                      <ProtectedRoute>
                        <Kitchen />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </TableProvider>
        </OrderProvider>
      </MenuProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
