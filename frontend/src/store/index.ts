import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from 'redux-saga';
import rootSaga from "./root-saga";
import upload from "./uploads";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({
    upload
  }),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;