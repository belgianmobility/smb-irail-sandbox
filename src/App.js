import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ConnectionsPage from './containers/ConnectionsPage';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={ConnectionsPage} />
      </Switch>
    </div>
  );
}


export default App;
