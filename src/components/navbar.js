import React, {Component} from 'react';
import logo1 from '../assets/img/logo1.png';
import logo2 from '../assets/img/logo2.png';
import '../assets/css/navbar.css';
import {Link} from 'react-router-dom'
class Navbar extends Component{
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
                            <div className={this.props.menu+" "+this.props.trip+" menu-item"}><Link className={this.props.activeColor+" lien "+this.props.lien} to="/trips" >Voyage</Link></div>
                            <div className={this.props.menu+" "+this.props.infos+" menu-item"}><Link className={"lien "+this.props.lien} to="/" >Informations</Link></div>
                            <div className={this.props.menu+" "+this.props.help+" menu-item"}><Link className={"lien "+this.props.lien} to="/" >Aide</Link></div>
                            <div className={this.props.menu+" "+this.props.help+" menu-item"}><Link className={"lien "+this.props.lien} to="/" >Langue</Link></div>
                            {this.props.children}
                        </div>
                    </div>
                </header>
        );
    }
}
export default Navbar;
