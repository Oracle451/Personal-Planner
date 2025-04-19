/**
 * Adds a new task to localStorage or updates an existing one.
 * Parameter: {number} taskNumb - The task number (0 for new).
 * Parameter: {string} oldDate - The previous date if editing.
 */
function addTask(taskNumb, oldDate) {
    const date = document.getElementById("date").value;
    const time = fixTime(document.getElementById("time").value);
    const address = document.getElementById("location").value;
    const desc = document.getElementById("desc").value;
    const title = document.getElementById("title").value;
    const givenDate = oldDate || "";

    if (title && date && time !== ":NaN am") {
        if (!localStorage.getItem(`${date}-taskAmount`)) {
            localStorage.setItem(`${date}-taskStart`, "1");
            localStorage.setItem(`${date}-taskAmount`, "1");
            localStorage.setItem(`${date}-task1`, title);
            localStorage.setItem(`${date}-desc1`, desc);
            localStorage.setItem(`${date}-time1`, time);
            localStorage.setItem(`${date}-addy1`, address);
        } else {
            let taskAmount =
                taskNumb && givenDate === date
                    ? taskNumb
                    : parseInt(localStorage.getItem(`${date}-taskAmount`)) + 1;
            localStorage.setItem(`${date}-taskAmount`, taskAmount);
            localStorage.setItem(`${date}-task${taskAmount}`, title);
            localStorage.setItem(`${date}-desc${taskAmount}`, desc);
            localStorage.setItem(`${date}-time${taskAmount}`, time);
            localStorage.setItem(`${date}-addy${taskAmount}`, address);
        }

        if (givenDate !== date && taskNumb) {
            removeTask(givenDate, taskNumb);
        }
    }
}

function populateUpcomingEvents() {
    const today = new Date();
    let taskCount = 0;

    document.getElementById("upcoming-event-sect").innerHTML =
        `
        <h2><u>Upcoming Events</u></h2>
        <p id="no-Tasks">Nothing to do...</p>`;

    for (i = 0; i < 8; i++) {

        const dateString = generateDateString(today.getDate() + i, true);
        if (doesDayHaveTasks(dateString)) {
            const taskAmount = localStorage.getItem(`${dateString}-taskAmount`);
            const taskStart = localStorage.getItem(`${dateString}-taskStart`);

            for (let k = taskStart; k <= taskAmount; k++) {
                if (taskCount < 5) {
                    const task = document.createElement("div");
                    taskCount++;
                    task.className = "upcoming-event";
                    task.innerHTML = `
                    <p><u>${localStorage.getItem(`${dateString}-task${k}`)}</u></p>
                    <p>Date: ${dateString}</p>
                    <p>Time: ${localStorage.getItem(`${dateString}-time${k}`)}</p>
                    <p>Where: ${localStorage.getItem(`${dateString}-addy${k}`) || "No Address"}</p>
                    <p>
                        ${localStorage.getItem(`${dateString}-desc${k}`) || "No Desc..."}
                    </p>
                    `;

                    document.getElementById("upcoming-event-sect").appendChild(task);
                } else {
                    k = taskAmount + 2;
                }
            }
        }
    }

    if (taskCount > 0) {
        document.getElementById("no-Tasks").innerHTML = '';
    } else {
        document.getElementById("no-Tasks").innerHTML = 'Nothing to do...';

    }
    setTheme();
}


/**
 * Removes a task from localStorage and shifts remaining tasks.
 * Parameter: {string} when - The date string of the task.
 * Parameter: {number} which - The task number to remove.
 */
function removeTask(when, which) {
    const taskStart = parseInt(localStorage.getItem(`${when}-taskStart`));
    localStorage.setItem(`${when}-task${which}`, localStorage.getItem(`${when}-task${taskStart}`));
    localStorage.setItem(`${when}-desc${which}`, localStorage.getItem(`${when}-desc${taskStart}`));
    localStorage.setItem(`${when}-time${which}`, localStorage.getItem(`${when}-time${taskStart}`));
    localStorage.setItem(`${when}-addy${which}`, localStorage.getItem(`${when}-addy${taskStart}`));
    localStorage.setItem(`${when}-taskStart`, taskStart + 1);

    localStorage.removeItem(`${when}-task${taskStart}`);
    localStorage.removeItem(`${when}-desc${taskStart}`);
    localStorage.removeItem(`${when}-time${taskStart}`);
    localStorage.removeItem(`${when}-addy${taskStart}`);

    location.reload();
}

/**
 * Checks if a day has any tasks in localStorage.
 * Parameter: {string} dateString - The date string to check.
 * @returns {boolean} True if tasks exist, false otherwise.
 */
function doesDayHaveTasks(dateString) {
    let total = -1;
    if (
        localStorage.getItem(`${dateString}-taskAmount`) !== null &&
        localStorage.getItem(`${dateString}-taskAmount`) > 0
    ) {
        const taskAmount = localStorage.getItem(`${dateString}-taskAmount`);
        const taskStart = localStorage.getItem(`${dateString}-taskStart`);
        total = taskAmount - taskStart;
    }

    if (total < 0) {
        localStorage.removeItem(`${dateString}-taskAmount`);
        localStorage.removeItem(`${dateString}-taskStart`);
        return false;
    }
    return true;
}


/**
 * Formats a time string into a 12-hour format with AM/PM.
 * Parameter: {string} timeStr - The time string (e.g., "13:05").
 * @returns {string} The formatted time (e.g., "1:05 pm").
 */
function fixTime(timeStr) {
    const [hours, minutes] = timeStr.split(":");
    let hourNum = parseInt(hours);
    const minuteNum = parseInt(minutes);

    if (hourNum > 0 && hourNum <= 12) {
        timeStr = `${hourNum}`;
    } else if (hourNum > 12) {
        timeStr = `${hourNum - 12}`;
    } else if (hourNum === 0) {
        timeStr = "12";
    }

    timeStr += minuteNum < 10 ? `:0${minuteNum}` : `:${minuteNum}`;
    timeStr += hourNum >= 12 ? " pm" : " am";
    return timeStr;
}

/**
 * Attaches event listeners to navigation and meal-related buttons.
 */

function makeButtons() {
    document.getElementById("back").addEventListener("click", () => updateOnScreen(-1));
    document.getElementById("next").addEventListener("click", () => updateOnScreen(1));
    document.getElementById("create-Meal").addEventListener("click", () => openCreateMealPopup());
    document.getElementById("log-Meal").addEventListener("click", () => openLogMealPopup());
    document.getElementById("view-Meals").addEventListener("click", () => openViewMealsPopup());
    document.getElementById("set-calorie-goal").addEventListener("click", () => openSetCalorieGoalPopup());
}

function generateDateString(day, bool) {
    // Determines whether to use real date or on-screen date
    let realDate = bool || false;
    let dateString;

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

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = { generateDateString, doesDayHaveTasks, addTask, removeTask, populateUpcomingEvents, fixTime };
}