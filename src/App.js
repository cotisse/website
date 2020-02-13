import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import {Switch,Route} from 'react-router-dom';
import Home from './pages/Home';
import Trips from './pages/Trips';
import Login from './pages/Login';
import Reservations from './pages/Reservations';

function App() {
  return (
    <main>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/trips" component={Trips}/>
          <Route path="/login" component={Login}/>
          <Route path="/reservations" component={Reservations}/>
        </Switch>
    </main>
  );
}

export default App;
