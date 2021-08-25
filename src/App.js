import { func } from "prop-types";
import React, {Fragment} from "react"
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams } from "react-router-dom";
import "./App.css";
import CreatePoll from "./components/CreatePoll";
import Home from "./components/Home";
import Login from "./components/Login";
import { Button, NavDropdown } from 'react-bootstrap';
import Categories from "./components/Categories";
import OnePoll from "./components/OnePoll";

export default function App() {
  return (
    <Router>
    <div className="container">
        <nav className="nav navbar-left navbar navbar-default">
          <div className="container">
            <div className="navbar-header">
              <p className="navbar-brand">VOTE ON A POLL</p>
            </div>
              <ul className="nav navbar navbar-right">
                <li id="home"><Link to="/">HOME</Link></li>
                <NavDropdown
                  id="nav-dropdown-dark-example"
                  title="CATEGORY"
                >
                  <NavDropdown.Item><Link to="/category/education">Education</Link></NavDropdown.Item>
                  <NavDropdown.Item ><Link to="/category/sports">Sports</Link></NavDropdown.Item>
                  <NavDropdown.Item ><Link to="/category/movies">Movies</Link></NavDropdown.Item>
                </NavDropdown>
                <li id="create"><Link to="/create">CREATE A POLL</Link></li>
                <li id="login"><Link to="/login">LOGIN</Link></li>
              </ul>
          </div>
        </nav>

        <div >
          <Switch>
            <Route exact path="/category">
              <CategoryPage />
            </Route>
            
            <Route 
            exact 
            path="/category/education"
            render={(props) => <Categories {...props} title={`EDUCATION`} catId={1}/>}>
            </Route>
            <Route 
            exact 
            path="/category/sports"
            render={(props) => <Categories {...props} title={`SPORTS`} catId={2}/>}>
            </Route>
            <Route 
            exact 
            path="/category/movies"
            render={(props) => <Categories {...props} title={`MOVIES`} catId={3}/>}>
            </Route>
            <Route exact path="/create" component={CreatePoll}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/:id" component={OnePoll}/>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>

  );
}

function CategoryPage (){
  let {path, url} = useRouteMatch()

  return(
    <div>
      <h2>CategoryPage</h2>

      <ul>
        <li><Link to={`${path}/education`}>Education</Link></li>
        <li><Link to={`${path}/sports`}>Sports</Link></li>
        <li><Link to={`${path}/movies`}>Movies</Link></li>
      </ul>
    </div>
  )
}
