// /**
//  * script.js - Main script for the calendar application.
//  */

let toastStack = []; // Global variable to track active toasts

/**
 * Fetches weather data and updates the greeting message with current time and weather info.
 * Displays an error message if the fetch fails.
 */
async function updateGreetingAndWeather() {
  try {
    const now = new Date();
    const hours = String(now.getHours());
    const minutes = String(now.getMinutes()).padStart(2, "0");
    let time = fixTime(`${hours}:${minutes}`);
    const day = now.getDate();
    const month = now.toLocaleString("default", { month: "long" });

    // Determine greeting based on time of day
    const greetingMessage =
      hours < 12 ? "Good Morning!" : hours < 18 ? "Good Afternoon!" : "Good Evening!";

    // Fetch weather data from Open-Meteo API
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=35.1050&longitude=-111.3712&current_weather=true&temperature_unit=fahrenheit"
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

    // Update the weather info box
    document.getElementById("weather-info").textContent = `${greetingMessage} It's ${time} on ${month} ${day}. 
      The weather is ${temperature}°F (${weather}).`;
  } catch (error) {
    document.getElementById("weather-info").textContent = "Unable to fetch weather data.";
  }
}

/**
 * Opens a popup for a specific day, displaying status buttons, calorie counter, and tasks.
 * Parameter: {number} day - The day of the month to display.
 */
function openPopup(day) {
  const dateString = generateDateString(day);

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
      <div class="cool-Line"></div>
      <div class="task-Area" id="task-Area">
        <h2>Tasks: </h2>
      </div>
    </div>
  `;

  // Show popup and overlay
  document.getElementById("popup").style.display = "flex";
  document.getElementById("overlay-bg").style.display = "block";

  // Attach event listeners after DOM update
  document.getElementById("status-good").addEventListener("click", () => setDayStatus(day, "good"));
  document.getElementById("status-decent").addEventListener("click", () => setDayStatus(day, "decent"));
  document.getElementById("status-bad").addEventListener("click", () => setDayStatus(day, "bad"));
  document.getElementById("popup-close-btn").addEventListener("click", closePopup);
  document
    .getElementById(`calories-plus-${day}`)
    .addEventListener("click", () => updateCalories(day, 100));
  document
    .getElementById(`calories-minus-${day}`)
    .addEventListener("click", () => updateCalories(day, -100));

  // Set initial calorie count
  const storedCalories = localStorage.getItem(`calories-${dateString}`);
  if (storedCalories) {
    document.getElementById(`calories-${dateString}`).textContent = storedCalories;
  }

  populateTaskArea(day);
}

/**
 * Closes the currently open popup and hides the overlay.
 */
function closePopup() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("overlay-bg").style.display = "none";
}

/**
 * Sets the status (good/decent/bad) for a day, restricting to today or yesterday.
 * Parameter: {number} day - The day of the month.
 * Parameter: {string} status - The status to set ("good", "decent", "bad").
 */
function setDayStatus(day, status) {
  const dateString = generateDateString(day);
  const inputDate = new Date(onScreenDate.getFullYear(), onScreenDate.getMonth(), day);

  // Normalize dates to midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  // Allow status updates only for today or yesterday
  if (inputDate.getTime() === today.getTime() || inputDate.getTime() === yesterday.getTime()) {
    localStorage.setItem(`${dateString}-stat`, status);
    closePopup();
    generateCalendar(onScreenDate);
    updateStreak();
  } else {
    showToast("You can only rate today and yesterday");
  }
}

/**
 * Calculates and updates the streak of consecutive "good" days.
 */
function updateStreak() {
  let streak = 0;
  let today = new Date().getDate();
  let k = 0;
  let dateString = generateDateString(today, true);
  let status = localStorage.getItem(`${dateString}-stat`);

  // Count consecutive "good" days
  while (status !== null && status === "good") {
    streak++;
    k++;
    dateString = generateDateString(today - k, true);
    status = localStorage.getItem(`${dateString}-stat`);
  }

  // Update storage and UI
  localStorage.setItem("streak", streak);
  document.getElementById("streak-count").textContent = streak;
  setHighestStreak(streak);
}

/**
 * Updates the highest streak if the current streak exceeds it.
 * Parameter: {number} streakCount - The current streak count.
 */
function setHighestStreak(streakCount) {
  const currentHigh = localStorage.getItem("streak-High");
  if (currentHigh !== null) {
    if (streakCount > currentHigh) {
      localStorage.setItem("streak-High", streakCount);
    }
  } else {
    localStorage.setItem("streak-High", streakCount);
  }

  document.getElementById("peak-streak").textContent = localStorage.getItem("streak-High");
}

/**
 * Sets up the theme selector and updates the theme on change.
 */
function updateTheme() {
  const selector = document.getElementById("themes");

  selector.onchange = (event) => {
    localStorage.setItem("theme", selector.value);
    setTheme();
    showToast(`Theme Set To ${selector.value}`);
  };
}

/**
 * Applies the selected theme by loading colors from storage and applying them.
 */
function setTheme() {
  const selector = document.getElementById("themes");
  selector.value = localStorage.getItem("theme") || "Deep Ocean"; // Default theme

  let colors = {};
  switch (selector.value) {
    case "Clear Sky":
      colors = {
        backgroundColor1: "#73c7e3", // Header Background
        backgroundColor2: "#f0f2f2", // Sidebar Background
        backgroundColor3: "#fff9f0", // Calendar Section Background
        calendarColor1: "#73c7e3", // Weekdays Header
        calendarColor2: "#bbc7d6", // Inactive Days
        calendarColor3: "#fff9f0", // Active Month Days
        textColor1: "#ffffff", // Header Text
        textColor2: "#2e4a70", // Sidebar Text
        textColor3: "#2e4a70", // Calendar Section Text
      };
      break;
    case "Spring":
      colors = {
        backgroundColor1: "#35522b",
        backgroundColor2: "#799567",
        backgroundColor3: "#a7b59e",
        calendarColor1: "#f3baba",
        calendarColor2: "#f8d0c8",
        calendarColor3: "#f9ddd8",
        textColor1: "#ffffff",
        textColor2: "#ffffff",
        textColor3: "#162814",
      };
      break;
    case "Crimson":
      colors = {
        backgroundColor1: "#313131",
        backgroundColor2: "#364651",
        backgroundColor3: "#393d42",
        calendarColor1: "#d3423d",
        calendarColor2: "#99180d",
        calendarColor3: "#b23028",
        textColor1: "#ffffff",
        textColor2: "#ffffff",
        textColor3: "#ffffff",
      };
      break;
    case "Deep Ocean":
      colors = {
        backgroundColor1: "#001f3f", // Header Background
        backgroundColor2: "#003b6f", // Sidebar Background
        backgroundColor3: "#002b50", // Calendar Section Background
        calendarColor1: "#5a6e7f",   // Weekdays Header
        calendarColor2: "#667684",   // Inactive Days
        calendarColor3: "#7a8a99",   // Active Month Days
        textColor1: "#ffffff",       // Header Text
        textColor2: "#e0e0e0",       // Sidebar Text
        textColor3: "#f0f8ff",       // Calendar Section Text
      };
      break;
  }

  applyTheme(colors);
}

/**
 * Applies theme colors to various DOM elements.
 * Parameter: {Object} colors - The color scheme to apply.
 */
function applyTheme(colors) {
  document.getElementById("head").style.backgroundColor = colors.backgroundColor1;
  document.getElementById("head").style.color = colors.textColor1;

  document.querySelectorAll(".sidebar").forEach((element) => {
    element.style.backgroundColor = colors.backgroundColor2;
    element.style.color = colors.textColor2;
  });

  document.querySelectorAll(".calendar-section").forEach((element) => {
    element.style.backgroundColor = colors.backgroundColor3;
    element.style.color = colors.textColor3;
  });

  document.querySelectorAll(".day").forEach((element) => {
    element.style.backgroundColor = colors.calendarColor1;
    element.style.color = colors.textColor3;
  });

  document.querySelectorAll(".date").forEach((element) => {
    element.style.backgroundColor = colors.calendarColor3;
    element.style.color = colors.textColor3;
    element.style.fontSize = "12px";
  });

  document.querySelectorAll(".sidebarBtn").forEach((element) => {
    element.style.backgroundColor = colors.calendarColor1;
  });

  document.querySelectorAll(".monthChangeBtn").forEach((element) => {
    element.style.backgroundColor = colors.calendarColor1;
  });

  document.querySelectorAll(".inactive-date").forEach((element) => {
    element.style.backgroundColor = colors.calendarColor2;
  });

  document.querySelectorAll(".upcoming-event").forEach((element) => {
    element.style.backgroundColor = colors.backgroundColor3;
  });

  document.querySelectorAll(".option-content").forEach((element) => {
    element.style.backgroundColor = colors.calendarColor2;
  });

  document.querySelectorAll(".add-task").forEach((element) => {
    element.style.backgroundColor = colors.calendarColor1;
  });

  document.querySelectorAll(".current-date").forEach((element) => {
    element.style.backgroundColor = colors.calendarColor1;
  });

  document.querySelectorAll(".task").forEach((element) => {
    element.style.backgroundColor = colors.calendarColor2;
  });
}

/**
 * Displays a toast notification with the given message.
 * Parameter: {string} message - The message to display.
 */
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = `! ${message} !`;

  // Apply toast styles
  Object.assign(toast.style, {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "white",
    color: "black",
    padding: "12px 20px",
    border: "2px solid black",
    borderRadius: "10px",
    fontWeight: "bold",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
    opacity: "0",
    transition: "opacity 0.5s",
    zIndex: "1000",
  });

  // Add to DOM and track
  document.body.appendChild(toast);
  toastStack.push(toast);

  // Position vertically
  const toastHeight = 60;
  const baseOffset = 30;
  const index = toastStack.length - 1;
  toast.style.bottom = `${baseOffset + index * toastHeight}px`;

  // Fade in
  setTimeout(() => (toast.style.opacity = "1"), 100);

  // Fade out and remove
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
      toastStack = toastStack.filter((t) => t !== toast);
      updateToastPositions();
    }, 500);
  }, 2500);
}

/**
 * Updates the vertical positions of all active toasts.
 */
function updateToastPositions() {
  const toastHeight = 60;
  const baseOffset = 30;

  toastStack.forEach((toast, index) => {
    toast.style.bottom = `${baseOffset + index * toastHeight}px`;
  });
}

/**
 * Clears all localStorage and old data, showing a confirmation toast.
 */
function clearCookies() {
  localStorage.clear();
  clearOldLocalStorage();
  showToast("Cookies Have Been cleared");
}

/**
 * Removes localStorage items older than 6 months after user confirmation.
 */
function clearOldLocalStorage() {

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const itemsToRemove = [];
  const datePattern = /\d{4}-\d{2}-\d{2}/;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const dateMatch = key.match(datePattern);
    if (dateMatch) {
      const dateStr = dateMatch[0];
      const itemDate = new Date(dateStr);
      if (!isNaN(itemDate.getTime()) && itemDate < sixMonthsAgo) {
        itemsToRemove.push(key);
      }
    }
  }

  itemsToRemove.forEach((key) => localStorage.removeItem(key));
  if (itemsToRemove.length > 0) {
    showToast(`Cleared ${itemsToRemove.length} old items from storage`);
  }
}

/**
 * Updates the calorie count for a specific day and reflects it in the UI.
 * Parameter: {number} day - The day of the month.
 * Parameter: {number} change - The amount to add or subtract.
 */
function updateCalories(day, change) {
  const dateString = generateDateString(day);
  let currentCalories = parseInt(localStorage.getItem(`calories-${dateString}`)) || 0;
  currentCalories += change;
  if (currentCalories < 0) currentCalories = 0; // Prevent negative calories
  localStorage.setItem(`calories-${dateString}`, currentCalories);
  document.getElementById(`calories-${dateString}`).textContent = currentCalories;

  const dateElement = document.getElementById(`date-${day}`);
  if (dateElement) {
    dateElement.textContent = `${day} (${currentCalories} cal)`;
  }
  
  // Update sidebar if it's today's date
  const today = new Date();
  if (dateString === generateDateString(today.getDate(), true)) {
    updateCalorieDisplay();
  }
}

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
 * Sets up the task edit popup with existing task data.
 * Parameter: {string} when - The date string of the task.
 * Parameter: {number} which - The task number to edit.
 */
function editTaskSetUp(when, which) {
  const title = localStorage.getItem(`${when}-task${which}`);
  const desc = localStorage.getItem(`${when}-desc${which}`);
  const fakeTime = localStorage.getItem(`${when}-time${which}`);
  const addy = localStorage.getItem(`${when}-addy${which}`);

  const [hours, rest] = fakeTime.split(":");
  const [minutes, amPm] = rest.split(" ");
  let time = `${parseInt(hours) + (amPm === "pm" ? 12 : 0)}:${minutes}`;
  time = time.padStart(5, "0");

  addTaskPopup(title, desc, when, time, addy, which);
}

/**
 * Opens a popup for adding or editing a task.
 * Parameter: {string} title - The task title.
 * Parameter: {string} desc - The task description.
 * Parameter: {string} date - The task date.
 * Parameter: {string} time - The task time.
 * Parameter: {string} addy - The task address.
 * Parameter: {number} task - The task number (0 for new).
 */
function addTaskPopup(title, desc, date, time, addy, task) {
  const givenTitle = title || "";
  const givenDesc = desc || "";
  const givenDate = date || "";
  const givenTime = time || ":NaN am";
  const givenAddy = addy || "";
  const givenTask = task || 0;

  document.getElementById("popup-content").innerHTML = `
    <div>
      <h2>Task Maker: </h2>
      <hr>
      <br>
      <button id="popup-close-btn" class="close-btn">Close</button>
      <form>
        <h3>What:</h3>
        <label for="title">Title:</label>
        <br>
        <textarea id="title" name="title" maxlength="16" class="inputArea" required>${givenTitle}</textarea>
        <br>
        <br>
        <label for="desc">Description:</label>
        <br>
        <textarea id="desc" name="desc" rows="5" cols="25" maxlength="144" class="inputArea">${givenDesc}</textarea>
        <br>
        <h3>When:</h3>
        <label for="date">Date:</label>
        <input type="date" id="date" name="date" value="${givenDate}" class="inputArea" required>
        <br>
        <br>
        <label for="time">Time:</label>
        <input type="time" id="time" name="time" value="${givenTime}" class="inputArea" required>
        <br>
        <h3>Where:</h3>
        <label for="location">Address:</label>
        <input type="text" id="location" name="location" value="${givenAddy}" class="inputArea">
        <br>
        <br>
        <input type="submit" value="Submit" id="pushTask" class="submenuBtn">
      </form>
    </div>
  `;

  document.getElementById("popup-close-btn").addEventListener("click", closePopup);
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay-bg").style.display = "block";
  document.getElementById("pushTask").addEventListener("click", () => addTask(givenTask, date));
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
 * Populates the task area in the day popup with tasks from localStorage.
 * Parameter: {number} numb - The day of the month.
 */
function populateTaskArea(numb) {
  const dateString = generateDateString(numb);

  if (doesDayHaveTasks(dateString)) {
    const taskAmount = localStorage.getItem(`${dateString}-taskAmount`);
    const taskStart = localStorage.getItem(`${dateString}-taskStart`);
    for (let k = taskStart; k <= taskAmount; k++) {
      const task = document.createElement("div");
      task.className = "task-Long";
      task.innerHTML = `
        <p>
          Title: ${localStorage.getItem(`${dateString}-task${k}`)} at
          <span class="times">${localStorage.getItem(`${dateString}-time${k}`)}</span>
          <br>
          Where: ${localStorage.getItem(`${dateString}-addy${k}`) || "Not Provided"}
          <br>
          Description: ${localStorage.getItem(`${dateString}-desc${k}`) || "Not Provided"}
          <br>
          <button class="edit-Task" id="edit-${dateString}-task${k}">edit</button>
          <button class="remove-Task" id="remove-${dateString}-task${k}">remove</button>
        </p>
      `;
      document.getElementById("task-Area").appendChild(task);
      document
        .getElementById(`edit-${dateString}-task${k}`)
        .addEventListener("click", () => editTaskSetUp(dateString, k));
      document
        .getElementById(`remove-${dateString}-task${k}`)
        .addEventListener("click", () => removeTask(dateString, k));
    }
  } else {
    document.getElementById("task-Area").innerHTML = `
      <h2>Tasks:</h2>
      <p>Nothing to Show!</p>
    `;
  }
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

// Jest compatibility for testing
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = { addTask, removeTask, doesDayHaveTasks };
}

function populateUpcomingEvents() {
  const today = new Date();
  let taskCount = 0;

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
 * Initializes the application on DOM load.
 */
document.addEventListener("DOMContentLoaded", () => {
  makeButtons();
  updateOnScreen(0);
  updateGreetingAndWeather();
  updateStreak();
  updateTheme();
  setTheme();
  clearOldLocalStorage();
  populateUpcomingEvents();
  updateCalorieDisplay();
});

/**
 * Opens a popup to set the daily calorie goal
 */
function openSetCalorieGoalPopup() {
  // Get current goal from localStorage or default to 0
  const currentGoal = localStorage.getItem("dailyCalorieGoal") || "0";

  document.getElementById("popup-content").innerHTML = `
    <div>
      <h2>Set Daily Calorie Goal</h2>
      <button id="popup-close-btn" class="close-btn">Close</button>
      <form id="calorie-goal-form">
        <div>
          <label for="calorie-goal">Daily Calorie Goal:</label>
          <input
            type="number"
            id="calorie-goal"
            name="calorie-goal"
            min="0"
            value="${currentGoal}"
            class="inputArea"
            required
          >
        </div>
        <br>
        <div>
          <p>Visit This Website to Calculate your Exact Calorie Goal: 
            <a href="https://www.calculator.net/calorie-calculator.html" target="_blank">Calorie Calculator</a>
          </p>
        </div>
        <br>
        <button type="submit" class="submenuBtn">Set Goal</button>
      </form>
    </div>
  `;

  // Show popup and overlay
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay-bg").style.display = "block";

  // Add event listeners
  document.getElementById("popup-close-btn").addEventListener("click", closePopup);
  document
    .getElementById("calorie-goal-form")
    .addEventListener("submit", handleCalorieGoalSubmit);
}

/**
 * Handles the submission of the calorie goal form
 * @param {Event} event - The form submission event
 */
function handleCalorieGoalSubmit(event) {
  event.preventDefault();
  
  const calorieGoal = document.getElementById("calorie-goal").value;
  localStorage.setItem("dailyCalorieGoal", calorieGoal);
  
  closePopup();
  updateCalorieDisplay(); // Update the sidebar display
  showToast(`Daily Calorie Goal set to ${calorieGoal} calories`);
}

/**
 * Updates the calorie display in the sidebar with current day's count and goal
 */
function updateCalorieDisplay() {
  const today = new Date();
  const dateString = generateDateString(today.getDate(), true);
  const currentCalories = localStorage.getItem(`calories-${dateString}`) || "0";
  const dailyGoal = localStorage.getItem("dailyCalorieGoal") || "0";
  
  const calorieSection = document.querySelector(".calorie-section"); // Third streak-section is for calories
  calorieSection.innerHTML = `
    <h2><u>Calories</u></h2>
    <p>Todays Calories: <span id="today-calories">${currentCalories}</span></p>
    <p>Daily Calorie Goal: <span id="daily-goal">${dailyGoal}</span></p>
    <button class="sidebarBtn" id="set-calorie-goal">Set Daily Calorie Goal</button>
  `;
  
  // Reattach event listener
  document
    .getElementById("set-calorie-goal")
    .addEventListener("click", openSetCalorieGoalPopup);
  
  // Reapply theme to ensure button matches current theme
  setTheme();
}