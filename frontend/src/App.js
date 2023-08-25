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
import RiderApplicationCreatePage from "main/pages/RiderApplication/RiderApplicationCreatePage";
import RiderApplicationEditPage from "main/pages/RiderApplication/RiderApplicationEditPage";
import RiderApplicationIndexPage from "main/pages/RiderApplication/RiderApplicationIndex";




import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";


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
          hasRole(currentUser, "ROLE_USER")
        }
        {
          (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "MEMBER") )&& <Route exact path="/apply/rider" element={<RiderApplicationIndexPage />} />
        }
        {
          (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "MEMBER") )&& <Route exact path="/apply/rider/create" element={<RiderApplicationCreatePage />} />
        }
        {
          (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "MEMBER") )&& <Route exact path="/apply/rider/show/:id" element={<RiderApplicationEditPage />} />
        }
        {
          (hasRole(currentUser, "ROLE_ADMIN"))&& <Route exact path="/admin/applications/riders" element={<RiderApplicationIndexPage />} />
        }
        {
          (hasRole(currentUser, "ROLE_ADMIN"))&& <Route exact path="/admin/applications/riders/review/:id" element={<RiderApplicationEditPage />} />
        }
        
        <Route exact path="/*" element={<PageNotFound />} />
        <Route exact path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
