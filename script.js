function getWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = 'b72a609c2ff4cea1bbee3d0352798eb4';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        displayWeather(data); // Passando os dados recebidos para a função de exibição
    })
    .catch(error => {
        console.error('Erro ao obter dados meteorológicos:', error);
        const weatherDataElement = document.getElementById('weatherData');
        weatherDataElement.innerHTML = '<p>Erro ao obter dados meteorológicos. Por favor, tente novamente.</p>';
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, handleError);
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function showWeather(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Chamada para a API de geocodificação para obter o nome da cidade usando as coordenadas
    const geocodeApiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid={API key}`;
    
    fetch(geocodeApiUrl)
        .then(response => response.json())
        .then(data => {
            const cityName = data[0].name;
            const countryCode = data[0].country;
            
            // Chamada para a API de previsão do tempo usando o nome da cidade e código do país
            const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid={API key}&units=metric`;
            
            fetch(weatherApiUrl)
                .then(response => response.json())
                .then(weatherData => {
                    // Processar os dados meteorológicos recebidos e exibi-los na interface
                    displayWeather(weatherData);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching city name:', error);
        });
}

function handleError(error) {
    console.error("Error getting user location:", error);
}

function displayWeather(weatherData) {
    // Exibir os dados meteorológicos na interface
    const temperature = weatherData.main.temp;
    const weatherDataElement = document.getElementById('weatherData');
    weatherDataElement.innerHTML = `<p>Temperatura: ${temperature}°C</p>`;
}

// Chamando a função para obter a localização do usuário ao carregar a página
getLocation();
