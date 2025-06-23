import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Common Components
import Navbar from "./components/Navbar";

// Auth Utilities
import { getToken, getUserRoles } from "./utils/auth";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SellerStatus from "./pages/SellerStatus";
import AdminDashboard from "./pages/AdminDashboard";
import CreateUser from "./pages/CreateUser";
import PendingAdmins from "./pages/PendingAdmins";
import ApprovedAdmins from "./pages/ApprovedAdmins";
import AdminStatus from "./pages/AdminStatus";
import PendingSellers from "./pages/PendingSellers";
import ApprovedSellers from "./pages/ApprovedSellers";
import AddShop from "./pages/AddShop";
import MyShops from "./pages/MyShops";
import AddProduct from "./pages/AddProduct";
import MyProducts from "./pages/MyProducts";
import PendingShops from "./pages/PendingShops";     // ✅ Newly added
import ApprovedShops from "./pages/ApprovedShops";   // ✅ Newly added

// Protected Route
const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = getToken();
  const roles = getUserRoles();

  if (!token) return <Navigate to="/login" replace />;

  const isAllowed = roles.some(role => allowedRoles.includes(role));
  return isAllowed ? element : <Navigate to="/unauthorized" replace />;
};

// Public Route
const PublicRoute = ({ element }) => {
  const token = getToken();
  const roles = getUserRoles();

  if (token) {
    if (roles.includes("ROLE_SUPER_ADMIN")) return <Navigate to="/admin-dashboard" replace />;
    if (roles.includes("ROLE_ADMIN")) return <Navigate to="/pending" replace />;
    if (roles.includes("ROLE_SELLER")) return <Navigate to="/seller-profile" replace />;
    if (roles.includes("ROLE_USER")) return <Navigate to="/profile" replace />;
    return <Navigate to="/profile" replace />;
  }

  return element;
};

// Unauthorized Page
function Unauthorized() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Access Denied</h2>
      <p>You do not have permission to view this page.</p>
      <a href="/">Go back home</a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute element={<Login />} />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />

        {/* User Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={<Profile />}
              allowedRoles={["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_SELLER"]}
            />
          }
        />

        {/* Seller Routes */}
        <Route
          path="/seller-profile"
          element={<ProtectedRoute element={<SellerStatus />} allowedRoles={["ROLE_SELLER"]} />}
        />
        <Route
          path="/add-shop"
          element={<ProtectedRoute element={<AddShop />} allowedRoles={["ROLE_SELLER"]} />}
        />
        <Route
          path="/my-shops"
          element={<ProtectedRoute element={<MyShops />} allowedRoles={["ROLE_SELLER"]} />}
        />
        <Route
          path="/add-product"
          element={<ProtectedRoute element={<AddProduct />} allowedRoles={["ROLE_SELLER"]} />}
        />
        <Route
          path="/my-products"
          element={<ProtectedRoute element={<MyProducts />} allowedRoles={["ROLE_SELLER"]} />}
        />

        {/* Admin Routes */}
        <Route
          path="/pending"
          element={<ProtectedRoute element={<PendingSellers />} allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]} />}
        />
        <Route
          path="/approved"
          element={<ProtectedRoute element={<ApprovedSellers />} allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]} />}
        />
        <Route
          path="/pending-shops"
          element={<ProtectedRoute element={<PendingShops />} allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]} />}
        />
        <Route
          path="/approved-shops"
          element={<ProtectedRoute element={<ApprovedShops />} allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]} />}
        />

        {/* Super Admin Only */}
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["ROLE_SUPER_ADMIN"]} />}
        />
        <Route
          path="/create-user"
          element={<ProtectedRoute element={<CreateUser />} allowedRoles={["ROLE_SUPER_ADMIN"]} />}
        />
        <Route
          path="/pending-admins"
          element={<ProtectedRoute element={<PendingAdmins />} allowedRoles={["ROLE_SUPER_ADMIN"]} />}
        />
        <Route
          path="/approved-admins"
          element={<ProtectedRoute element={<ApprovedAdmins />} allowedRoles={["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]} />}
        />
        <Route
          path="/admin-status"
          element={<ProtectedRoute element={<AdminStatus />} allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]} />}
        />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 404 */}
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "3rem" }}>404: Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
