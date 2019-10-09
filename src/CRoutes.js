import React from "react";
import { Route, Switch } from "react-router-dom";

import {Login, Home, Errors} from  "./views/";

// import zroutes from './zroutes';


const CRoutes = ({history}) => {
    return (
      <Switch>
      <Route exact path="/" component={Login} />
        <Route exact path="/dashboard" component={Home} />
        <Route exact path="/regions" component={Home} />
        <Route exact path="/regions/:id/locations" component={Home} />
        <Route exact path="/regions/:id/locations/:id/assets" component={Home} />
        <Route exact path="/assets" component={Home} />
        <Route exact path="/assets/:id" component={Home} />
        <Route exact path="/projects" component={Home} />
        <Route exact path="/reports" component={Home} />
        <Route
          render={function () {
            return <Errors />;
          }}
        />
        {
          /*routes.map((route, index) => {
            return (
              <Route key={index} exact={route.exact} path={route.path}  component={ props => { return (<route.component {...props}/>)}}/>
            )
          })*/
        }
      </Switch>
    );
}

export default CRoutes;
