 "b3eae25a346ef89c09037e663aa7bf66";

const apiKey = "b3eae25a346ef89c09037e663aa7bf66";

const loader = document.getElementById("loader");
const error = document.getElementById("error");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const visibility = document.getElementById("visibility");
const pressure = document.getElementById("pressure");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const updated = document.getElementById("updated");
const forecastContainer = document.getElementById("forecastContainer");
const dateTime = document.getElementById("dateTime");

// -----------------------
// Live Date & Time
// -----------------------

function updateTime() {

    const now = new Date();

    dateTime.innerHTML = now.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });

}

setInterval(updateTime, 1000);
updateTime();


// -----------------------
// Loader
// -----------------------

function showLoader() {
    loader.style.display = "flex";
}

function hideLoader() {
    loader.style.display = "none";
}


// -----------------------
// Search by Enter
// -----------------------

document.getElementById("city").addEventListener("keypress", function(e){

    if(e.key==="Enter"){
        getWeather();
    }

});


// -----------------------
// Weather by City
// -----------------------

async function getWeather(){

    const city=document.getElementById("city").value.trim();

    if(city===""){
        showError("Please enter city name");
        return;
    }

    fetchWeather(city);

}



// -----------------------
// Fetch Weather
// -----------------------

async function fetchWeather(city){

    showLoader();
    error.innerHTML="";

    try{

        const weatherURL=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response=await fetch(weatherURL);

        if(!response.ok){
            throw new Error("City not found");
        }

        const data=await response.json();

        displayWeather(data);

        fetchForecast(data.coord.lat,data.coord.lon);

    }

    catch(err){

        showError(err.message);

    }

    finally{

        hideLoader();

    }

}



// -----------------------
// Display Weather
// -----------------------

function displayWeather(data){

    cityName.innerHTML=data.name+", "+data.sys.country;

    temperature.innerHTML=Math.round(data.main.temp)+"°C";

    condition.innerHTML=data.weather[0].description;

    weatherIcon.src=`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    feelsLike.innerHTML=Math.round(data.main.feels_like)+"°C";

    humidity.innerHTML=data.main.humidity+" %";

    wind.innerHTML=(data.wind.speed*3.6).toFixed(1)+" km/h";

    visibility.innerHTML=(data.visibility/1000)+" km";

    pressure.innerHTML=data.main.pressure+" hPa";

    sunrise.innerHTML=formatTime(data.sys.sunrise);

    sunset.innerHTML=formatTime(data.sys.sunset);

    updated.innerHTML="Just Now";

}



// -----------------------
// Forecast
// -----------------------

async function fetchForecast(lat,lon){

    const url=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response=await fetch(url);

    const data=await response.json();

    forecastContainer.innerHTML="";

    const daily=data.list.filter(item=>item.dt_txt.includes("12:00:00"));

    daily.forEach(day=>{

        const card=document.createElement("div");

        card.className="forecast-card";

        card.innerHTML=`

        <h3>${new Date(day.dt_txt).toLocaleDateString("en-US",{weekday:"short"})}</h3>

        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

        <h2>${Math.round(day.main.temp)}°C</h2>

        <p>${day.weather[0].main}</p>

        `;

        forecastContainer.appendChild(card);

    });

}



// -----------------------
// Current Location
// -----------------------

function getLocation(){

    if(!navigator.geolocation){

        showError("Geolocation not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            const lat=position.coords.latitude;
            const lon=position.coords.longitude;

            showLoader();

            const url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            const response=await fetch(url);

            const data=await response.json();

            displayWeather(data);

            fetchForecast(lat,lon);

            hideLoader();

        },

        ()=>{

            showError("Location access denied.");

        }

    );

}



// -----------------------
// Error
// -----------------------

function showError(msg){

    error.innerHTML=msg;

    setTimeout(()=>{

        error.innerHTML="";

    },3000);

}



// -----------------------
// Format Time
// -----------------------

function formatTime(timestamp){

    return new Date(timestamp*1000).toLocaleTimeString("en-US",{

        hour:"numeric",

        minute:"2-digit"

    });

}



// -----------------------
// Theme Toggle
// -----------------------

const themeBtn=document.getElementById("themeBtn");

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

        localStorage.setItem("theme","dark");

    }

    else{

        themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';

        localStorage.setItem("theme","light");

    }

});



window.onload=()=>{

    if(localStorage.getItem("theme")==="dark"){

        document.body.classList.add("dark");

        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

    }

    fetchWeather("Delhi");

};