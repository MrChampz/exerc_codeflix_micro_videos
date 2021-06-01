import { AnyAction } from 'redux';

export interface Pagination {
  page: number;
  perPage: number;
}

export interface Order {
  sort: string | null;
  dir: string | null;
}

export interface State {
  search: string | { value, [key: string]: any } | null;
  pagination: Pagination;
  order: Order;
  extraFilter?: { [key: string]: any }
}

export interface SetSearchAction extends AnyAction {
  payload: {
    search: string | { value, [key: string]: any } | null
  }
}

export interface SetPageAction extends AnyAction {
  payload: {
    page: number
  }
}

export interface SetPerPageAction extends AnyAction {
  payload: {
    perPage: number
  }
}

export interface SetOrderAction extends AnyAction {
  payload: {
    sort: string | null,
    dir: string | null
  }
}

export interface SetResetAction extends AnyAction {
  payload: {
    state: State
  }
}

export interface UpdateExtraFilterAction extends AnyAction {
  payload: { [key: string]: any }
}

export type Actions = SetSearchAction |
                      SetPageAction |
                      SetPerPageAction |
                      SetOrderAction |
                      SetResetAction |
                      UpdateExtraFilterAction;