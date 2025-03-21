let onScreenDate = new Date();

function updateOnScreen(num) {
    switch (num) {
        case 1:
            onScreenDate = new Date(onScreenDate.getFullYear(), onScreenDate.getMonth() + 2, 0)

            break;
        case -1:
            onScreenDate = new Date(onScreenDate.getFullYear(), onScreenDate.getMonth(), 0)
            break;
        default:
            break;
    }

    document.getElementById('current-month').textContent = `${onScreenDate.toLocaleString('default', { month: 'long' })} : ${onScreenDate.getFullYear().toString()}`;
    generateCalendar(onScreenDate);

}

async function updateGreetingAndWeather() {
    try {
        const now = new Date();
        const hours = String(now.getHours());
        const minutes = String(now.getMinutes());
        let time = hours + ":" + minutes;
        time = fixTime(time);
        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' });

        let greetingMessage = hours < 12 ? "Good Morning!" :
            hours < 18 ? "Good Afternoon!" : "Good Evening!";

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
            `${greetingMessage} It's ${time} on ${month} ${day}. 
            The weather is ${temperature}°F (${weather}).`;
    } catch (error) {
        document.getElementById("weather-info").textContent =
            "Unable to fetch weather data.";
    }
}

function generateDateString(day, bool) {

    let realDate = bool || false;

    if (!realDate) {
        let date = new Date(onScreenDate.getFullYear(), onScreenDate.getMonth(), day);
        if (parseInt(date.getMonth() + 1) < 10) {
            dateString = `${date.getFullYear()}-0${date.getMonth() + 1}`;
        } else {
            dateString = `${date.getFullYear()}-${date.getMonth() + 1}`;
        }

        if (parseInt(date.getDate()) < 10) {
            dateString = `${dateString}-0${date.getDate()}`;
        } else {
            dateString = `${dateString}-${date.getDate()}`;
        }

    } else {
        let trueDate = new Date();
        let date = new Date(trueDate.getFullYear(), trueDate.getMonth(), day);

        if (parseInt(date.getMonth()) < 10) {
            dateString = `${date.getFullYear()}-0${date.getMonth() + 1}`;
        } else {
            dateString = `${date.getFullYear()}-${date.getMonth() + 1}`;
        }

        if (parseInt(date.getDate()) < 10) {
            dateString = `${dateString}-0${date.getDate()}`;
        } else {
            dateString = `${dateString}-${date.getDate()}`;
        }

    }



    return dateString;
}

function generateCalendar(today) {


    const calendarElement = document.getElementById("calendar");
    calendarElement.innerHTML = "";
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
        let task = document.createElement("div");

        let dateString = generateDateString(i);

        dateElement.className = "date";
        dateElement.textContent = i;
        dateElement.addEventListener("click", () => openPopup(i));


        if (localStorage.getItem(`${dateString}-stat`) !== null) {
            let status = localStorage.getItem(`${dateString}-stat`);
            dateElement.classList.remove("good", "decent", "bad");
            if (status) {
                dateElement.classList.add(status);
            }

        }

        /* Based on dateString, attempts to add Tasks for that day*/

        if (doesDayHaveTasks(dateString)) {
            let taskAmount = localStorage.getItem(`${dateString}-taskAmount`);
            let taskStart = localStorage.getItem(`${dateString}-taskStart`);

            task = document.createElement("div");
            task.className = "task";
            task.textContent = `${localStorage.getItem(`${dateString}-task${taskStart}`)} ${localStorage.getItem(`${dateString}-time${taskStart}`)}`;
            dateElement.appendChild(task);


            if (taskAmount - taskStart > 0) {
                task = document.createElement("div");
                task.className = "see-More";
                task.textContent = `See ${taskAmount - taskStart} more...`;
                dateElement.appendChild(task);
            }
        }

        calendarElement.appendChild(dateElement);

    }
    /* creates filler after this month */
    for (let i = 0; i > days_in_month + weekday - 42; i--) {
        const dateElement = document.createElement("div");
        dateElement.className = "inactive-date";
        calendarElement.appendChild(dateElement);
    }
    document.getElementById(`add-task`).addEventListener("click", () => addTaskPopup());
    setTheme();
    updateStreak();

}

function openPopup(day) {
    // inner html for popup
    let dateString = generateDateString(day);

    document.getElementById("popup-content").innerHTML = `
         
        <div class="day-Popup">
            <div class="calorie-counter">
                <h2>Day: ${day}</h2>
                <button id="status-good" class="status-btn good">Good</button>
                <button id="status-decent" class="status-btn decent">Decent</button>
                <button id="status-bad" class="status-btn bad">Bad</button>
                <button id="popup-close-btn" class="close-btn">Close</button>

                <h2>Calories: <span id="calories-${dateString}">0</span></h2>
                <button id="calories-plus-${day}" class="calorie-btn">+100</button>
                <button id="calories-minus-${day}" class="calorie-btn">-100</button>
            </div>

            
            <div class="cool-Line">
                
            </div>

            <div class="task-Area" id="task-Area">
                <h2>Tasks: </h2>
            </div>


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
    let storedCalories = localStorage.getItem(`calories-${dateString}`);
    if (storedCalories) {
        document.getElementById(`calories-${dateString}`).textContent = storedCalories;
    }

    populateTaskArea(day);
}


function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay-bg").style.display = "none";
}

function setDayStatus(day, status) {
    let dateString = generateDateString(day);
    localStorage.setItem(`${dateString}-stat`, status);
    closePopup();
    generateCalendar(onScreenDate);
    updateStreak();

}


function updateStreak() {
    let streak = 0;
    let today = new Date().getDate();
    let k = 0;

    let dateString = generateDateString(today, true);
    let status = localStorage.getItem(`${dateString}-stat`)

    while (status !== null && status === "good") {
        streak++;
        k++;

        dateString = generateDateString(today - k, true);
        status = localStorage.getItem(`${dateString}-stat`)
    }

    localStorage.setItem("streak", streak);
    document.getElementById("streak-count").textContent = streak;
    setHighestStreak(streak);
}

function setHighestStreak(streakCount) {

    if (localStorage.getItem("streak-High") !== null) {
        if (streakCount > localStorage.getItem("streak-High")) {
            localStorage.setItem("streak-High", streakCount);
        }
    } else {
        localStorage.setItem("streak-High", streakCount);
    }

    document.getElementById("peak-streak").textContent = localStorage.getItem("streak-High");

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

            // change options color
            document.querySelectorAll(".option-content").forEach(element => {
                /*background color*/
                element.style.backgroundColor = "#cf8a40";
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

            // change options color
            document.querySelectorAll(".option-content").forEach(element => {
                /*background color*/
                element.style.backgroundColor = "#f3baba";
            });

            break;

    }


    /*
    document.querySelectorAll(".date").forEach(element => {
        element.addEventListener("mouseover", function () {
            element.style.backgroundColor = hover;
        })
        element.addEventListener("mouseout", function () {
            element.style.backgroundColor = day_bg;
        })
    });
    */

    //selector.style.backgroundColor = sidebar;
}

// function to update the calorie count for a specific day
function updateCalories(day, change) {
    let dateString = generateDateString(day);
    let currentCalories = parseInt(localStorage.getItem(`calories-${dateString}`)) || 0;
    currentCalories += change;
    localStorage.setItem(`calories-${dateString}`, currentCalories);
    document.getElementById(`calories-${dateString}`).textContent = currentCalories;

    // update the calendar day with the calorie count
    const dateElement = document.getElementById(`date-${day}`);
    if (dateElement) {
        dateElement.textContent = `${day} (${currentCalories} cal)`;
    }
}

function addTask(taskNumb, oldDate) {

    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;

    time = fixTime(time);

    var address = document.getElementById("location").value;
    var desc = document.getElementById("desc").value;
    var title = document.getElementById("title").value;

    let givenDate = oldDate || "";

    if (title !== "" && date !== "" && time !== ":NaN am") {

        if (localStorage.getItem(`${date}-taskAmount`) === "" || localStorage.getItem(`${date}-taskAmount`) === null) {

            console.log("Hey")
            localStorage.setItem(`${date}-taskStart`, 1);
            localStorage.setItem(`${date}-taskAmount`, 1)

            localStorage.setItem(`${date}-task1`, title)
            localStorage.setItem(`${date}-desc1`, desc)
            localStorage.setItem(`${date}-time1`, time)
            localStorage.setItem(`${date}-addy1`, address)
        } else {
            var taskAmount;
            console.log("Here!");
            if (taskNumb != 0 && givenDate === date) {
                taskAmount = taskNumb;
            } else {
                taskAmount = parseInt(localStorage.getItem(`${date}-taskAmount`));
                taskAmount += 1;
                localStorage.setItem(`${date}-taskAmount`, (taskAmount))
            }

            localStorage.setItem(`${date}-task${taskAmount}`, title)
            localStorage.setItem(`${date}-desc${taskAmount}`, desc)
            localStorage.setItem(`${date}-time${taskAmount}`, time)
            localStorage.setItem(`${date}-addy${taskAmount}`, address)

        }

        if (givenDate !== date && taskNumb != 0) {
            removeTask(givenDate, taskNumb);
        }

    }





}


function removeTask(when, which) {

    let taskStart = parseInt(localStorage.getItem(`${when}-taskStart`));

    localStorage.setItem(`${when}-task${which}`, localStorage.getItem(`${when}-task${taskStart}`));
    localStorage.setItem(`${when}-desc${which}`, localStorage.getItem(`${when}-desc${taskStart}`));
    localStorage.setItem(`${when}-time${which}`, localStorage.getItem(`${when}-time${taskStart}`));
    localStorage.setItem(`${when}-addy${which}`, localStorage.getItem(`${when}-addy${taskStart}`));

    localStorage.setItem(`${when}-taskStart`, taskStart + 1);

    localStorage.removeItem(`${when}-task${taskStart}`);
    localStorage.removeItem(`${when}-desc${taskStart}`);
    localStorage.removeItem(`${when}-time${taskStart}`);
    localStorage.removeItem(`${when}-addy${taskStart}`);

}

function editTaskSetUp(when, which) {

    let title = localStorage.getItem(`${when}-task${which}`);
    let desc = localStorage.getItem(`${when}-desc${which}`);
    let fakeTime = localStorage.getItem(`${when}-time${which}`);
    let addy = localStorage.getItem(`${when}-addy${which}`);


    let time = fakeTime.split(':');
    let hours = time[0];
    let minutes = time[1].split(' ')[0];
    let amPm = time[1].split(' ')[1];

    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (amPm === "pm") {
        hours += 12;
    }

    time = "";
    time += (hours < 10) ? "0" + hours : hours;
    time += (minutes < 10) ? ":0" + minutes : ":" + minutes;


    addTaskPopup(title, desc, when, time, addy, which);
}


//Function for add task button
function addTaskPopup(title, desc, date, time, addy, task) {

    let givenTitle = title || "";
    let givenDesc = desc || "";
    let givenDate = date || "";
    let givenTime = time || ":NaN am";
    let givenAddy = addy || "";
    let givenTask = task || 0;

    document.getElementById("popup-content").innerHTML = `

        <div>
            <h2>Task Maker: </h2>
            <button id="popup-close-btn" class="close-btn">Close</button>

            <form>
                <h3>What:</h3>

                <label for="title">Title:</label>
                <br>
                
                <textarea id="title" name="title" maxlength="16" required>${givenTitle}</textarea>
                <br>

                <br>
                <label for="desc">Description:</label>
                <br>
                
                <textarea id="desc" name="desc" rows="5" cols="25" maxlength="144">${givenDesc}</textarea>
                <br>



                <h3>When:</h3>
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" value="${givenDate}"required>

                <label for="time">Time:</label>
                <input type="time" id="time" name="time" value="${givenTime}"required>
                <br>

                <h3>Where:</h3>

                <label for="location">Address:</label>
                <input type="text" id="location" name="location" value="${givenAddy}">
                <br>

                <br>

                <input type="submit" value="Submit" id="pushTask">
            </form>

            
        </div>
    `;

    document.getElementById("popup-close-btn").addEventListener("click", closePopup);
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay-bg").style.display = "block";

    document.getElementById("pushTask").addEventListener("click", () => addTask(givenTask, date));


}

function doesDayHaveTasks(dateString) {
    let total = -1;
    if (localStorage.getItem(`${dateString}-taskAmount`) !== null && localStorage.getItem(`${dateString}-taskAmount`) > 0) {
        let taskAmount = localStorage.getItem(`${dateString}-taskAmount`);
        let taskStart = localStorage.getItem(`${dateString}-taskStart`);
        total = taskAmount - taskStart;
    }

    if (total < 0) {
        localStorage.removeItem(`${dateString}-taskAmount`);
        localStorage.removeItem(`${dateString}-taskStart`);
        return false;
    }

    return true;

}

function populateTaskArea(numb) {

    let dateString = generateDateString(numb);

    if (doesDayHaveTasks(dateString)) {
        let taskAmount = localStorage.getItem(`${dateString}-taskAmount`);
        let taskStart = localStorage.getItem(`${dateString}-taskStart`);
        for (let k = taskStart; k <= taskAmount; k++) {
            task = document.createElement("div");
            task.className = "task-Long";
            task.innerHTML = `
                <p>Title: ${localStorage.getItem(`${dateString}-task${k}`)} at <span class="times">${localStorage.getItem(`${dateString}-time${k}`)}</span>
                    <br>
                
                    Where: ${localStorage.getItem(`${dateString}-addy${k}`)}
                    <br>
                    Description: ${localStorage.getItem(`${dateString}-desc${k}`)}
                    <br>
                    <button class="edit-Task" id="edit-${dateString}-task${k}">edit</button>
                    <button class="remove-Task" id="remove-${dateString}-task${k}">remove</button>
                </p> 
            `;

            document.getElementById("task-Area").appendChild(task);
            document.getElementById(`edit-${dateString}-task${k}`).addEventListener("click", () => editTaskSetUp(dateString, k));
            document.getElementById(`remove-${dateString}-task${k}`).addEventListener("click", () => removeTask(dateString, k));

        }
    } else {
        document.getElementById("task-Area").innerHTML = `
                <h2>Tasks:</h2>
                <p>
                Nothing to Show!
                </p>
            `;
    }
}

function fixTime(timeStr) {

    var time = timeStr.split(':');
    var hours = time[0];
    var minutes = time[1];
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (hours > 0 && hours <= 12) {
        time = "" + hours;
    } else if (hours > 12) {
        time = "" + (hours - 12);
    } else if (hours == 0) {
        time = "12";
    }

    time += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    time += (hours >= 12) ? " pm" : " am";

    return time;

}


function makeButtons() {
    document.getElementById("back").addEventListener("click", () => updateOnScreen(-1));
    document.getElementById("next").addEventListener("click", () => updateOnScreen(1));
}



document.addEventListener("DOMContentLoaded", () => {

    makeButtons();
    updateOnScreen(0);
    updateGreetingAndWeather();
    updateStreak();
    updateTheme();
    setTheme();

});

// Function to clear local cookies for the website
// Called by the clear-button
function clearCookies() {
    // Clear local storage
    localStorage.clear()
}

