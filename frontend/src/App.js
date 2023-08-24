import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";
import PageNotFound from "main/pages/PageNotFound";
import PrivacyPolicy from "main/pages/PrivacyPolicy";

import RideRequestCreatePage from "main/pages/Ride/RideRequestCreatePage";
import RideRequestEditPage from "main/pages/Ride/RideRequestEditPage";
import RideRequestIndexPage from "main/pages/Ride/RideRequestIndexPage";
import ShiftPage from "main/pages/ShiftPage";





import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";
import ShiftIndexPage from "main/pages/Shift/ShiftIndexPage";
import ShiftCreatePage from "main/pages/Shift/ShiftCreatePage";
import ShiftEditPage from "main/pages/Shift/ShiftEditPage";


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_DRIVER") || hasRole(currentUser, "ROLE_RIDER") )&& <Route exact path="/ride/" element={<RideRequestIndexPage />} />
        }
        {
          (hasRole(currentUser, "ROLE_RIDER") || hasRole(currentUser, "ROLE_ADMIN"))  && <Route exact path="/ride/create" element={<RideRequestCreatePage />} />
        }
        {
          (hasRole(currentUser, "ROLE_ADMIN")  || hasRole(currentUser, "ROLE_RIDER") )&& <Route exact path="/ride/edit/:id" element={<RideRequestEditPage />} />
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/shift/list" element={<ShiftPage />} />
        }
        {
          hasRole(currentUser, "ROLE_DRIVER") && <Route exact path="/shift/list" element={<ShiftPage />} />
        }
        {
          hasRole(currentUser, "ROLE_RIDER") && <Route exact path="/shift/list" element={<ShiftPage />} />
        }
        {
          (hasRole(currentUser, "ROLE_DRIVER") || hasRole(currentUser, "ROLE_USER")) && (
            <>
              <Route exact path="/shift" element={<ShiftIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/shift/create" element={<ShiftCreatePage />} />
              <Route exact path="/shift/edit/:id" element={<ShiftEditPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER")
        }
        <Route exact path="/*" element={<PageNotFound />} />
        <Route exact path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;