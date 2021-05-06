import { RouteProps as RouterDomRouteProps } from 'react-router-dom';
import { Dashboard, CategoryList, CastMemberList, GenreList } from '../pages';

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
    component: CategoryList,
    exact: true
  },
  {
    name: 'cast_members.list',
    label: 'Listar membros do elenco',
    path: '/cast_members',
    component: CastMemberList,
    exact: true
  },
  {
    name: 'genres.list',
    label: 'Listar gêneros',
    path: '/genres',
    component: GenreList,
    exact: true
  },
];

export default routes;