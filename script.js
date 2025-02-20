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
    let today = new Date();
    let monthday = today.getDate(); /* gets the day in the month */
    let last_day = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    let days_in_month = last_day.getDate(); /* gets the length of this month */
    let weekday = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); /* gets the first weekday of this month */
    /* creates filler before this month */
    for (let i = 0; i < weekday; i++) {
        const dateElement = document.createElement("div");
        dateElement.className = "inactive-date";
        calendarElement.appendChild(dateElement);
    }
    /* creates days of the month */
    for (let i = 1; i <= days_in_month; i++) {
        const dateElement = document.createElement("div");
        dateElement.className = "date";
        dateElement.textContent = i;
        dateElement.addEventListener("click", () => openPopup(i));
        calendarElement.appendChild(dateElement);
    }
    /* creates filler after this month */
    for (let i = 0; i > days_in_month + weekday - 42; i--) {
        const dateElement = document.createElement("div");
        dateElement.className = "inactive-date";
        calendarElement.appendChild(dateElement);
    }
    document.getElementById(`add-task`).addEventListener("click", () => addTaskPopup());
    updateCalendarColors(); // Load saved colors when generating calendar
}

function openPopup(day) {
    // inner html for popup
    document.getElementById("popup-content").innerHTML = `
         

        <div class="calorie-counter">
            <h2>Day: ${day}</h2>
            <button id="status-good" class="status-btn good">Good</button>
            <button id="status-decent" class="status-btn decent">Decent</button>
            <button id="status-bad" class="status-btn bad">Bad</button>
            <button id="popup-close-btn" class="close-btn">Close</button>

            <h2>Calories: <span id="calories-${day}">0</span></h2>
            <button id="calories-plus-${day}" class="calorie-btn">+100</button>
            <button id="calories-minus-${day}" class="calorie-btn">-100</button>
        </div>
    `;

    document.getElementById("popup").style.display = "flex";
    document.getElementById("overlay-bg").style.display = "block";

    // attach event listeners AFTER updating innerHTML
    document.getElementById("status-good").addEventListener("click", () => setDayStatus(day, "good"));
    document.getElementById("status-decent").addEventListener("click", () => setDayStatus(day, "decent"));
    document.getElementById("status-bad").addEventListener("click", () => setDayStatus(day, "bad"));
    document.getElementById("popup-close-btn").addEventListener("click", closePopup);

    document.getElementById(`calories-plus-${day}`).addEventListener("click", () => updateCalories(day, 100));
    document.getElementById(`calories-minus-${day}`).addEventListener("click", () => updateCalories(day, -100));

    // set the initial calorie count
    let storedCalories = localStorage.getItem(`calories-${day}`);
    if (storedCalories) {
        document.getElementById(`calories-${day}`).textContent = storedCalories;
    }

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
        case "standard":

            /* the header's background and text color*/
            /*background color*/
            document.getElementById("head").style.backgroundColor = "#73c7e3"
            /*text color*/
            document.getElementById("head").style.color = "#ffffff"
            /*text shadow color*/
            document.getElementById("head").style.textShadow = "-2px 2px #2e4a70"

            /*weather sections's background and text color*/
            document.querySelectorAll(".weather-section").forEach(element => {
                /*background color*/
                element.style.backgroundColor = "#f0f2f2";
                /*text color*/
                element.style.color = "#2e4a70";

                // font color
                element.style.textShadow = "-1px 1px rgb(119, 119, 119)"
            });

            /*calendar sections's background and text color*/
            document.querySelectorAll(".calendar-section").forEach(element => {
                /*background color*/
                element.style.backgroundColor = "#fff9f0";
                /*text color*/
                element.style.color = "#2e4a70";

                // font color
                element.style.textShadow = "-1px 1px rgb(119, 119, 119)"

            });


            /*days of the week backgroung and text color*/
            document.querySelectorAll(".day").forEach(element => {
                /*background color*/
                element.style.backgroundColor = "#cf8a40";
                /*text color*/
                element.style.color = "#2e4a70";
                /*border color*/
                element.style.borderColor = " #2e4a70";
            });

            /*date backgroung and text color*/
            document.querySelectorAll(".date").forEach(element => {
                /*background color*/
                element.style.backgroundColor = "#fff9f0";
                /*text color*/
                element.style.color = "#2e4a70";
                /*border color*/
                element.style.borderColor = " #2e4a70";
                /*hover color*/
                document.documentElement.style.setProperty('--date-hover-bg', '#24b0ba');

            });

            /*inactive-date backgroung and text color*/
            document.querySelectorAll(".inactive-date").forEach(element => {
                /*background color*/
                element.style.backgroundColor = "#bbc7d6";
                /*border color*/
                element.style.borderColor = " #2e4a70";
            });
            break;
        case "spring":

            /* the header's background and text color*/
            /*background color*/
            document.getElementById("head").style.backgroundColor = "#35522b"
            /*text color*/
            document.getElementById("head").style.color = "#ffffff"
            /*text shadow color*/
            document.getElementById("head").style.textShadow = "-4px 4px  rgb(93, 93, 93)"

            /*weather sections's background and text color*/
            document.querySelectorAll(".weather-section").forEach(element => {
                /*background color*/
                element.style.backgroundColor = "#799567";
                /*text color*/
                element.style.color = "#ffffff";

                // text shadow
                element.style.textShadow = "-1px 1px rgb(93, 93, 93)"
            });

            /*calendar sections's background and text color*/
            document.querySelectorAll(".calendar-section").forEach(element => {
                /*background color*/
                element.style.backgroundColor = "#a7b59e";
                /*text color*/
                element.style.color = "#ffffff";

                // text shadow
                element.style.textShadow = "-1px 1px rgb(93, 93, 93)"
            });


            /*days of the week backgroung and text color*/
            document.querySelectorAll(".day").forEach(element => {
                /*background color*/
                element.style.backgroundColor = "#f3baba";
                /*text color*/
                element.style.color = "#ffffff";
                /*border color*/
                element.style.borderColor = " #35522b";
            });

            /*date backgroung and text color*/
            document.querySelectorAll(".date").forEach(element => {
                /*background color*/
                element.style.backgroundColor = "#f9ddd8";
                /*text color*/
                element.style.color = "#ffffff";
                /*border color*/
                element.style.borderColor = " #35522b";
                /*hover color*/
                document.documentElement.style.setProperty('--date-hover-bg', '#a7b59e');
            });

            /*inactive-date backgroung and text color*/
            document.querySelectorAll(".inactive-date").forEach(element => {
                /*background color*/
                element.style.backgroundColor = "#f8d0c8";
                /*border color*/
                element.style.borderColor = " #35522b";
            });

            break;
    }


    document.querySelectorAll(".date").forEach(element => {
        element.addEventListener("mouseover", function () {
            element.style.backgroundColor = hover;
        })
        element.addEventListener("mouseout", function () {
            element.style.backgroundColor = day_bg;
        })
    });

    selector.style.backgroundColor = sidebar;
}

// function to update the calorie count for a specific day
function updateCalories(day, change) {
    let currentCalories = parseInt(localStorage.getItem(`calories-${day}`)) || 0;
    currentCalories += change;
    localStorage.setItem(`calories-${day}`, currentCalories);
    document.getElementById(`calories-${day}`).textContent = currentCalories;

    // update the calendar day with the calorie count
    const dateElement = document.getElementById(`date-${day}`);
    if (dateElement) {
        dateElement.textContent = `${day} (${currentCalories} cal)`;
    }
}

//Function for add task button
function addTaskPopup() {
    document.getElementById("popup-content").innerHTML = `

        <div>
            <h2>Task Maker: </h2>
            <button id="popup-close-btn" class="close-btn">Close</button>

            <form onsubmit="return false">
                <h3>When:</h3>
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" required>

                <label for="time">Time:</label>
                <input type="time" id="time" name="time" required>
                <br>

                <h3>Where:</h3>

                <label for="location">Address:</label>
                <input type="text" id="location" name="location">
                <br>

                <h3>What:</h3>
                <label for="desc">Description:</label>
                <br>
                
                <textarea id="desc" name="desc" rows="5" cols="25" maxlength="144" required></textarea>
                <br>

                <input type="submit" value="Submit" id="pushTask">
            </form>

            
        </div>
    `;

    document.getElementById("popup-close-btn").addEventListener("click", closePopup);
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay-bg").style.display = "block";
    document.getElementById("pushTask").addEventListener("click", () => addTask())


}

function addTask() {

    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var address = document.getElementById("location").value;
    var desc = document.getElementById("desc").value;

    if (date != null && time != null && desc != "") {

        localStorage.setItem(date, "1")
        if (localStorage.getItem(`${date}-taskAmount`) === "" || localStorage.getItem(`${date}-taskAmount`) === null) {
            localStorage.setItem(`${date}-taskAmount`, 1)
            localStorage.setItem(`${date}-task1`, desc)
            localStorage.setItem(`${date}-time1`, time)
            localStorage.setItem(`${date}-addy1`, address)
        } else {
            var taskAmount = parseInt(localStorage.getItem(`${date}-taskAmount`));
            taskAmount = taskAmount + 1;
            localStorage.setItem(`${date}-taskAmount`, (taskAmount))
            localStorage.setItem(`${date}-task${taskAmount}`, desc)
            localStorage.setItem(`${date}-time${taskAmount}`, time)
            localStorage.setItem(`${date}-addy${taskAmount}`, address)

        }
    }

}



document.addEventListener("DOMContentLoaded", () => {
    generateCalendar();
    updateGreetingAndWeather();
    updateStreak();
    updateTheme();
    setTheme();

});

