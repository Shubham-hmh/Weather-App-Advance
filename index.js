
const config = {
    // curl: "https://api.countrystatecity.in/v1/countries",
    curl: "https://countriesnow.space/api/v0.1/countries",
    ckey: "",

    wurl: "https://api.openweathermap.org/data/2.5/",
    wkey: "770cc7313b30c481be2c79f12dc647c9",
};

//get countries 

const getCountries = async (fieldName, ...args) => {
    let apiEndPoint = config.curl;

    // while modifying endpoint https://api.countrystatecity.in/v1/countries/states/city.

    // switch (fieldName) {
    //     case 'countries':
    //         apiEndPoint = config.curl;
    //         break;
    //     case 'states':
    //         apiEndPoint = `{config.curl}/${args[0]}/states`;
    //     case 'cities':
    //         apiEndPoint = `{config.curl}/${args[0]}/states/${args[1]}/cities`;
    //     default:

    // }
    const response =await fetch(apiEndPoint);

    if (response.status != 200) {
        throw new Error(`something went wrong, status code : ${response.status}`);
    }

    const countries = await response.json();    // it also return a promise so that use await before it 
    // console.log(countries.data);
   

    //return countries; // it may return city or country or state. 
    return countries.data;
}


//get WeatherInfo----------> // it return promise then use await while calling.
const getWeather = async (cityName, ccode, units = "metric") => {

    const apiEndPoint = `${config.wurl}weather?q=${cityName},${ccode.toLowerCase()}&appid=${config.wkey}&units=${units}`;
    // console.log(apiEndPoint);  // this make api to get weather.


    try {
        const response = await fetch(apiEndPoint);
        if (response.status != 200) {
            if (response.status == 404) {
                weatherDiv.innerHTML = `<div class="alert-danger">
           <h3> Oops! No data available.</h3>
            </div>`
            }
            else {
                throw new Error(`something went wrong , status code : ${response.status}`);

            }
        }
        const weather = await response.json();
        return weather;

    } catch (error) {
        console.log(error);
    }


};


const getDateTime = (unixTimeStamp) => {
    const milliSeconds = unixTimeStamp * 1000;
    const dateObject = new Date(milliSeconds); // get object of date.
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const humanDateFormat = dateObject.toLocaleDateString('en-US', options);
    return humanDateFormat;

};

const tempCard = (val, unit = "cel") => {

    const flag = unit == "far" ? "°F" : "°C";

    return ` <div id="tempcard">
    <h6 class="card-subtitle mb2 ${unit}">
        ${val.temp}</h6>
    <p class="card-text">Feels Like:${val.temp} ${flag}</p>
    <p class="card-text">Max:${val.temp_max}${flag}, Min: ${val.temp_min}${flag}</p>
</div>`

};
const displayWeather = (data) => {
    const weatherWidget = `<div class="card">
    <div class="card-body">
        <h5 class="card-title">
            ${data.name}, ${data.sys.country}<span class="float-end units"><a href="#" class="unitlink active"  data-unit="cel" >°C</a>|<a href="#" class ="unitlink" data-unit="far">°F</a></span>
        </h5>
        <p>${getDateTime(data.dt)}</p>
        <div id="tempcard">
           ${tempCard(data.main)}
        </div>
        ${data.weather.map(w => `<div id="img-container">${w.main} <img src="https://openweathermap.org/img/wn/${w.icon}.png"/></div>
        <p>${w.description}</p> `).join("\n")}
      
    </div>
</div>`;
    weatherDiv.innerHTML = weatherWidget;
};


const getLoader = () => {
    return `<div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`;
};
// weather.description is a array  map array using new line join use 
const countryListDropDown = document.querySelector("#countryList");
const stateListDropDown = document.querySelector("#stateList");
const cityListDropDown = document.querySelector("#cityList");
const weatherDiv = document.querySelector("#weatherwidget");


//on content load 
document.addEventListener('DOMContentLoaded', async () => {

    // call function which return promise 
    const countries = await getCountries("countries");
    console.log(countries);
   

    let counrtiesOptions = "";
    if (countries) {
        counrtiesOptions += `<option value="">Select Country</option> `;
       
        countries.forEach((coutry) => {
            counrtiesOptions += `<option value="${coutry.country}">${coutry.country}</option> `;

        });
        countryListDropDown.innerHTML = counrtiesOptions;

    }
// Getting all states of particular  country.
    const getState=async(args)=>
    {
        url="https://countriesnow.space/api/v0.1/countries/states";
        data=`{ "country":"${args}" }`;
    
        params={
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body: data
        }

        const response =await fetch(url,params);

        if (response.status != 200) {
            throw new Error(`something went wrong, status code : ${response.status}`);
        }
    
        const countries = await response.json();    // it also return a promise so that use await before it 
         console.log(countries.data);
       
    
        //return countries; // it may return city or country or state. 
        return countries.data;
    
       
    
    }
  
    // list states-----> when countryList change then stateList enable.  // arrow function not contain this keyword.
    countryListDropDown.addEventListener('change', async function () {  // that is call back function
         const selectedCountryCode = this.value;
        //  const states = await getCountries("states",selectedCountryCode);
         
         const promise = await getState(selectedCountryCode);

        
        const states=promise.states;
        console.log(states);
        //states option
        let statesOptions = "";
        if (states) {
            statesOptions += `<option value=""> State</option> `;
            states.forEach((state) => {
                statesOptions += `<option value="${state.name}">${state.name}</option> `;

            });
            stateListDropDown.innerHTML = statesOptions;
            stateListDropDown.disabled = false;
        }


    });

//---------------------------------------------------------------------------------->


// Getting all cities of particular  states.
const getcity=async(arg1,arg2)=>
{

    url2="https://countriesnow.space/api/v0.1/countries/state/cities";
  
    data=`{"country":"${arg1}",
    "state": "${arg2}"}`;
    console.log(data);
    console.log(typeof(data));

    params={
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body: data
    }


    const response =await fetch(url2,params);

    if (response.status != 200) {
        throw new Error(`something went wrong, status code : ${response.status}`);
    }

    const countries = await response.json();    // it also return a promise so that use await before it 
     console.log(countries);
   

    //return countries; // it may return city or country or state. 
    return countries;

   

}
    //list cities ------> when stateList change then cityList enable.

    stateListDropDown.addEventListener("change", async function () {

        const selectedCountryCode = countryListDropDown.value;
        const selectedStateCode = this.value;
       
      //  const cities = await getCountries("cities", selectedCountryCode, selectedStateCode);
        const promise = await getcity( selectedCountryCode,selectedStateCode);

        const cities=promise.data;

        let citiesOptions = "";
        if (cities) {
            citiesOptions += `<option value=""> City</option> `;
            cities.forEach((city) => {
                citiesOptions += `<option value="${city}">${city}</option> `;

            });

          
            cityListDropDown.innerHTML = citiesOptions;
            cityListDropDown.disabled = false;
        }


    });

    // Select city then find particular city weather .
    cityListDropDown.addEventListener("change", async function () {

        const selectedCountryCode = countryListDropDown.value;
        const selectedCity = this.value;
        // console.log(selectedCity);

        weatherDiv.innerHTML = getLoader();
        const weatherInfo = await getWeather(selectedCity, selectedCountryCode);
        // console.log(weatherInfo);
        displayWeather(weatherInfo);
    });

    // change unit 
    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("unitlink")) {
            // alert("hi");
            const unitValue = e.target.getAttribute("data-unit");
            const selectedCountryCode = countryListDropDown.value;
            const selectedCity = cityListDropDown.value;




            const unitFlag = unitValue == "far" ? "imperial" : "metric";
            const weatherInfo = await getWeather(selectedCity, selectedCountryCode, unitFlag);

            const weatherTemp = tempCard(weatherInfo.main, unitValue);
            document.querySelector("#tempcard").innerHTML = weatherTemp;


            //new active link 
            document.querySelectorAll(".unitlink").forEach((link) => {
                link.classList.remove("active");
            });
            e.target.classList.add('active');


        }
    })
});