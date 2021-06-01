import { createActions, createReducer } from "reduxsauce";
import { Actions, SetOrderAction, SetPageAction, SetPerPageAction, SetResetAction, SetSearchAction, State, UpdateExtraFilterAction } from "./types";

export const { Types, Creators } = createActions<{
  SET_SEARCH: string,
  SET_PAGE: string,
  SET_PER_PAGE: string,
  SET_ORDER: string,
  SET_RESET: string,
  UPDATE_EXTRA_FILTER: string,
}, {
  setSearch(payload: SetSearchAction['payload']): SetSearchAction,
  setPage(payload: SetPageAction['payload']): SetPageAction,
  setPerPage(payload: SetPerPageAction['payload']): SetPerPageAction,
  setOrder(payload: SetOrderAction['payload']): SetOrderAction,
  setReset(payload: SetResetAction['payload']): SetResetAction,
  updateExtraFilter(payload: UpdateExtraFilterAction['payload']): UpdateExtraFilterAction,
}>({
  setSearch: ['payload'],
  setPage: ['payload'],
  setPerPage: ['payload'],
  setOrder: ['payload'],
  setReset: ['payload'],
  updateExtraFilter: ['payload'],
});

export const INITIAL_STATE: State = {
  search: null,
  pagination: {
    page: 1,
    perPage: 10,
  },
  order: {
    sort: null,
    dir: null,
  }
};

const reducer = createReducer<State, Actions>(INITIAL_STATE, {
  [Types.SET_SEARCH]: setSearch,
  [Types.SET_PAGE]: setPage,
  [Types.SET_PER_PAGE]: setPerPage,
  [Types.SET_ORDER]: setOrder,
  [Types.SET_RESET]: setReset,
  [Types.UPDATE_EXTRA_FILTER]: updateExtraFilter,
});

function setSearch(state = INITIAL_STATE, action: SetSearchAction): State {
  return {
    ...state,
    search: action.payload.search,
    pagination: {
      ...state.pagination,
      page: 1
    }
  };
}

function setPage(state = INITIAL_STATE, action: SetPageAction): State {
  return {
    ...state,
    pagination: {
      ...state.pagination,
      page: action.payload.page,
    }
  };
}

function setPerPage(state = INITIAL_STATE, action: SetPerPageAction): State {
  return {
    ...state,
    pagination: {
      ...state.pagination,
      perPage: action.payload.perPage,
    }
  };
}

function setOrder(state = INITIAL_STATE, action: SetOrderAction): State {
  return {
    ...state,
    pagination: {
      ...state.pagination,
      page: 1
    },
    order: {
      ...state.order,
      sort: action.payload.sort,
      dir: action.payload.dir,
    }
  };
}

function setReset(state = INITIAL_STATE, action: SetResetAction): State {
  return action.payload.state;
}

function updateExtraFilter(state= INITIAL_STATE, action: UpdateExtraFilterAction): State {
  return {
    ...state,
    extraFilter: {
      ...state.extraFilter,
      ...action.payload
    }
  }
}

export default reducer;