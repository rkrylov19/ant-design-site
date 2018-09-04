import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

class PrivateRoute extends Component {
  render() {
    const { component: Component, auth, ...rest } = this.props;
    const token = localStorage.getItem('token');
    if (!token) return <Redirect to="/admin" />;
    return (
      <Route
        {...rest}
        render={props => (auth ? <Component {...props} /> : 'Error page')}
      />
    );
  }
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  auth: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    auth: !!state.auth.user
  };
}

export default connect(mapStateToProps)(PrivateRoute);
