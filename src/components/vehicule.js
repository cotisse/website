import React, {Component} from 'react';


class Vehicule extends Component{
    constructor(props){
        super(props);
        
    }
    handlePlaceClick(place){
        let list = this.props.panier;
        let ok = true;
        let error = "";
        // list.forEach((panier) => {
            //la place est déjà là ?
            // if(panier.id_place == place.id_place ){
            //     ok = false;
            //     error="efa ao";
            // }
            // la place est libre ?
            if( place.etat == 0){
                ok = false;
                error="efa lasanol";
            }
            
        // });
        if(place.number == 0){
            ok = false;
            error="sofera";
        }
        if(ok){
            this.props.onClickPlace(place);
            // this.setState({clicked : "legendActive"})
        }else{
            console.log(error);
        }
    }
    render(){
        let panier = this.props.panier;
        const placesJson = this.props.data;
        var colonne = 4;
        if(placesJson.length < 8){
            colonne = 3;
        }
        var row = parseInt(this.props.data.length/colonne) + 1;
        var res = [];
        var p = 0;
        var places = [];
        placesJson.forEach((place) => {
            places.push(place);
        });
        for(var r = 0 ; r < row ; r++){
            var tds = [];
            for(var col = 0 ; col < colonne ; col++,p++){
                if(p < places.length){
                    let color_chaise = ""
                    if(places[p].etat === 0){
                        color_chaise += " disabled"
                    }
                    if(places[p].int_state === 2){
                        color_chaise += " chauffeur"
                    }
                    if(panier){
                        panier.forEach(
                            (item) => {
                                if(item.id_place == places[p].id_place && item.idTrip == places[p].idTrip){
                                    color_chaise += " legendActive"
                                }
                            }
                        );
                    }
                    let test = places[p];
                    tds.push(
                        <td key={p}><span value={test} onClick={() => this.handlePlaceClick(test)} className={"legend"+color_chaise}> {places[p].number} </span></td>
                    );
                }
            }
            res.push(
                <tr key={r}>{tds}</tr>
            );
            tds = [];
        }
        return(
             <table className="pick-place tablePickPlace">
                <tbody>
                    {res}
                </tbody>
             </table>
        );
    }
}
export default Vehicule;