import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import { connect } from 'react-redux';

import PrivateRoute from '../../component/PrivateRoute';

import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import Dashboard from './dashboard';

class Admin extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/admin" component={LoginPage} />
          <Route path="/admin/signup" component={SignupPage} />
          <PrivateRoute path="/admin/dashboard" component={Dashboard} />
          {/* <Route path="/" component={ForgotPasswordPage} />
          <Route path="/" component={ResetPasswordPage} /> */}
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: !!state.auth.user
  };
}

export default connect(mapStateToProps)(Admin);
