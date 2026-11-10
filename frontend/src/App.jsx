import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './features/auth/pages/LoginPage.jsx';
import RegisterPage from './features/auth/pages/RegisterPage.jsx';
import VerifyPage from './features/auth/pages/VerifyPage.jsx';
import IntroPage from './features/intro/pages/IntroPage.jsx';
import PollDetailPage from './features/polls/pages/PollDetailPage.jsx';
import PollsPage from './features/polls/pages/PollsPage.jsx';
import RestaurantDetailPage from './features/restaurants/pages/RestaurantDetailPage.jsx';
import RestaurantsPage from './features/restaurants/pages/RestaurantsPage.jsx';
import SpotsPage from './features/spots/pages/SpotsPage.jsx';
import VisitLogPage from './features/visits/pages/VisitLogPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<IntroPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify" element={<VerifyPage />} />

        {/* Harshitha: Kitchen Reports (public) */}
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="restaurants/:id" element={<RestaurantDetailPage />} />

        {/* Private: logged-in users only */}
        <Route element={<ProtectedRoute />}>
          {/* Harshitha: Visit Log */}
          <Route path="visits" element={<VisitLogPage />} />
          {/* Ayush: Group Picks & My Spots */}
          <Route path="polls" element={<PollsPage />} />
          <Route path="polls/:id" element={<PollDetailPage />} />
          <Route path="spots" element={<SpotsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
