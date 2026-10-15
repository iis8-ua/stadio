import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireRole } from "./features/auth/RequireRole";
import { RequireProfile } from "./features/auth/RequireProfile";
import { LoginPage } from "./pages/LoginPage";
import { ClientLayout } from "./layouts/ClientLayout";
import { TrainerLayout } from "./layouts/TrainerLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ClientDashboard } from "./pages/client/ClientDashboard";
import { ClientTraining } from "./pages/client/ClientTraining";
import { ClientTrainingSessionDetail } from "./pages/client/ClientTrainingSessionDetail";
import { ClientWorkout } from "./pages/client/ClientWorkout";
import { ClientCreateWorkout } from "./pages/client/ClientCreateWorkout";
import { ClientProgress } from "./pages/client/ClientProgress";
import { ClientAI } from "./pages/client/ClientAI";
import { ClientBookings } from "./pages/client/ClientBookings";
import { ClientClassDetail } from "./pages/client/ClientClassDetail";
import { ClientBookingDetail } from "./pages/client/ClientBookingDetail";
import { ClientAccess } from "./pages/client/ClientAccess";
import { ClientProfile } from "./pages/client/ClientProfile";
import { ClientProfileAccess } from "./pages/client/ClientProfileAccess";
import { ClientProfileBookings } from "./pages/client/ClientProfileBookings";
import { ClientPayments } from "./pages/client/ClientPayments";
import { TrainerDashboard } from "./pages/trainer/TrainerDashboard";
import { TrainerClients } from "./pages/trainer/TrainerClients";
import { TrainerClientDetail } from "./pages/trainer/TrainerClientDetail";
import { TrainerWorkouts } from "./pages/trainer/TrainerWorkouts";
import { TrainerCreateWorkout } from "./pages/trainer/TrainerCreateWorkout";
import { TrainerClasses } from "./pages/trainer/TrainerClasses";
import { TrainerSchedule } from "./pages/trainer/TrainerSchedule";
import { TrainerAI } from "./pages/trainer/TrainerAI";
import { TrainerProfile } from "./pages/trainer/TrainerProfile";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminClients } from "./pages/admin/AdminClients";
import { AdminClientDetail } from "./pages/admin/AdminClientDetail";
import { AdminEmployees } from "./pages/admin/AdminEmployees";
import { AdminEmployeeDetail } from "./pages/admin/AdminEmployeeDetail";
import { AdminClasses } from "./pages/admin/AdminClasses";
import { AdminBookings } from "./pages/admin/AdminBookings";
import { AdminBookingDetail } from "./pages/admin/AdminBookingDetail";
import { AdminAccess } from "./pages/admin/AdminAccess";
import { AdminProfile } from "./pages/admin/AdminProfile";
import { AdminPayments } from "./pages/admin/AdminPayments";
import { AdminFacilities } from "./pages/admin/AdminFacilities";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";
import { AdminAI } from "./pages/admin/AdminAI";
import { AdminSettings } from "./pages/admin/AdminSettings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/client" element={<RequireRole role="client"><ClientLayout /></RequireRole>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="training" element={<ClientTraining />} />
          <Route path="training/session/:id" element={<ClientTrainingSessionDetail />} />
          <Route path="training/new" element={<ClientCreateWorkout />} />
          <Route path="training/workout" element={<ClientWorkout />} />
          <Route path="progress" element={<ClientProgress />} />
          <Route path="ai" element={<ClientAI />} />
          <Route path="bookings" element={<ClientBookings />} />
          <Route path="bookings/:id" element={<ClientClassDetail />} />
          <Route path="bookings/detail/:id" element={<ClientBookingDetail />} />
          <Route path="access" element={<ClientAccess />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="profile/payments" element={<ClientPayments />} />
          <Route path="profile/access" element={<ClientProfileAccess />} />
          <Route path="profile/bookings" element={<ClientProfileBookings />} />
        </Route>

        <Route path="/trainer" element={<RequireRole role="trainer"><TrainerLayout /></RequireRole>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TrainerDashboard />} />
          <Route path="clients" element={<RequireProfile profile="entrenador"><TrainerClients /></RequireProfile>} />
          <Route path="clients/:id" element={<RequireProfile profile="entrenador"><TrainerClientDetail /></RequireProfile>} />
          <Route path="clients/:clientId/session/:id" element={<RequireProfile profile="entrenador"><ClientTrainingSessionDetail /></RequireProfile>} />
          <Route path="workouts" element={<RequireProfile profile="entrenador"><TrainerWorkouts /></RequireProfile>} />
          <Route path="workouts/new" element={<RequireProfile profile="entrenador"><TrainerCreateWorkout /></RequireProfile>} />
          <Route path="classes" element={<RequireProfile profile="monitor"><TrainerClasses /></RequireProfile>} />
          <Route path="schedule" element={<TrainerSchedule />} />
          <Route path="ai" element={<TrainerAI />} />
          <Route path="profile" element={<TrainerProfile />} />
        </Route>

        <Route path="/admin" element={<RequireRole role="admin"><AdminLayout /></RequireRole>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="clients/:id" element={<AdminClientDetail />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="employees/:id" element={<AdminEmployeeDetail />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="bookings/:id" element={<AdminBookingDetail />} />
          <Route path="access" element={<AdminAccess />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="facilities" element={<AdminFacilities />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="ai" element={<AdminAI />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}