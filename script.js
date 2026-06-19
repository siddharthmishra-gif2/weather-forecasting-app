const api_key = "b3eae25a346ef89c09037e663aa7bf66";

async function getWeather() {
    const city = document.getElementById("city").value;

    

    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById("result").innerHTML =
            `City: ${data.name}<br>
             Temperature: ${data.main.temp} °C`;
    } catch (error) {
        document.getElementById("result").innerHTML =
            "Error fetching weather data";
    }
}