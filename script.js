document.getElementById('current-month').textContent = new Date().toLocaleString('default', { month: 'long' });

async function updateGreetingAndWeather() {
    try {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' });

        let greetingMessage = hours < 12 ? "Good Morning" :
            hours < 18 ? "Good Afternoon" : "Good Evening";

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
        };
        const weatherCode = data.current_weather.weathercode;
        const weather = weatherDescriptions[weatherCode] || "Unknown Weather";

        // Update Weather Box
        document.getElementById("weather-info").textContent =
            `${greetingMessage}! It's ${hours}:${minutes} on ${month} ${day}. 
            The weather is ${temperature}°F (${weather}).`;
    } catch (error) {
        document.getElementById("weather-info").textContent =
            "Unable to fetch weather data.";
    }
}


function generateCalendar() {
    const calendarElement = document.getElementById("calendar");
    calendarElement.innerHTML = "";

    for (let i = 1; i <= 31; i++) {
        const dateElement = document.createElement("div");
        dateElement.className = "date";
        dateElement.textContent = i;
        dateElement.addEventListener("click", () => openPopup(i));
        calendarElement.appendChild(dateElement);
    }

    updateCalendarColors(); // Load saved colors when generating calendar
}

function openPopup(day) {
    document.getElementById("popup-content").innerHTML = `
        <h2>Day: ${day}</h2>
        <button id="status-good" class="status-btn good">Good</button>
        <button id="status-decent" class="status-btn decent">Decent</button>
        <button id="status-bad" class="status-btn bad">Bad</button>
        <button id="popup-close-btn" class="close-btn">Close</button>
    `;

    document.getElementById("popup").style.display = "flex";
    document.getElementById("overlay-bg").style.display = "block";

    // ✅ Attach event listeners AFTER updating innerHTML
    document.getElementById("status-good").addEventListener("click", () => setDayStatus(day, "good"));
    document.getElementById("status-decent").addEventListener("click", () => setDayStatus(day, "decent"));
    document.getElementById("status-bad").addEventListener("click", () => setDayStatus(day, "bad"));
    document.getElementById("popup-close-btn").addEventListener("click", closePopup);
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay-bg").style.display = "none";
}

function setDayStatus(day, status) {
    localStorage.setItem(`dayStatus-${day}`, status);
    updateCalendarColors();
    updateStreak();
    closePopup();
}

function updateCalendarColors() {
    document.querySelectorAll(".date").forEach(date => {
        let day = date.textContent.trim();
        if (day) {
            let status = localStorage.getItem(`dayStatus-${day}`);
            date.classList.remove("good", "decent", "bad");
            if (status) date.classList.add(status);
        }
    });
}

function updateStreak() {
    let streak = 0;
    let today = new Date().getDate();

    for (let i = today; i > 0; i--) {
        let status = localStorage.getItem(`dayStatus-${i}`);
        if (status === "good") {
            streak++;
        } else {
            break;
        }
    }

    localStorage.setItem("streak", streak);
    document.getElementById("streak-count").textContent = streak;
}

function updateTheme() {
    var selector = document.getElementById("themes");
    selector.onchange = (event) => {
        localStorage.setItem("theme", selector.value);
        setTheme();
    }

}

function setTheme() {
    var selector = document.getElementById("themes");
    selector.value = localStorage.getItem("theme");
    switch (selector.value) {
        case "og":
            document.body.style.backgroundColor = "#001f3f"
            document.body.style.color = "#ffffff"
            document.getElementById("head").style.backgroundColor = "#004080"
            document.getElementById("foot").style.backgroundColor = "#003366"
            selector.style.backgroundColor = "#004080"
            selector.style.borderColor = "#004080"
            break;
        case "mint":
            document.body.style.backgroundColor = "#F5E8E4"
            document.body.style.color = "#2C2C2C"
            document.getElementById("head").style.backgroundColor = "#1B3A1A"
            document.getElementById("foot").style.backgroundColor = "#4E6E4D"
            selector.style.backgroundColor = "#1B3A1A"
            selector.style.borderColor = "#1B3A1A"
            break;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    generateCalendar();
    updateGreetingAndWeather();
    updateStreak();
    updateTheme();
    setTheme();
});
