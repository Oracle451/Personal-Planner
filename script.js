// Display the current month
    document.getElementById('current-month').textContent = new Date().toLocaleString('default', { month: 'long' });

    // Function to update the greeting based on time
    function updateGreeting() {
        const hours = new Date().getHours();
        const greeting = document.getElementById("greeting");
        if (hours < 12) {
            greeting.textContent = "Good Morning!";
        } else if (hours < 18) {
            greeting.textContent = "Good Afternoon!";
        } else {
            greeting.textContent = "Good Evening!";
        }
    }

    // Generate a simple calendar
    function generateCalendar() {
        const calendarElement = document.getElementById("calendar");
        calendarElement.innerHTML = ""; // Clear existing content

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Add weekdays
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        weekdays.forEach(day => {
            const dayElement = document.createElement("div");
            dayElement.className = "day";
            dayElement.textContent = day;
            calendarElement.appendChild(dayElement);
        });

        // Add empty cells before the first day
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "date";
            calendarElement.appendChild(emptyCell);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const dateElement = document.createElement("div");
            dateElement.className = "date";
            dateElement.textContent = i;
            calendarElement.appendChild(dateElement);
        }
    }

    // Function to update the greeting and weather
	async function updateGreetingAndWeather() {
		try {
			const now = new Date();
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const day = now.getDate();
			const month = now.toLocaleString('default', { month: 'long' });

			// Determine the greeting message
			let greetingMessage;
			if (hours < 12) {
				greetingMessage = "Good Morning";
			} else if (hours < 18) {
				greetingMessage = "Good Afternoon";
			} else {
				greetingMessage = "Good Evening";
			}

			// Fetch weather data
			const response = await fetch(
				'https://api.open-meteo.com/v1/forecast?latitude=35.1050&longitude=-111.3712&current_weather=true&temperature_unit=fahrenheit'
			);
			const data = await response.json();
			const temperature = data.current_weather.temperature;
			const weatherDescriptions = {
				0: "Clear Sky",
				1: "Mainly Clear",
				2: "Partly Cloudy",
				3: "Overcast",
				// Add more mappings as needed
			};
			const weatherCode = data.current_weather.weathercode;
			const weather = weatherDescriptions[weatherCode] || "Unknown Weather";

			// Update the greeting message
			const greetingElement = document.getElementById("greeting");
			greetingElement.textContent = `${greetingMessage}! It is currently ${hours}:${minutes} on ${month} ${day}. The weather is ${temperature}°F (${weather}). It looks like a perfect day to be productive!`;
		} catch (error) {
			const greetingElement = document.getElementById("greeting");
			greetingElement.textContent = "Unable to fetch weather data. Please check your connection.";
		}
	}

	// Initialize the app
	function initialize() {
		generateCalendar();
		updateGreetingAndWeather();
		updateTime();
		setInterval(updateTime, 60000); // Update time every second
	}

	document.addEventListener("DOMContentLoaded", initialize);