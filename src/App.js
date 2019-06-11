import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ConnectionsPage from './containers/ConnectionsPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ConnectionsPage} />
      </Switch>
    </BrowserRouter>
  );
}


export default App;
