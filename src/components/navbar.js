import React, {Component} from 'react';
import logo1 from '../assets/img/logo1.png';
import logo2 from '../assets/img/logo2.png';
import '../assets/css/navbar.css';
import {Link} from 'react-router-dom'
class Navbar extends Component{
    constructor(props){
        super(props)
        this.logout = this.logout.bind(this);
    }
    logout(){
        localStorage.removeItem("accessToken");
    }
    render(){
        const additionalClass = this.props.class;
        var img = ""
        if(this.props.logo === "logo2"){
            img = <img alt="" src={logo2} />
        }else{
            img = <img alt="" src={logo1} />
        } 
        return (
            <header className={additionalClass} id="navbar">
                    <div className="logo">
                        {img}
                    </div>
                    <div className="menu ">
                        <div id="desktop">
                            <div className={this.props.menu+" "+this.props.home+" menu-item"}><Link className={" lien "+this.props.lien} to="/" >Accueil</Link></div>
                            <div className={this.props.menu+" "+this.props.trip+" menu-item"}><Link className={"lien "+this.props.lien} to="/trips" >Voyage</Link></div>
                            <div className={this.props.menu+" "+this.props.infos+" menu-item"}><Link className={"lien "+this.props.lien} to="/reservations" >Informations</Link></div>
                            <div className={this.props.menu+" "+this.props.help+" menu-item"}><Link className={"lien "+this.props.lien} to="/" >Aide</Link></div>
                            <div className={this.props.menu+" "+this.props.help+" menu-item"}><Link className={"lien "+this.props.lien} to="/" >Langue</Link></div>
                            {localStorage.getItem("accessToken") && 
                            <div onClick={this.logout} className={this.props.menu+" "+this.props.logout+" menu-item"}><Link className={"lien "+this.props.lien} to="">deconnexion</Link>
                            </div>}
                            {this.props.children}
                        </div>
                    </div>
                </header>
        );
    }
}
export default Navbar;
