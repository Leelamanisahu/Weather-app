// const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0261f3918904b8d23c5d1972ab8fd1ae&units=metrics`
const btn = document.getElementById("submit");
const city = document.getElementById('city');

console.log("working")

function showWeather(weather) {

}

async function fetchForecast(name, lat, lon) {
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
            fetchForecast(name, lat, lon);
        }).catch(err => console.log(err))
}

fetchWeather();
btn.addEventListener('click', (e) => {
    e.preventDefault();
    const cityName = city.value;
    fetchWeather(cityName)
})


