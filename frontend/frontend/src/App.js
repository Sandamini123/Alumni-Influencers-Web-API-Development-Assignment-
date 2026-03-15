import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./components/DashboardLayout";
import Profile from "./pages/Profile";
import Bidding from "./pages/Bidding";
import Admin from "./pages/Admin";
import NightWinnerAlumni from "./pages/NightWinnerAlumni";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<NightWinnerAlumni />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="bidding" element={<Bidding />} />
          <Route path="admin" element={<Admin />} />
          {/* <Route path="NightWinnerAlumni" element={<NightWinnerAlumni />} /> */}
        </Route>
        <Route path="/adminDashboard" element={<AdminDashboard />}>
          <Route path="admin" element={<Admin />} />
          {/* <Route path="featuredDashboard" element={<FeaturedDashboard/>} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;