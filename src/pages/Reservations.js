import React, {Component} from 'react';
import '../assets/css/reservation.css';
import axios from 'axios';
import Navbar from '../components/navbar';
import { getMyReservations } from '../assets/js/APIutils';
import { withRouter } from "react-router";
import Vehicule from '../components/vehicule';
import {getschedule ,getTime,formatDateDisplay} from  '../assets/js/utility';
import {BASE_URL,LOGIN_ERROR} from '../assets/js/constants';
import moment from 'moment'

class Reservations extends Component{
    constructor(props){
        super(props);
        this.state ={
            trips : [],
            errors : [],
            total : 0
        }
        this.payAll = this.payAll.bind(this);
        this.payOne = this.payOne.bind(this);
    }
    componentDidMount(){
        moment().format('YYYY MM DD');
        if(!localStorage.getItem("accessToken")){
            this.props.history.push("/login");
        }
        getMyReservations()
        .then(response =>{
            this.setState({trips : response});
        })
        .catch(error => { 
            console.log(error);
            this.state.errors.push("trips : "+error.message);
        });
    }
    setPrice(total1){
        this.setState({total : total1});
    }
    payOne(trip){
        let trips =[];
        trips.push(trip);
        const form = JSON.stringify(trips);
        console.log(form);
        axios.post(BASE_URL+'/api/web/bill/save',form,{headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+localStorage.getItem('accessToken') }})
        .then((resp) => {
          if(resp){
            getMyReservations()
        .then(response =>{
            this.setState({trips : response});
        })
        .catch(error => { 
            console.log(error);
            this.state.errors.push("trips : "+error.message);
        });
          }  
        })
        .catch((error) => {
          console.log(error)
        });
    }
    payAll(){
        let invalids = [];
        const form = this.state.trips;
        form.forEach((item) => {
            if(item.etat < 10){
                invalids.push(item);
            }
        }
        );
        const value = JSON.stringify(invalids);
        // console.log(value);
        axios.post(BASE_URL+'/api/web/bill/save',value,{headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+localStorage.getItem('accessToken') }})
        .then((resp) => {
          if(resp){
            getMyReservations()
        .then(response =>{
            this.setState({trips : response});
        })
        .catch(error => { 
            console.log(error);
            this.state.errors.push("trips : "+error.message);
        });
          }  
        })
        .catch((error) => {
          console.log(error)
        });
    }
    render(){
        const panier = this.state.trips;
        let PanierRows = [];
        let total1 = 0;
        panier.forEach(
            (trip) => {
                if(trip.etat < 10){
                    total1 += trip.total;
                }
                PanierRows.push(
                
                <div key={trip.id} className={"item-trip card bg-tag "+trip.classe}>
                <div className="one">
                    <span className="code-min">Ar {trip.total}</span>
                </div>
                <div className="two">
                    <span className="code">{trip.depart_code}</span>
                    <span>{trip.depart_city}</span>
                </div>
                <div className="three">
                    <div className="self-top">
                        
                    </div>
                    <div className="fleche">-></div>
                    <div className="self-bottom">
                    <span className="legend legendActive"> {trip.number} </span>
                    </div>
                </div>
                <div className="four">
                    <span className="code">{trip.arrival_code}</span>
                    <span>{trip.arrival_city}</span>
                </div>
                <div className="five">
                    
                <p> <span className=" dep-info">{new Date(trip.date).toUTCString()}</span> <span className="color-red">{getschedule(trip.date)}</span></p>
                { trip.etat <10 && <button value={trip} onClick={() => {this.payOne(trip)}} className=" btn-template btn-template valider">payer</button>}
                { trip.etat >=10 && <button className=" btn-template paye ">payé</button>}
                
                    {/* <Vehicule panier={panier} data={panier}/> */}
                </div>
            </div>
            );}
        ); 
        // console.log(total1);
        // this.setPrice(total1);
        return(
            <div className="wrapper">
                <Navbar class="fixed-pos nav-border-bottom header-trip" infos="active-blue" lien="lien-grey" logo="logo2" activeColor="blue" menu="menu-item-trip" >
                    {/* <div onClick={() => {this.props.history.push("/login")}} className=" menu-item"><button className="myButton green-btn">Se connecter</button></div> */}
                </Navbar>

                <div className="reservation-list-container">
            <h2>Mes reservations<span> </span><button onClick={this.payAll} className="float-right btn-template btn-template valider">tout payer - {total1} Ar</button></h2>
            <h3>Si vous ne payez pas dans les 5 minutes <br/> qui suivent la commande, <br/>vos reservations seront annulés</h3>
                        {PanierRows}
                </div>
            </div>
        );
    }
}
export default withRouter(Reservations);


// CREER TABLE PAIEMENT
// MAPPING CLASSE
// REPOSITORY
// CONTROLLER-save(many like reservation){
//     -save pay
//     -update state
// }
// annuler dans 5 min

