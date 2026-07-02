 const apiKey = "b3eae25a346ef89c09037e663aa7bf66";

function updateTime() {

    const now = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    const date = now.toLocaleDateString("en-IN", options);
    const time = now.toLocaleTimeString();

    document.getElementById("datetime").innerHTML =
        `<i class="fa-regular fa-clock"></i> ${date}<br>${time}`;
}

setInterval(updateTime,1000);
updateTime();

function getWeather(){

    const city=document.getElementById("city").value;

    if(city=="Select City"){
        alert("Please select a city");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)

    .then(response=>response.json())

    .then(data=>{

        document.querySelector(".weather-card").style.display="block";

        document.querySelector(".weather-card h2").innerHTML=
        `<i class="fa-solid fa-location-dot"></i> ${data.name}`;

        document.getElementById("temperature").innerHTML=
        Math.round(data.main.temp)+"°C";

        document.getElementById("condition").innerHTML=
        `<i class="fa-solid fa-cloud"></i> ${data.weather[0].main}`;

        document.getElementById("humidity").innerHTML=
        data.main.humidity+"%";

        document.getElementById("wind").innerHTML=
        data.wind.speed+" km/h";

        const icon=data.weather[0].icon;

        document.getElementById("weatherIcon").src=
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

    })

    .catch(()=>{
        alert("City not found!");
    });

}