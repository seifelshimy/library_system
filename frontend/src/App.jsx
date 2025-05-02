import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import BooksPage from "./pages/BooksPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import AddBookPage from "./pages/AddBookPage";
import BorrowedBooksPage from "./pages/BorrowedBooksPage";
import MembersPage from "./pages/MembersPage";
import AddMemberPage from "./pages/AddMemberPage";
import MemberDetailsPage from "./pages/MemberDetailsPage";
import ReservationsPage from "./pages/ReservationsPage";
import SettingsPage from "./pages/SettingsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/:id" element={<BookDetailsPage />} />
            
            <Route 
              path="add-book" 
              element={
                <ProtectedRoute requiredRoles={['admin', 'librarian']}>
                  <AddBookPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="borrowed" element={<BorrowedBooksPage />} />
            
            <Route 
              path="members" 
              element={
                <ProtectedRoute requiredRoles={['admin', 'librarian']}>
                  <MembersPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="members/add" 
              element={
                <ProtectedRoute requiredRoles={['admin', 'librarian']}>
                  <AddMemberPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="members/:id" 
              element={
                <ProtectedRoute requiredRoles={['admin', 'librarian']}>
                  <MemberDetailsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="reservations" 
              element={
                <ProtectedRoute requiredRoles={['admin', 'librarian']}>
                  <ReservationsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;