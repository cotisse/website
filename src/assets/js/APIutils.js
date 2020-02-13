
// const BASE_URL = "http://localhost:5001";
const BASE_URL = "https://cotisses5.herokuapp.com";

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : options.url
    })
    
    if(localStorage.getItem("accessToken")) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem("accessToken"))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};


export function getCities() {
    fetch("http://127.0.0.1:5002/main/marques")
      .then(res => res.json())
      .then(
        (result) => {
            return result;
        },
        (error) => {
          return error;
        }
      );
}
export function getMyReservations() {
    return request({
        url: BASE_URL+"/api/web/reservations",
        method: 'GET'
    });
}