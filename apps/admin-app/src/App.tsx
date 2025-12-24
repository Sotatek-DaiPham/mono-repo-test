import { Routes, Route } from 'react-router-dom';
import { AppProviders } from './app/providers';
import { routes } from './shared/config/routes.config';
import { renderRoute } from './shared/lib/routing/route-renderer';

function App() {
  return (
    <AppProviders>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={renderRoute(route)}
          />
        ))}
      </Routes>
    </AppProviders>
  );
}

export default App;

