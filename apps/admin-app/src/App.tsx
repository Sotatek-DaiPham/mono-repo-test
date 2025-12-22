import { AppProviders } from './app/providers';
import { HomePage } from './pages/home';

function App() {
  return (
    <AppProviders>
      <HomePage />
    </AppProviders>
  );
}

export default App;

