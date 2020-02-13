import React, {Component} from 'react';
import axios from 'axios';
import {BASE_URL,LOGIN_ERROR} from '../assets/js/constants';
import '../assets/css/login.css';
import Navbar from '../components/navbar';
import { withRouter } from "react-router";
class Login extends Component{
    constructor(props){
        super(props);
        this.state=
         {
           phoneOrEmail : "",
           password : "",
           error : "",
           panier : []
         } 
         this.handleLogin = this.handleLogin.bind(this);
      }
    componentDidMount(){
      if(this.props.location.state){
        this.setState({panier : this.props.location.state.panier});
        console.log("PANIER : "+ this.props.location.state.panier);
      }else{
        console.log("tsisy e");
      }
    }
    async handleLogin(){
    const form = {
      "phoneOrEmail": this.state.phoneOrEmail,
      "password": this.state.password
      };
    const response = await axios.post(BASE_URL+'/api/auth/signin',form,
      {headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        if(response.status === 200){
          localStorage.setItem("accessToken", response.data.accessToken);
          
            // INSERER SI PANIER EXISTANT
            if(this.props.location.state){
              const form = JSON.stringify(this.state.panier);
              console.log(form);
              axios.post(BASE_URL+'/api/web/reservation/save',form,{headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+localStorage.getItem('accessToken') }})
              .then((resp) => {
                if(resp){
                  alert("inserted");
                  this.props.history.push("/reservations");
                }  
              })
              .catch((error) => {
                console.log(error)
              });
            }else{
              this.props.history.push("/reservations");
            }
        }
      }
      )
      .catch(
        (error) => {
          if (error) {
              console.log(error);
            this.setState({error: LOGIN_ERROR })
          }
        }
      );
    }
    render (){
        const error = this.state.error;
        return(
        <div className="wrapper">
          <Navbar class="nav-border-bottom header-trip" lien="lien-grey" logo="logo2" activeColor="blue" menu="menu-item-trip" >
              {/* <div onClick={() => {this.props.history.push("/login")}} className=" menu-item"><button className="myButton green-btn">Se connecter</button></div> */}
          </Navbar>
          <div className="card login-card">
          Veuiller vous connecter,
          <br/>
          <br/>
          il est nécéssaire de vous <br/>connecter pour enregistrer <br/> vos reservations
          <div>
          <input className="myInput log-input" value={this.state.phoneOrEmail} onChange={(e) => {this.setState({phoneOrEmail : e.target.value})}} type="text" placeholder="adresse e-mail ou téléphone"/>
          </div>
          <div>
          <input className="myInput log-input" value={this.state.password} onChange={(e) => {this.setState({password : e.target.value})}} type="password" placeholder="****"/>
          </div>
          <div>
          <button className="log-button btn-block btn-shadow-blue btn btn-info " onClick={this.handleLogin}>Se connecter</button>
          </div>
          <div className="error-card">
            {error}
          </div>
          </div>
        </div>

        );
    }
}
export default withRouter(Login);