import React, {Component} from 'react';
import mvola from '../assets/img/payment/mvola.jpg';
import om from '../assets/img/payment/om.jpg';
import paypal from '../assets/img/payment/logo-paypal-all.png';
import '../assets/css/component.css';
import '../assets/css/style.css';
import {formatDate} from  '../assets/js/utility';
import Navbar from '../components/navbar';
import {BASE_URL,REQUIRE_ERROR,NUMBER_LABEL} from '../assets/js/constants';
import { withRouter } from "react-router";

class Home extends Component{
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this);
        this.handlePlus = this.handlePlus.bind(this);
        this.handleMoins = this.handleMoins.bind(this);
        this.state = {
            cities : [],
            error : "",
            selectedDep : "",
            selectedArr : "",
            date : "",
            number : NUMBER_LABEL,
            depError : "",
            arrError : "",
            dateError : "",
            numberError : ""
        }
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
    handleClick(event){
        event.preventDefault();
        var ok = true;
        if(this.state.selectedDep === ""){
            this.setState({depError : REQUIRE_ERROR});
            ok = false;
        }
        if(this.state.selectedArr === ""){
            this.setState({arrError : REQUIRE_ERROR});   
            ok = false;
        }
        if(this.state.date === ""){
            this.setState({dateError : REQUIRE_ERROR});   
            ok = false;
        }
        if(this.state.number === NUMBER_LABEL || this.state.number === "" ){
            this.setState({numberError : REQUIRE_ERROR});
            ok = false;
        }
        if(ok){
            const dep = this.state.selectedDep;
            const arr = this.state.selectedArr;
            const date = this.state.date;
            const number = this.state.number;
            var data = [dep,arr,date,number];
            // this.props.history.push("/trips/"+dep+"/"+arr+"/"+date+"/"+number);
            this.props.history.push({
                pathname: '/trips',
                data: data
            });
        }
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
          this.setState({
            error
          });
          
        }
      );
    }
    Error(text){
        return(
        <span className="errorMessage">{text}</span>
        );
    }
    render(){
        const cities = this.state.cities;
        var options = cities.map((item) =>
            <option key={item.id} value={item.id}>{item.label}</option>
        );
        var currdate = formatDate();
        return(
            <div className="wrapper">
                <Navbar class="nav-padding nav-margin header-padding-responsive" lien="lien-white" home="active-white" logo="logo1">
                    <div className=" menu-item"><button className="myButton">+261 32 11 027 10 / 33</button></div>
                </Navbar>
                <div className="head">
                </div>
                <div className="main">
                    <div className="main1">
                        <h2 className="font-size-24" >Choisissez votre itinéraire</h2>
                        <div className="form-control">
                            <form>
                                <div className="">
                                    <select className="myInput" onChange={(e) => this.setState({selectedDep : e.target.value,depError : ""})} required>
                                        <option key="haha" hidden>départ</option>
                                        {options}
                                    </select>
                                </div>
                                {this.Error(this.state.depError)}
                                <br />
                                <div className="" >
                                    <select className="myInput" onChange={(e) => this.setState({selectedArr : e.target.value,arrError : ""})} required>
                                        <option hidden>arrivé</option>
                                        {options}
                                    </select>
                                </div>
                                {this.Error(this.state.arrError)}
                                <br />
                                <div className="">
                                    <input id="myDate" type="date" className="myInput" min={currdate} onChange={(e) => this.setState({date : e.target.value,dateError:""})} required/>
                                </div>
                                {this.Error(this.state.dateError)}
                                <br />
                                <div className="flex-box-inline">
                                   <button onClick={this.handleMoins} className="btnNumber">-</button>
                                   <input disabled type="number" placeholder={this.state.number} className="myInput centered_placeholer" onChange={(e) => this.setState({number : e.target.value})} required/>
                                   <button onClick={this.handlePlus} className="btnNumber">+</button>
                                </div>
                                {this.Error(this.state.numberError)}
                                <br/>
                                    <button onClick={this.handleClick} className="btn-block btn-shadow-blue btn btn-info btn-lg">Réserver</button>
                            </form>
                            <br/><br/>
                            <div className="payments">
                                <img alt="" src={om} />
                                <img alt="" src={mvola} />
                                <img alt="" src={paypal}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bar">
                </div>
            </div>
        );
    }
}
export default withRouter(Home); 