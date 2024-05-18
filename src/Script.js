// Select necessary elements from the DOM
const btn = document.getElementById("submit");
const city = document.getElementById('city');
const weatherMain = document.querySelector(".weather-main");
const weatherWeek = document.querySelector(".result-week");
const errorDiv = document.querySelector('#error');
const locationbtn = document.querySelector('#location');

// Log a message to confirm the script is working
console.log("working")

// Function to display error messages
function showError(message) {
    console.log(message);
    console.log(errorDiv);
    errorDiv.textContent = message;
}

// Function to check if a specific item in local storage is empty or not set
function isLocalStorageEmpty(key) {
    return localStorage.getItem(key) === null;
}

// Function to retrieve recently searched cities from local storage
function getRecentCities() {
    return JSON.parse(localStorage.getItem('recentCities')) || [];
}

// Function to save a recently searched city to local storage
function saveRecentCity(city) {
    const recentCities = getRecentCities();
    const dropdown = document.getElementById('recentCitiesDropdown');
    dropdown.style.display = 'block';
    // Avoid saving duplicate cities
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }
}

// Function to render the dropdown menu with recently searched cities
function renderDropdown() {
    const recentCities = getRecentCities();
    const dropdown = document.getElementById('recentCitiesDropdown');
    console.log(isLocalStorageEmpty('recentCities'));
    // Hide the dropdown if local storage is empty
    if (isLocalStorageEmpty('recentCities')) {
        console.log("dropdown working");
        dropdown.style.display = 'none';
        return;
    }

    dropdown.innerHTML = ''; // Clear previous dropdown items

    // Populate dropdown with recent cities
    recentCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        dropdown.appendChild(option);
    });
}

// Function to handle selection of a city from dropdown
function handleDropdownSelection() {
    const dropdown = document.getElementById('recentCitiesDropdown');
    const selectedCity = dropdown.value;
    if (selectedCity) {
        fetchWeather(selectedCity);
        // Keep the dropdown showing the selected city
        dropdown.value = selectedCity;
    }
}

// Initial call to render the dropdown on page load
renderDropdown();

// Function to format and display weather data
function showWeather(cityName, weather, index) {
    if (index === 0) {
        return (`
        <div class="flex flex-col p-4 gap-3 font-bold text-lg">
        <h2>${cityName} (${weather.dt_txt.split(" ")[0]})</h2>
        <p>Temp:${(weather.main.temp - 273.15).toFixed(2)} <sup>o</sup>C</p>
        <p>wind : ${weather.wind.speed} M/S</p>
        <p>Humidity: 88%</p>
    </div>
    <div class="p-3 flex flex-col items-center gap-0  font-bold text-lg text-cyan-50">
        <img  width="150"  src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="weather">
        <p>${weather.weather[0].description}</p>
    </div>
        `)
    } else {
        return `
        <div class="max-w-sm rounded overflow-hidden bg-gray-400 bg-opacity-50 shadow-lg">
        <div class="px-6 py-4"> 
            <div class="flex flex-col p-4 gap-3 font-bold text-lg ">
                <h2>${cityName} (${weather.dt_txt.split(" ")[0]})</h2>
                <p>Temp:${(weather.main.temp - 273.15).toFixed(2)} <sup>o</sup>C</p>
                <p>Wind: ${weather.wind.speed} M/S</p>
                <p>Humidity: ${weather.main.humidity}%</p>
            </div>
            <div class="p-3 flex flex-col items-center font-bold text-lg gap-0">
                <img width="150" src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="">
                <p>${weather.weather[0].description}</p>
            </div>
         </div>
    </div>
        `;
    }
}

// Function to fetch the weather forecast data
async function fetchForecast(name, lat, lon, cityName) {
    console.log(name, lat, lon);
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=0261f3918904b8d23c5d1972ab8fd1ae`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const uniqueFiveDay = [];
            const fiveDayForcast = data.list.filter(forcast => {
                const forcastDate = new Date(forcast.dt_txt).getDate();
                if (!uniqueFiveDay.includes(forcastDate)) {
                    return uniqueFiveDay.push(forcastDate);
                }
            });

            console.log(fiveDayForcast);
            console.log(cityName);

            city.value = " ";
            weatherMain.innerHTML = " ";
            weatherWeek.innerHTML = " ";

            // Display weather data for each day
            fiveDayForcast.forEach((weather, index) => {
                if (index === 0) {
                    weatherMain.insertAdjacentHTML("beforeend", showWeather(name, weather, index));
                } else {
                    weatherWeek.insertAdjacentHTML('beforeend', showWeather(name, weather, index));
                }
            });
            weatherMain.classList.remove("animate-pulse");
            weatherWeek.classList.remove("animate-pulse");
        })
        .catch(err => console.log(err));
}

// Function to fetch weather data
async function fetchWeather(city = 'delhi') {
    weatherMain.classList.add("animate-pulse");
    weatherWeek.classList.add("animate-pulse");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0261f3918904b8d23c5d1972ab8fd1ae&units=metrics`);
        if (!response.ok) {
            throw new Error('City not found or API error');
        }
        const data = await response.json();
        const name = data.name;
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        await fetchForecast(name, lat, lon, city);
        saveRecentCity(city); // Save searched city to local storage
        renderDropdown(); // Update dropdown with recently searched cities
    } catch (error) {
        showError(error.message);
    }
}

// Regex pattern to validate city name
const nameRegex = /^[a-zA-Z\s]+$/;
fetchWeather();

// Event listener for the submit button to handle city search
btn.addEventListener('click', (e) => {
    e.preventDefault();
    const cityName = city.value.trim(); // Trim to remove leading and trailing spaces
    errorDiv.textContent = "";

    if (cityName === "") {
        console.log("blank is working");
        showError("Field should not be empty");
    } else if (!nameRegex.test(cityName)) {
        console.log("string validator is working");
        showError("Number is not accepted");
    } else {
        console.log("api is calling");
        fetchWeather(cityName);
    }

    // Clear error message after handling
});

// Function to get user's coordinates and fetch weather data based on location
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=0261f3918904b8d23c5d1972ab8fd1ae`;
        fetch(REVERSE_GEOCODING_URL).then(res => res.json())
            .then(data => {
                const { name } = data[0];
                console.log(name);
                fetchForecast(name, latitude, longitude);
            })
    }, err => {
        if (err.code === err.PERMISSION_DENIED) {
            showError("Something went wrong, please try again later");
        }
    });
}

// Event listener for the location button to fetch weather data based on user's location
locationbtn.addEventListener("click", getUserCoordinates);

// Event listener for the dropdown menu to handle city selection
document.getElementById('recentCitiesDropdown').addEventListener('change', handleDropdownSelection);
