import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import {Switch,Route} from 'react-router-dom';
import Home from './pages/Home';
import Trips from './pages/Trips';

function App() {
  return (
    <main>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/trips" component={Trips}/>
        </Switch>
    </main>
  );
}

export default App;
