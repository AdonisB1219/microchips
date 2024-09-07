import { Navigate, createBrowserRouter } from 'react-router-dom';

import { AuthRoutes } from '../AuthRoutes';

import { AuthLayout } from '@/auth/layout';

import {
  AdmisnPage,
  CreateAdminPage,
  UpdateAdminPage,
} from '@/app/admin/pages';
import { DashboardHome } from '@/app/home/pages/DashboardHome';
import { AppLayout } from '@/app/layouts';
import {
  CreatePetPage,
  PestPage,
  UpdatePetPage,
  ViewPet,
} from '@/app/pets/pages';
import {
  CreateTutorPage,
  TutosrPage,
  UpdateTutorPage,
} from '@/app/propietarios/pages';
import {
  CreateVeterinarioPage,
  UpdateVeterinarioPage,
  VeterinarisoPage,
} from '@/app/veterinarios/pages';
import { LoginPage } from '@/auth/pages';
import { PrivateRoutes } from '../PrivateRoutes';
import { EmpresasPage } from '@/app/empresas/pages/EmpresasPage';
import { CreateEmpresaPage } from '@/app/empresas/pages';
import UpdateEmpresaPage from '@/app/empresas/pages/UpdateEmpresaPage/UpdateEmpresaPage';

const AppRouter = createBrowserRouter([
  ///* Free Routes


  ////* Auth
  {
    path: '/',
    element: (
      <AuthRoutes>
        <AuthLayout />
      </AuthRoutes>
    ),
    children: [{ path: '/', element: <LoginPage /> }],
  },

  ////* Private Routes
  {
    path: '/dashboard',
    element: (
      <PrivateRoutes>
        <AppLayout />
      </PrivateRoutes>
    ),
    children: [
      ///* Home
      {
        path: 'home',
        element: <DashboardHome />,
      },

      ////* Pets
      {
        path: 'mascotas',
        element: <PestPage />,
      },
      {
        path: 'mascotas/registrar',
        element: <CreatePetPage />,
      },
      {
        path: 'mascotas/editar/:id',
        element: <UpdatePetPage />,
      },
      {
        path: 'mascotas/ver/:id',
        element: <ViewPet />,
      },

      ///* veterinarios
      {
        path: 'veterinarios',
        element: <VeterinarisoPage />,
      },
      {
        path: 'veterinarios/crear',
        element: <CreateVeterinarioPage />,
      },
      {
        path: 'veterinarios/editar/:id',
        element: <UpdateVeterinarioPage />,
      },

      ///* tutors
      {
        path: 'tutores',
        element: <TutosrPage />,
      },
      {
        path: 'tutores/crear',
        element: <CreateTutorPage />,
      },
      {
        path: 'tutores/editar/:id',
        element: <UpdateTutorPage />,
      },

      ////* admins
      {
        path: 'administradores',
        element: <AdmisnPage />,
      },
      {
        path: 'administradores/crear',
        element: <CreateAdminPage />,
      },
      {
        path: 'administradores/editar/:id',
        element: <UpdateAdminPage />,
      },

      { path: '*', element: <Navigate to="/" /> },


      //* empresas
      {
        path: 'empresas',
        element: <EmpresasPage />,
      },
      {
        path: 'empresas/crear',
        element: <CreateEmpresaPage />,
      },
      {
        path: 'empresas/editar/:id',
        element: <UpdateEmpresaPage />,
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
]);

export default AppRouter;
