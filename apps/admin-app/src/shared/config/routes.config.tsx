import { lazy } from 'react';
import { ROUTES } from '../constants/routes';

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/login').then(m => ({ default: m.LoginPage })));
const HomePage = lazy(() => import('@/pages/home').then(m => ({ default: m.HomePage })));
const UsersPage = lazy(() => import('@/pages/users').then(m => ({ default: m.UsersPage })));
const UIShowcasePage = lazy(() => import('@/pages/ui-showcase').then(m => ({ default: m.UIShowcasePage })));

export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<React.ComponentType<any>>;
  protected?: boolean;
  requireAdmin?: boolean;
  layout?: 'admin' | 'none';
  title?: string;
}

export const routes: RouteConfig[] = [
  {
    path: ROUTES.LOGIN,
    element: LoginPage,
    protected: false,
    layout: 'none',
    title: 'Login',
  },
  {
    path: ROUTES.HOME,
    element: HomePage,
    protected: true,
    requireAdmin: true,
    layout: 'admin',
    title: 'Dashboard',
  },
  {
    path: ROUTES.USERS,
    element: UsersPage,
    protected: true,
    requireAdmin: true,
    layout: 'admin',
    title: 'Users',
  },
  {
    path: ROUTES.UI_SHOWCASE,
    element: UIShowcasePage,
    protected: false,
    layout: 'none',
    title: 'UI Showcase',
  },
];

