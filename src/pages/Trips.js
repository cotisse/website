import React, {Component} from 'react';
import Navbar from '../components/navbar';
import Vehicule from '../components/vehicule';
import '../assets/css/trips.css';
import {formatDate,getschedule ,getTime} from  '../assets/js/utility';
import {BASE_URL,REQUIRE_ERROR,NUMBER_LABEL} from '../assets/js/constants';
import $ from 'jquery';
import { withRouter } from "react-router";

class Trips extends Component{
    constructor(props){
        super(props);
        this.state = {
            cities : [],
            error : "",
            selectedDep : "",
            selectedArr : "",
            date : "",
            number : NUMBER_LABEL,
            time : "all",
            classe : "all",
            depError : "",
            arrError : "",
            dateError : "",
            numberError : "",
            searchResult :"",
            message:"faites une recherche",
            panier:[]
        }
        this.handlePlus = this.handlePlus.bind(this);
        this.handleMoins = this.handleMoins.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleClassChange = this.handleClassChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleClickPlace = this.handleClickPlace.bind(this);
        this.validateCart = this.validateCart.bind(this);
        
    }
    componentDidMount(){
        fetch(BASE_URL+"/api/public/cities")
        .then(res => res.json())
        .then(
            (result) => {
              this.setState({
                cities: result
              });
            },
            (error) => {
                console.log("error be : "+error);
                this.setState({ error : error});
            }
        );
        
        if(this.props.location.data ){
            this.setState({selectedDep : this.props.location.data[0]});
            this.setState({selectedArr : this.props.location.data[1]});
            this.setState({date : this.props.location.data[2]});
            this.setState({number : this.props.location.data[3]});
            $.get(BASE_URL+'/api/public/trips', { 
            'depart':this.props.location.data[0],
            'arrival':this.props.location.data[1],
            'date':this.props.location.data[2],
            'number':this.props.location.data[3] },  
                data => {     
                    if(data.length == 0){
                        this.setState({message : "aucun résultat"});
                    }
                    this.setState({searchResult : data});
                    // localStorage.setItem("values",JSON.stringify(data));
                }
            );
        }
    }
    handleSearch(event){
        event.preventDefault();
        if(this.state.selectedDep !== "" && this.state.selectedArr !== "" && this.state.date !== "" && this.state.number !== NUMBER_LABEL ){
            $.get(BASE_URL+'/api/public/trips', { 
                'depart':this.state.selectedDep,
                'arrival':this.state.selectedArr,
                'date':this.state.date,
                'number':this.state.number },  
                    data => {     
                        if(data.length == 0){
                            this.setState({message : "aucun résultat"});
                        }
                        console.log(data);
                        this.setState({searchResult : data});
                    }
                );
        }
    }
    
    handleTimeChange(event){
        this.setState({
            time : event.target.value
          });
    }
    handleClassChange(event){
        this.setState({
            classe : event.target.value
          });
    }
    handlePlus(event){
        event.preventDefault();
        let n = this.state.number;
        if(n === NUMBER_LABEL ){
            this.setState({number : 1,numberError:""});

        }
        else if(n < 4){
            n++;
            this.setState({number : n});
        }
    }
    handleMoins(event){
        event.preventDefault();
        let n = this.state.number;
        if(n >1 && n !== ""){
            n--;
            this.setState({number : n});
        }
       
    }
    handleClickPlace(place){
        let panier = this.state.panier;
        let contain = false;
        for(let i = 0 ; i < panier.length ; i++){
            if(panier[i].id_place == place.id_place && panier[i].idTrip == place.idTrip){
                console.log("mitovy");
                contain = true;
                panier.splice(i,1);
            }
        }
        if(!contain){
            if(this.state.panier.length < 4){
               
                var joined = this.state.panier.concat(place);
                this.setState({ panier: joined })
            }
        }else{
            var removed = panier;
            this.setState({ panier: removed })

        }
        // console.log(place);
    }
    validateCart(){
        const panier = this.state.panier;
        this.props.history.push({
            pathname: '/login',
            state:{panier : panier}
        }
        );
    }
    render(){
        const panier = this.state.panier;
        var panierItems = [];
        var prixTotal = 0 ;
        panier.forEach(
            (item) => {
                prixTotal += item.total;
            }
        );

        const cities = this.state.cities;
        var depOptions = cities.map((item1) =>
            <option selected={this.state.selectedDep == item1.id} key={item1.id} value={item1.id}>{item1.label}</option>
        );
        var arrOptions = cities.map((item2) =>
            <option selected={this.state.selectedArr == item2.id} key={item2.id} value={item2.id}>{item2.label}</option>
        );
        var currdate = formatDate();
        var cond_panier = "";
        var cond_panier_for_info = "";
        var cond_panier_for_list = "";
        if(this.state.panier.length == 0){
            cond_panier = "dsp-none";
        }else{
            cond_panier_for_info = "panier_show";
            cond_panier_for_list = "panier_show_list";
            cond_panier = "";
        }
      
        const listTrip = this.state.searchResult;

        var rows = [];
        const classe = this.state.classe;
        const schedule = this.state.time;
       
        if(listTrip.length >0){
            listTrip.forEach((trip) => {
                if(classe != "all" && classe != trip.classe){
                    return;
                }
                if(schedule !== "all" && schedule != getschedule(trip.departureDate)){
                    return;
                }
                rows.push(
                    <div key={trip.id} className={"item-trip card bg-tag "+trip.classe}>
                        <div className="one">
                            <span className="code-min">Ar {trip.total}</span>
                        </div>
                        <div className="two">
                            <span className="code">{trip.departCode}</span>
                            <span>{trip.departCity}</span>
                        </div>
                        <div className="three">
                            <div className="self-top">
                                <p>départ: <span className="code dep-info">{getTime(trip.departureDate)}</span> {getschedule(trip.departureDate)}</p>
                            </div>
                            <div>-></div>
                            <div>
                                Places libres: <span className="code-min">{trip.libre - 1}</span>
                            </div>
                        </div>
                        <div clclassNameass="four">
                            <span className="code">{trip.arrivalCode}</span>
                            <span>{trip.arrivalCity}</span>
                        </div>
                        <div className="five">
                            <Vehicule panier={this.state.panier} onClickPlace={this.handleClickPlace} data={trip.places}/>
                        </div>
                        {/* <p>{trip.departCity} - {trip.arrivalCity}</p>
                        <p>classe : {trip.classe}</p>
                        <p>departureDate : {trip.departureDate}</p>
                        <p>départ : {getTime(trip.departureDate)+" "+getschedule(trip.departureDate)}</p> */}
                    </div>
                ); 
            });
        }
        return (
            <div>
            <div className="wrapper">
            <Navbar class="nav-border-bottom header-trip" lien="lien-grey" trip="active-blue" logo="logo2" activeColor="blue" menu="menu-item-trip" >
                <div onClick={() => {this.props.history.push("/login")}} className=" menu-item"><button className="myButton green-btn">Se connecter</button></div>
            </Navbar>
            </div>
             <div className="wrap-body">
                <div className="itinerary ">
                    <div className="card-title blue">
                        <button className="title-button">1</button> <span> SÉLECTIONNER L'ITINÉRAIRE</span> 
                    </div>
                    <div className="card trip-inputs">
                        <div className="input-t-1 inputItem">    
                            <select name="test" className="myInputTrip" onChange={(e) => this.setState({selectedDep : e.target.value,depError : ""})} required>
                                <option key="haha" hidden>départ</option>
                                {depOptions}
                            </select>  
                        </div>
                        <div className="input-t-1">
                            <select className="myInputTrip" onChange={(e) => this.setState({selectedArr : e.target.value,arrError : ""})}>
                                <option key="haha" hidden>arrivé</option>
                                {arrOptions}
                            </select>
                        </div>
                        <div className="input-t-1">
                            <input value={this.state.date} id="myDate" className="myInputTrip" type="date" min={currdate} onChange={(e) => this.setState({date : e.target.value,dateError:""})} />
                        </div>
                        <div className="input-t-1 ">
                                <div className="flex-box-inline">
                                    <button onClick={this.handleMoins} className="btnNumber">-</button>
                                    <input disabled type="number" placeholder={this.state.number} className="myInputTrip centered_placeholer" onChange={(e) => this.setState({number : e.target.value})} required/>
                                    <button onClick={this.handlePlus} className="btnNumber">+</button>
                                </div>
                            <button onClick={this.handleSearch} className="w-20 search">search</button>
                        </div>
                    </div>
                </div>
                <div className="main-trip">
                    <div className="menu-filter">
                        <div className="card-title blue">
                            <button className="title-button">2</button> <span>FILTRE</span>
                        </div>
                        <div className="card">
                            <div className="radio-buttons">
                                <p>Horaires:</p>
                                <input checked={this.state.time === 'all'} onChange={this.handleTimeChange}  type="radio" name="horaire" value="all"/> Tous<br/>
                                <input checked={this.state.time === 'matin'} onChange={this.handleTimeChange} type="radio" name="horaire" value="matin"/> Matin<br/>
                                <input checked={this.state.time === 'après-midi'} onChange={this.handleTimeChange} type="radio" name="horaire" value="après-midi"/> Après-midi<br/>  
                                <input checked={this.state.time === 'soir'} onChange={this.handleTimeChange} type="radio" name="horaire" value="soir"/> Soir<br/>  
                                <input checked={this.state.time === 'nuit'} onChange={this.handleTimeChange} type="radio" name="horaire" value="nuit"/> nuit<br/>  
                                <p>classe:</p>
                                <input checked={this.state.classe === 'all'} onChange={this.handleClassChange}  type="radio" name="classe" value="all"/> Tous<br/>
                                <input checked={this.state.classe === 'VIP'} onChange={this.handleClassChange} type="radio" name="classe" value="VIP"/> VIP<br/>
                                <input checked={this.state.classe === 'PREMIUM'} onChange={this.handleClassChange} type="radio" name="classe" value="PREMIUM"/> PREMIUM<br/>  
                                <input checked={this.state.classe === 'LITE'} onChange={this.handleClassChange} type="radio" name="classe" value="LITE"/> LITE<br/>  
                            </div>
                        </div>
                    </div>

                    {this.state.searchResult.length >0 && 
                    // {rows.length >0 && 
                    <div className="trips-container">
                        
                        <div className={"panier "+cond_panier}>
                            <div className="card-title blue">
                                <button className="title-button">4 </button> <span>VALIDER
                                </span>
                            </div>
                            <div className="card le_panier">
                             <p >En cliquant sur Valider, vous acceptez <a className="term-link">les Termes & conditions.</a></p>
                             <hr className="dash"/>
                                 vos places : {panier.length}, Ar {prixTotal}
                                 <div className="buttons">

                                 <button onClick={this.validateCart} className=" btn-template valider">valider</button>
                                 <button className="btn-template supp" onClick={()=>{this.setState({panier : []})}}>supprimer</button>
                                 </div>
                            </div>
                            <div className="info card panier_not_vide">
                            <div className="info_item">
                                <span className="legend"> </span>Places libres
                            </div>
                            <div className="info_item">
                                <span className="legend disabled"> </span>Places occupées
                            </div>
                            <div className="info_item">
                                <span className="legend legendActive"> </span>Vos places
                            </div>
                            <div className="info_item"> 
                                <span className="legend chauffeur"> </span>Chauffeur
                            </div>
                        </div>
                        </div>
                       
                        <div className={"info card "+cond_panier_for_info}>
                            <div className="info_item">
                                <span className="legend"> </span>Places libres
                            </div>
                            <div className="info_item">
                                <span className="legend disabled"> </span>Places occupées
                            </div>
                            <div className="info_item">
                                <span className="legend legendActive"> </span>Vos places
                            </div>
                            <div className="info_item"> 
                                <span className="legend chauffeur"> </span>Chauffeur
                            </div>
                        </div>
                        <div className="title-3 ">
                            <div className="card-title blue">
                                <button className="title-button">3</button> <span>SÉLECTIONNER PLACE
                                </span>
                            </div>
                        </div>
                        <div className={"list "+cond_panier_for_list}>
                           {rows}
                        </div>
                 </div>}
                 {this.state.searchResult.length == 0 &&
                    <div className="message ">
                        <h1>{this.state.message}</h1>
                    </div>
                 }
                
             </div>
         </div>
         </div>
        );
    }
}
export default  withRouter(Trips);