import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import authReducer, { moduleName as authModule } from '../ducks/auth';

export default combineReducers({
  router,
  [authModule]: authReducer
});
