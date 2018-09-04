import { all, take, call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { Record } from 'immutable';
import axios from 'axios';

/**
 * Constants
 * */

export const moduleName = 'auth';
const prefix = `${moduleName}`;

export const SIGN_UP_REQUEST = `${prefix}/SIGN_UP_REQUEST`;
export const SIGN_UP_SUCCESS = `${prefix}/SIGN_UP_SUCCESS`;
export const SIGN_UP_ERROR = `${prefix}/SIGN_UP_ERROR`;

export const SIGN_IN_REQUEST = `${prefix}/SIGN_IN_REQUEST`;
export const SIGN_IN_ERROR = `${prefix}/SIGN_IN_ERROR`;
export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`;

export const SIGN_OUT_REQUEST = `${prefix}/SIGN_OUT_REQUEST`;
export const SIGN_OUT_SUCCESS = `${prefix}/SIGN_OUT_SUCCESS`;

export const CHECK_AUTH_REQUEST = `${prefix}/CHECK_AUTH_REQUEST`;
export const CHECK_AUTH_ERROR = `${prefix}/CHECK_AUTH_ERROR`;

/**
 * Reducer
 * */
export const ReducerRecord = Record({
  user: null,
  error: null,
  loading: false
});

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload, error } = action;

  switch (type) {
    case SIGN_UP_REQUEST:
    case SIGN_IN_REQUEST:
      return state.set('loading', true);

    case SIGN_UP_SUCCESS:
    case SIGN_IN_SUCCESS:
      return state
        .set('loading', false)
        .set('user', payload.user)
        .set('error', null);

    case SIGN_UP_ERROR:
    case SIGN_IN_ERROR:
    case CHECK_AUTH_ERROR:
      return state.set('loading', false).set('error', error);

    case SIGN_OUT_SUCCESS:
      return new ReducerRecord();

    case CHECK_AUTH_REQUEST:
      return state.set('loading', true);

    default:
      return state;
  }
}

/**
 * Selectors
 * */

/**
 * Action Creators
 * */

export function signUp(user) {
  return {
    type: SIGN_UP_REQUEST,
    payload: { user }
  };
}

export function signOut() {
  return {
    type: SIGN_OUT_REQUEST
  };
}

export function signIn(user) {
  return {
    type: SIGN_IN_REQUEST,
    payload: { user }
  };
}

export function checkAuth() {
  return {
    type: CHECK_AUTH_REQUEST
  };
}

/**
 * Functions
 * */

function signUpApi(user) {
  return axios
    .post('/api/users', { user })
    .then(res => res.data.user)
    .catch(error => {
      throw error;
    });
}

function loginApi(user) {
  return axios
    .post('/api/auth', { user })
    .then(res => res.data.user)
    .catch(error => {
      throw error;
    });
}

function checkTokenApi(token) {
  return axios
    .post('/api/auth/validate_token', { token })
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
}

function fetchUserApi() {
  return axios
    .get('/api/users/current_user')
    .then(res => res.data.user)
    .catch(error => {
      throw error;
    });
}

function setAuthorizationHeader(token = null) {
  if (token) {
    axios.defaults.headers.common.authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.authorization;
  }
}

// function checkAuth() {}

/**
 * Sagas
 * */
export function* signUpFlow() {
  // const auth = firebase.auth()

  while (true) {
    try {
      const action = yield take(SIGN_UP_REQUEST);
      const { user } = action.payload;

      const userData = yield call(signUpApi, user);
      localStorage.setItem('token', userData.token);
      yield call(setAuthorizationHeader, userData.token);

      yield put({
        type: SIGN_UP_SUCCESS,
        payload: { user: userData }
      });
      yield put(push('/admin/dashboard'));
    } catch (error) {
      yield put({
        type: SIGN_UP_ERROR,
        error
      });
    }
  }
}

export function* signInFlow() {
  while (true) {
    try {
      const action = yield take(SIGN_IN_REQUEST);
      const { user } = action.payload;
      const userData = yield call(loginApi, user);
      localStorage.setItem('token', userData.token);
      yield call(setAuthorizationHeader, userData.token);

      yield put({
        type: SIGN_IN_SUCCESS,
        payload: { user: userData }
      });
      yield put(push('/admin/dashboard'));
    } catch (error) {
      yield put({
        type: SIGN_IN_ERROR,
        error
      });
    }
  }
}

export function* fetchUserFlow() {
  const user = yield call(fetchUserApi);
  yield put({
    type: SIGN_IN_SUCCESS,
    payload: { user }
  });
}

export function* checkAuthFlow() {
  while (true) {
    try {
      yield take(CHECK_AUTH_REQUEST);

      const token = localStorage.getItem('token');

      if (token) {
        yield call(checkTokenApi, token);
        yield call(setAuthorizationHeader, token);
        yield call(fetchUserFlow);
      }
    } catch (error) {
      yield put({
        type: CHECK_AUTH_ERROR,
        error
      });
    }
  }
}

export const signOutSaga = function*() {
  try {
    localStorage.removeItem('token');

    yield put({
      type: SIGN_OUT_SUCCESS
    });
  } catch (_) {}
};

export const saga = function*() {
  yield all([
    signUpFlow(),
    signInFlow(),
    checkAuthFlow(),
    takeEvery(SIGN_OUT_REQUEST, signOutSaga)
  ]);
};
