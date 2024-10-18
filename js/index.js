// code by the Freakybob Team
// 10/17/2024
// Please leave this note in here if you are using this code in your project!
// ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️
const body = document.body;
const backgrounds = [
    "images/bg.png",
    "images/idk.jpg",
    "images/ocean.jpg"
];

let currentIndex = 0;

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

const savedIndex = getCookie('backgroundIndex');
if (savedIndex) {
    currentIndex = parseInt(savedIndex);
    body.style.backgroundImage = `url(${backgrounds[currentIndex]})`;
} else {
    body.style.backgroundImage = `url(${backgrounds[currentIndex]})`;
}

function changeBackground() {
    currentIndex = (currentIndex + 1) % backgrounds.length;
    body.style.backgroundImage = `url(${backgrounds[currentIndex]})`;
    setCookie('backgroundIndex', currentIndex, 7);
}

            function updateClock() {
    const now = new Date();
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const timeString = now.toLocaleString('en-US', options);
    document.getElementById('clock').textContent = timeString;
}

updateClock();
setInterval(updateClock, 60000);


function setBackground(index) {
    body.style.backgroundImage = `url('${backgrounds[index]}')`;
}

document.getElementById('next-button').addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % backgrounds.length;
    setBackground(currentIndex);
});

document.getElementById('prev-button').addEventListener('click', function() {
    currentIndex = (currentIndex - 1 + backgrounds.length) % backgrounds.length; 
    setBackground(currentIndex);
});

setBackground(currentIndex);

        document.addEventListener('DOMContentLoaded', function () {
            const overlay = document.querySelector('.overlay');
            const topOverlay = document.querySelector('.top-overlay');
            const modals = document.querySelectorAll('.modal');

            function openModal(modalId) {
                document.getElementById(modalId).classList.add('active');
                overlay.classList.add('active');
                topOverlay.classList.add('active');
            }

            function closeModal() {
                modals.forEach(modal => modal.classList.remove('active'));
                overlay.classList.remove('active');
                topOverlay.classList.remove('active');
            }

            
            document.querySelector('.weathera').addEventListener('click', function (e) {
                e.preventDefault();
                openModal('weather-modal');
            });

            document.querySelector('.creditsa').addEventListener('click', function (e) {
                e.preventDefault();
                openModal('credits-modal');
            });

            document.querySelector('.abouta').addEventListener('click', function (e) {
                e.preventDefault();
                openModal('about-modal');
            });

            
            document.querySelectorAll('.close-btn').forEach(btn => {
                btn.addEventListener('click', closeModal);
            });

            
            overlay.addEventListener('click', closeModal);
            topOverlay.addEventListener('click', closeModal);
        });

        
        const apiKey = '9fb72ce4a247b16999ba8df85db1b357';
        const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

        
        const locationInput = document.getElementById('locationInput');
        const searchButton = document.getElementById('searchButton');
        const geoButton = document.getElementById('geoButton');
        const locationElement = document.getElementById('location');
        const temperatureElement = document.getElementById('temperature');
        const descriptionElement = document.getElementById('description');
        const humidityElement = document.getElementById('humidity');
        const windElement = document.getElementById('wind');
        const errorMessage = document.getElementById('errorMessage');
        const loadingElement = document.getElementById('loading');
        const weatherIcon = document.getElementById('weatherIcon');

        
        searchButton.addEventListener('click', () => {
            const location = locationInput.value.trim();
            if (location) {
                fetchWeather(location);
            } else {
                displayError('Please enter a city and state.');
            }
        });

        locationInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                searchButton.click();
            }
        });

        geoButton.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        fetchWeatherByCoords(latitude, longitude);
                    },
                    error => {
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                displayError('User denied the request for Geolocation.');
                                break;
                            case error.POSITION_UNAVAILABLE:
                                displayError('Location information is unavailable.');
                                break;
                            case error.TIMEOUT:
                                displayError('The request to get user location timed out.');
                                break;
                            case error.UNKNOWN_ERROR:
                                displayError('An unknown error occurred.');
                                break;
                        }
                    }
                );
            } else {
                displayError('Geolocation is not supported by your browser.');
            }
        });

        
        function fetchWeather(location) {
            const url = `${apiUrl}?q=${encodeURIComponent(location)}&appid=${apiKey}&units=imperial`; 

            showLoading();
            clearWeatherInfo();

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.message || 'City not found');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    hideLoading();
                    displayWeather(data);
                })
                .catch(error => {
                    hideLoading();
                    console.error('Error fetching weather data:', error);
                    displayError(`Unable to retrieve weather data. ${error.message}`);
                });
        }

        
        function fetchWeatherByCoords(lat, lon) {
            const url = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`; 

            showLoading();
            clearWeatherInfo();

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.message || 'Could not fetch weather data');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    hideLoading();
                    displayWeather(data);
                })
                .catch(error => {
                    hideLoading();
                    console.error('Error fetching weather data:', error);
                    displayError(`Unable to retrieve weather data. ${error.message}`);
                });
        }

        
        function displayWeather(data) {
            const { name, sys, main, weather, wind } = data;
            locationElement.textContent = `${name}, ${sys.country}`;
            temperatureElement.textContent = `Temperature: ${Math.round(main.temp)}°F`;
            descriptionElement.textContent = `Condition: ${capitalizeFirstLetter(weather[0].description)}`;
            humidityElement.textContent = `Humidity: ${main.humidity}%`;
            windElement.textContent = `Wind Speed: ${wind.speed} mph`;

          
            const iconCode = weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIcon.alt = weather[0].description;
            weatherIcon.style.display = 'block';
        }

       
        function displayError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            loadingElement.style.display = 'none';
        }

        
        function showLoading() {
            loadingElement.style.display = 'block';
            errorMessage.style.display = 'none';
            clearWeatherInfoDisplay();
        }

        
        function hideLoading() {
            loadingElement.style.display = 'none';
        }

        
        function clearWeatherInfo() {
            locationElement.textContent = '';
            temperatureElement.textContent = '';
            descriptionElement.textContent = '';
            humidityElement.textContent = '';
            windElement.textContent = '';
            weatherIcon.style.display = 'none';
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
        }

        
        function clearWeatherInfoDisplay() {
            locationElement.textContent = '';
            temperatureElement.textContent = '';
            descriptionElement.textContent = '';
            humidityElement.textContent = '';
            windElement.textContent = '';
            weatherIcon.style.display = 'none';
        }

        
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

       
        window.addEventListener('resize', adjustModalHeight);
        function adjustModalHeight() {
            const weatherModal = document.getElementById('weather-modal');
            weatherModal.style.maxHeight = `${window.innerHeight * 0.9}px`;
        }

       
        adjustModalHeight();
        function getUsername() {
    const savedName = localStorage.getItem('username') || 'User';
    document.getElementById('user-name').textContent = savedName;
}

document.getElementById('change-name-button').addEventListener('click', () => {
 
    const nameInputDiv = document.getElementById('change-name-input');
    nameInputDiv.style.display = 'block';
    const nameInput = document.getElementById('new-username');
    
    
    nameInput.value = localStorage.getItem('username') || 'User';
    nameInput.focus();
    
    
    nameInput.addEventListener('blur', saveUsername);
    
 
    nameInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            saveUsername();
            nameInput.blur();
        }
    });
});

function saveUsername() {
    const newName = document.getElementById('new-username').value.trim();
    
    if (newName) {
        
        localStorage.setItem('username', newName);
        document.getElementById('user-name').textContent = newName;
    }

    
    document.getElementById('change-name-input').style.display = 'none';
}
