import { Routes, Route } from 'react-router-dom';
import { AppProviders } from './app/providers';
import { HomePage } from './pages/home';
import { UIShowcasePage } from './pages/ui-showcase';
import { ROUTES } from './shared/constants/routes';

function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.UI_SHOWCASE} element={<UIShowcasePage />} />
      </Routes>
    </AppProviders>
  );
}

export default App;

