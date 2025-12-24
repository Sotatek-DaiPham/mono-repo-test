import { Routes, Route } from 'react-router-dom';
import { AppProviders } from './app/providers';
import { AdminLayout } from './widgets/layout/admin-layout';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { UsersPage } from './pages/users';
import { UIShowcasePage } from './pages/ui-showcase';
import { ProtectedRoute } from './shared/lib/auth/ProtectedRoute';
import { ROUTES } from './shared/constants/routes';

function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <AdminLayout>
                <HomePage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.USERS}
          element={
            <ProtectedRoute>
              <AdminLayout>
                <UsersPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route path={ROUTES.UI_SHOWCASE} element={<UIShowcasePage />} />
      </Routes>
    </AppProviders>
  );
}

export default App;

