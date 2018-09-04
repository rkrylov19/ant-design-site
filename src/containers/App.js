import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Front from './front';
import Admin from './admin';

import 'antd/dist/antd.css';

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          {/* <Route path="/404" component={NotFound} /> */}
          <Route path="/admin" component={Admin} />
          <Route component={Front} />
        </Switch>
      </div>
    );
  }
}

export default App;
