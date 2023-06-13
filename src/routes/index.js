import { useRoutes } from 'react-router-dom';

/* MAIN */
import SignUpPage from 'pages/main/signup';
import SignInPage from 'pages/main/signin';
import ForgotPasswordPage from 'pages/main/exceptions/forgot-password';
import PlatformUnderUpdate from 'pages/main/exceptions/platform-under-update';
import MainExceptionNotFoundPage from 'pages/main/exceptions/not-found';
import MainExceptionAccessRestrictedPage from 'pages/main/exceptions/access-restricted';
import MainExceptionLogosPage from 'pages/main/exceptions/logos';

/* ADMIN */
import AdminDashboardPage from 'pages/admin/dashboard';
import AdminMyAccountPage from 'pages/admin/myaccount';
import AdminClientsPage from 'pages/admin/clients';
import AdminCnaesPage from 'pages/admin/cnaes';
import AdminLicensesPage from 'pages/admin/licenses';
import AdminUsersPage from 'pages/admin/users';

/* CLIENT */
import ClientDashboardPage from 'pages/client/dashboard';
import ClientMyAccountPage from 'pages/client/myaccount';
import ClientSupportPage from 'pages/client/support';
import ClientCompaniesPage from 'pages/client/companies';
import ClientCompaniesReadPage from 'pages/client/companies/read';
import ClientCompaniesPanelPage from 'pages/client/companies/panel';
import ClientCompaniesLicensesPage from 'pages/client/companies/licenses';
import ClientCompaniesDocumentsPage from 'pages/client/companies/documents';
import ClientCompaniesDataPage from 'pages/client/companies/data';
import ClientCompaniesCNPJsPage from 'pages/client/companies/cnpjs';
import ClientUsersPage from 'pages/client/users';

/* ICONS */
import { RiArrowLeftLine, RiDashboardLine, RiStore2Line } from 'react-icons/ri';
import { AiOutlineDashboard } from 'react-icons/ai';
import { FiUser, FiUsers, FiSmile, FiHome, FiFileText } from 'react-icons/fi';

import DefaultLayout from 'layouts/default';
import AuthLayout from 'layouts/auth';

import ProtectedRoute from './ProtectedRoute';

export default function Routes() {
  let routes = useRoutes([
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          name: 'Entrada',
          path: '',
          element: <SignInPage />,
        },
        {
          name: 'Cadastro',
          path: 'signup',
          element: <SignUpPage />,
        },
        {
          name: 'Esqueci a Senha',
          path: 'forgot-password',
          element: <ForgotPasswordPage />,
        },
        {
          name: 'Plataforma em atualização',
          path: 'platform-under-update',
          element: <PlatformUnderUpdate />,
        },
        {
          name: 'Logos eConform',
          path: 'logos',
          element: <MainExceptionLogosPage />,
        },
        {
          name: 'Acesso Restrito',
          path: 'access-restricted',
          element: <MainExceptionAccessRestrictedPage />,
        },
        {
          name: 'Não encontrado',
          path: '*',
          element: <MainExceptionNotFoundPage />,
        },
      ],
    },
    {
      path: 'admin',
      element: (
        <DefaultLayout
          routesStore={[
            {
              category: 'Administração',
              path: '/admin/',
              role: ['ECONFORM', 'PARTNER'],
              items: [
                {
                  name: 'Clientes',
                  role: ['ECONFORM', 'PARTNER'],
                  path: 'clients',
                  icon: FiSmile,
                },
              ],
            },
            {
              category: 'Gestão de Dados',
              path: '/admin/',
              role: ['ECONFORM'],
              items: [
                {
                  name: 'CNAEs',
                  role: ['ECONFORM'],
                  path: 'cnaes',
                  icon: FiHome,
                },
                {
                  name: 'Licenças',
                  role: ['ECONFORM'],
                  path: 'licenses',
                  icon: FiFileText,
                },
              ],
            },
            {
              category: 'Configuração',
              path: '/admin/',
              role: ['ECONFORM'],
              items: [
                {
                  name: 'Usuários',
                  role: ['ECONFORM'],
                  path: 'users',
                  icon: FiUsers,
                },
              ],
            },
          ]}
        />
      ),
      children: [
        {
          name: 'Dashboard',
          path: '',
          icon: RiDashboardLine,
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER']}>
              <AdminClientsPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Minha conta',
          path: 'myaccount',
          icon: FiUser,
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER']}>
              <AdminMyAccountPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Clientes',
          path: 'clients',
          icon: FiSmile,
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER']}>
              <AdminClientsPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'CNAEs',
          path: 'cnaes',
          icon: FiHome,
          element: (
            <ProtectedRoute role={['ECONFORM']}>
              <AdminCnaesPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Licenças',
          path: 'licenses',
          icon: FiFileText,
          element: (
            <ProtectedRoute role={['ECONFORM']}>
              <AdminLicensesPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Usuários',
          path: 'users',
          icon: FiUsers,
          element: (
            <ProtectedRoute role={['ECONFORM']}>
              <AdminUsersPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Acesso Restrito',
          path: 'access-restricted',
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER']}>
              <MainExceptionAccessRestrictedPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Não encontrado',
          path: '*',
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER']}>
              <MainExceptionNotFoundPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: 'client',
      element: (
        <DefaultLayout
          routesStore={[
            {
              category: 'Principal',
              path: '/client',
              role: ['ECONFORM', 'PARTNER', 'ADMIN', 'USER'],
              items: [
                {
                  name: 'Início',
                  role: ['ECONFORM', 'PARTNER', 'ADMIN', 'USER'],
                  path: '/dashboard',
                  icon: FiHome,
                },
              ],
            },
            {
              category: 'Administração',
              path: '/client',
              role: ['ECONFORM', 'PARTNER', 'ADMIN', 'USER'],
              items: [
                {
                  name: 'Empresas',
                  role: ['ECONFORM', 'PARTNER', 'ADMIN', 'USER'],
                  path: '/companies',
                  icon: RiStore2Line,
                },
              ],
            },
            {
              category: 'Configuração',
              path: '/client',
              role: ['ECONFORM', 'PARTNER', 'ADMIN', 'USER'],
              items: [
                {
                  name: 'Usuários',
                  role: ['ECONFORM', 'PARTNER', 'ADMIN', 'USER'],
                  path: '/users',
                  icon: FiUsers,
                },
              ],
            },
          ]}
        />
      ),
      children: [
        {
          name: 'Home',
          path: 'dashboard',
          icon: RiDashboardLine,
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER', 'ADMIN', 'USER']}>
              <ClientDashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Administração',
          path: '../admin',
          icon: AiOutlineDashboard,
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER']}>
              <ClientCompaniesPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Minha conta',
          path: 'myaccount',
          icon: FiUser,
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER', 'ADMIN', 'USER']}>
              <ClientMyAccountPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Empresas',
          path: 'companies',
          icon: RiStore2Line,
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER', 'ADMIN', 'USER']}>
              <ClientCompaniesPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Empresas',
          path: 'companies/:id',
          icon: RiStore2Line,
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER', 'ADMIN', 'USER']}>
              <ClientCompaniesReadPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Empresas',
          path: 'companies/:id/panel',
          icon: RiStore2Line,
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER', 'ADMIN', 'USER']}>
              <ClientCompaniesPanelPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Empresas',
          path: 'companies/:id/licenses',
          icon: RiStore2Line,
          element: (
            <ProtectedRoute role={['ECONFORM', 'ADMIN', 'USER']}>
              <ClientCompaniesLicensesPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Empresas',
          path: 'companies/:id/documents',
          icon: RiStore2Line,
          element: (
            <ProtectedRoute role={['ECONFORM', 'ADMIN', 'USER']}>
              <ClientCompaniesDocumentsPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Empresas',
          path: 'companies/:id/documents/:clientNationalRegistrationId',
          icon: RiStore2Line,
          element: (
            <ProtectedRoute role={['ECONFORM', 'ADMIN', 'USER']}>
              <ClientCompaniesDocumentsPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Empresas',
          path: 'companies/:id/documents/:clientNationalRegistrationId/:clientNationalRegistrationFiscalRegistrationId',
          icon: RiStore2Line,
          element: (
            <ProtectedRoute role={['ECONFORM', 'ADMIN', 'USER']}>
              <ClientCompaniesDocumentsPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Empresas',
          path: 'companies/:id/data',
          icon: RiStore2Line,
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER', 'ADMIN', 'USER']}>
              <ClientCompaniesDataPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Empresas',
          path: 'companies/:id/cnpjs',
          icon: RiStore2Line,
          element: (
            <ProtectedRoute role={['ECONFORM', 'ADMIN', 'USER']}>
              <ClientCompaniesCNPJsPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Suporte',
          path: 'support',
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER', 'ADMIN', 'USER']}>
              <ClientSupportPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Usuários',
          path: 'users',
          icon: FiUsers,
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER', 'ADMIN', 'USER']}>
              <ClientUsersPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Acesso Restrito',
          path: 'access-restricted',
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER', 'ADMIN', 'USER']}>
              <MainExceptionAccessRestrictedPage />
            </ProtectedRoute>
          ),
        },
        {
          name: 'Não encontrado',
          path: '*',
          element: (
            <ProtectedRoute role={['ECONFORM', 'PARTNER', 'ADMIN', 'USER']}>
              <MainExceptionNotFoundPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return routes;
}
