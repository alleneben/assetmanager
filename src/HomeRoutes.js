import React from "react";
import { Route, Switch } from "react-router-dom";

import { Dashboard, Errors } from  "./views";
import * as c from './views/appspecific/'

const HomeRoutes = ({history}) => {
    return (
      <Switch>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/regions" component={c.Region} />
      <Route exact path="/regions/:id/locations" component={c.Location} />
      <Route exact path="/regions/:id/locations/:id/assets" component={c.Asset} />
      <Route exact path="/assets" component={c.Asset} />
      <Route exact path="/assets/:id" component={c.Detail} />
      <Route
        render={function () {
          return <Errors />;
        }}
      />
      </Switch>
    );
}

export default HomeRoutes;
