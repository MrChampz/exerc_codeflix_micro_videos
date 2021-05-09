import { RouteProps as RouterDomRouteProps } from 'react-router-dom';
import { Dashboard, CategoryList, CastMemberList, GenreList, CategoryCreate, GenreCreate, CastMemberCreate } from '../pages';

export interface RouteProps extends RouterDomRouteProps {
  name: string;
  label: string;
}

const routes: RouteProps[] = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    path: '/',
    component: Dashboard,
    exact: true
  },
  {
    name: 'categories.list',
    label: 'Listar categorias',
    path: '/categories',
    component: CategoryList,
    exact: true
  },
  {
    name: 'categories.create',
    label: 'Criar categoria',
    path: '/categories/create',
    component: CategoryCreate,
    exact: true
  },
  {
    name: 'cast_members.list',
    label: 'Listar membros de elencos',
    path: '/cast_members',
    component: CastMemberList,
    exact: true
  },
  {
    name: 'cast_members.create',
    label: 'Criar membro de elenco',
    path: '/cast_members/create',
    component: CastMemberCreate,
    exact: true
  },
  {
    name: 'genres.list',
    label: 'Listar gêneros',
    path: '/genres',
    component: GenreList,
    exact: true
  },
  {
    name: 'genres.create',
    label: 'Criar gênero',
    path: '/genres/create',
    component: GenreCreate,
    exact: true
  },
];

export default routes;