import { ReactElement } from 'react';
import { FaHome, FaUserAlt } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';
import { MdAdminPanelSettings, MdOutlinePets, MdOutlineWork } from 'react-icons/md';

interface NavItem {
  title: string;
  path: string;
  icon: ReactElement;
  admin?: boolean;
  superadmin?: boolean;
}

export const navConfig: NavItem[] = [
  // home
  {
    title: 'Inicio',
    path: '/dashboard/home',
    icon: <FaHome />,
  },

  {
    title: 'Animal de compañía',
    path: '/dashboard/mascotas',
    icon: <MdOutlinePets />,
  },
  {
    title: 'Veterinarios',
    path: '/dashboard/veterinarios',
    icon: <FaUserDoctor />,
    admin: true,
  },
  {
    title: 'Tutores',
    path: '/dashboard/tutores',
    icon: <FaUserAlt />,
    admin: true,
  },

  {
    title: 'Administradores',
    path: '/dashboard/administradores',
    icon: <MdAdminPanelSettings />,
    admin: true,
  },

  {
    title: 'Empresas',
    path: '/dashboard/empresas',
    icon: <MdOutlineWork />,
    superadmin: true,
  },
];
