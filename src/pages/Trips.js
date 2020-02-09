import React, {Component} from 'react';
import Navbar from '../components/navbar';
import '../assets/css/trips.css';
import {formatDate} from  '../assets/js/utility';
import {BASE_URL,REQUIRE_ERROR,NUMBER_LABEL} from '../assets/js/constants';
import $ from 'jquery';

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
        

    }
    // handleSubmit(event){
    //     event.preventDefault();
    //     this.setState({buttonText : <PageSpinner color='light'/>});
    //     const form = {
    //       "idClasse":this.state.selectedClass,
    //       "id_brand":this.state.selectedBrand,
    //       "place_number":this.state.place_number,
    //       "registration":this.state.registration,
    //       "description" : this.state.description
    //     }
        
    //     const response = axios.post(
    //       BASE_URL+'/api/backoffice/vehicule/save',
    //       form,
    //       {headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+localStorage.getItem('accessToken') }})
    //       .then((response) => {
    //         if(response.status == 201){
    //           getAllVehicule()
    //           .then(response =>{
    //             this.setState({vehicles : response})
    //           })
    //           .catch(error => { this.setState({error : error.message}) });
    //         }
    //         this.setState({buttonText : 'submit'});
    //       })
    //       .catch((error) => {
    //         this.setState({buttonText : 'submit'});
    //         this.setState({insertError : <ErrorCard error={error} source="new vehicle" />
    //         })
    //       });
    //   }
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
        
      if(this.props.location.data){
          this.setState({selectedDep : this.props.location.data[0]});
          this.setState({selectedArr : this.props.location.data[1]});
          this.setState({date : this.props.location.data[2]});
          this.setState({number : this.props.location.data[3]});
      }
    }
    handleSearch(event){
        event.preventDefault();
        if(this.state.selectedDep !== "" && this.state.selectedDep !== "" && this.state.date !== "" && this.state.number !== NUMBER_LABEL ){

            $.get(BASE_URL+'/api/public/trips', { 
                'depart':this.state.selectedDep,
                'arrival':this.state.selectedArr,
                'date':this.state.date,
                'number':this.state.number },  
                    data => {     
                        if(data.length == 0){
                            this.setState({message : "aucun résultat"});
                        }
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

    render(){
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
        if(this.state.panier.length == 0){
            cond_panier = "dsp-none";
            cond_panier_for_info = "panier_show";
        }
        const listTrip = this.state.searchResult;
        var rows = [];
        const classe = this.state.classe;
        if(listTrip.length >0){

        
        listTrip.forEach((trip) => {
            if(classe == "all"){
                rows.push(
                    <div key={trip.id} className="item-trip card">
                        <p>{trip.departCity} - {trip.arrivalCity}</p>
                        <p>classe : {trip.classe}</p>
                    </div>
                );
            }else if(classe != "all" && trip.classe == classe){
                rows.push(
                    <div key={trip.id} className="item-trip card">
                        {trip.departCity} - {trip.arrivalCity}
                        classe : {trip.classe}
                    </div>
                );
            }
        });
    }
        return (
            <div>
            <div className="wrapper">
            <Navbar class="nav-border-bottom header-trip" lien="lien-grey" trip="active-blue" logo="logo2" activeColor="blue" menu="menu-item-trip">
                <div className=" menu-item"><button className="myButton green-btn">Se connecter</button></div>
            </Navbar>
            </div>
             <div className="wrap-body">
                <div className="itinerary ">
                    <div className="card-title blue">
                        <button className="title-button">1</button> <span>SÉLECTIONNER L'ITINÉRAIRE</span>
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
                                <input checked={this.state.time === 'apresMidi'} onChange={this.handleTimeChange} type="radio" name="horaire" value="apresMidi"/> Aprés-midi<br/>  
                                <input checked={this.state.time === 'soir'} onChange={this.handleTimeChange} type="radio" name="horaire" value="soir"/> Soir<br/>  
                                <p>className:</p>
                                <input checked={this.state.classe === 'all'} onChange={this.handleClassChange}  type="radio" name="classe" value="all"/> Tous<br/>
                                <input checked={this.state.classe === 'VIP'} onChange={this.handleClassChange} type="radio" name="classe" value="VIP"/> VIP<br/>
                                <input checked={this.state.classe === 'PREMIUM'} onChange={this.handleClassChange} type="radio" name="classe" value="PREMIUM"/> PREMIUM<br/>  
                                <input checked={this.state.classe === 'LITE'} onChange={this.handleClassChange} type="radio" name="classe" value="LITE"/> LITE<br/>  
                            </div>
                        </div>
                    </div>

                    {this.state.searchResult.length >0 && 
                    <div className="trips-container">
                        
                        <div className={"panier "+cond_panier}>
                            <div className="card-title blue">
                                <button className="title-button">4 </button> <span>VALIDER
                                </span>
                            </div>
                            <div className="card">
                                <h1>contenu ici</h1>
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
                        <div className="list">
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
export default Trips;