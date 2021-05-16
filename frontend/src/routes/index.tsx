import { RouteProps as RouterDomRouteProps } from 'react-router-dom';
import {
  Dashboard,
  CategoryList,
  CastMemberList,
  GenreList, 
  CategoryForm, 
  GenreForm, 
  CastMemberForm 
} from '../pages';

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
    component: CategoryForm,
    exact: true
  },
  {
    name: 'categories.edit',
    label: 'Editar categoria',
    path: '/categories/:id/edit',
    component: CategoryForm,
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
    component: CastMemberForm,
    exact: true
  },
  {
    name: 'cast_members.edit',
    label: 'Editar membro de elenco',
    path: '/cast_members/:id/edit',
    component: CastMemberForm,
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
    component: GenreForm,
    exact: true
  },
  {
    name: 'genres.edit',
    label: 'Editar gênero',
    path: '/genres/:id/edit',
    component: GenreForm,
    exact: true
  },
];

export default routes;