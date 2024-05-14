// const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0261f3918904b8d23c5d1972ab8fd1ae&units=metrics`
const btn = document.getElementById("submit");
const city = document.getElementById('city');
const weatherMain = document.querySelector(".weather-main");

console.log("working")


function showWeather(cityName,weather,index) {
    if(index === 0){
        return (`
        <div class="flex flex-col p-4 gap-2">
        <h2>${cityName} (${weather.dt_txt.split(" ")[0]})</h2>
        <p>Temparature:${(weather.main.temp -273.15).toFixed(2) } <sup>o</sup>C</p>
        <p>wind : ${weather.wind.speed} M/S</p>
        <p>Humidity: 88%</p>
    </div>
    <div class="p-3 flex flex-col items-center gap-0">
        <img  width="150"  src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="weather">
        <p>${weather.weather[0].description}</p>
    </div>
        `)
    }
}

async function fetchForecast(name, lat, lon,cityName) {
    console.log(name, lat, lon);
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=0261f3918904b8d23c5d1972ab8fd1ae`)
        .then(res => res.json())
        .then(data => {
           
            console.log(data)
            const uniqueFiveDay = [];
          const fiveDayForcast =  data.list.filter(forcast=>{
                const forcastDate = new Date(forcast.dt_txt).getDate();
                if(!uniqueFiveDay.includes(forcastDate)){
                    return uniqueFiveDay.push(forcastDate);
                }
            });

            console.log(fiveDayForcast)
            console.log(cityName)
            
            city.value = " ";
            weatherMain.innerHTML = " ";

            fiveDayForcast.forEach((weather,index) => {
                if(index === 0){
                    weatherMain.insertAdjacentHTML("beforeend",showWeather(cityName,weather,index))
                }
            });
        }) 
        .catch(err => console.log(err))
}

// fetchForecast();

function fetchWeather(city = 'delhi') {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0261f3918904b8d23c5d1972ab8fd1ae&units=metrics`)
        .then(res => res.json())
        .then((data) => {
            // console.log(data)
            if (!data.lenght) { console.log(`No Cordinates Found for ${city}`); }
            const name = data.name;
            // console.log(data);
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            fetchForecast(name, lat, lon,city);
        }).catch(err => console.log(err))
}

fetchWeather();
btn.addEventListener('click', (e) => {
    e.preventDefault();
    fetchWeather(city.value)
})


