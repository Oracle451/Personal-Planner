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
          <p>
            <button class="submenuBtn" onclick="window.open('https://www.calculator.net/calorie-calculator.html', '_blank')">
              Calculate Your Calorie Goal
            </button>
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
  const currentCalories = parseInt(localStorage.getItem(`calories-${dateString}`) || "0");
  const dailyGoal = parseInt(localStorage.getItem("dailyCalorieGoal") || "0");
  const remainingCalories = Math.max(dailyGoal - currentCalories, 0);


  const calorieSection = document.querySelector(".calorie-section"); // Third streak-section is for calories
  calorieSection.innerHTML = `
    <h2><u>Calories</u></h2>
    <p>Today's Calories: <span id="today-calories">${currentCalories}</span></p>
    <p>Calories Remaining: <span id="calories-remaining">${remainingCalories}</span></p>
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

/*
 * Writes all local storage to a file and downloads the file
 */
function downloadSave() {
  // get the size of the local storage
  var size = localStorage.length;
  // set the file content to be empty
  var fileContent = "";
  // loop though the lenght of the local storage
  for (let i = 0; i < size; i++) {
    // get the key 
    let key = localStorage.key(i);
    // use key to get the value from key
    let content = localStorage.getItem(key);
    // set the file content to the key-value pair
    fileContent += `${key}|${content || ""}`;
    // check if last element
    if (i < size - 1) {
      // add separator if not last element
      fileContent += "\\/";
    }
  }

  // Create a Blob with the content
  const blob = new Blob([fileContent], { type: 'text/plain' });
  // Create a link element
  const link = document.createElement('a');
  // Create an object URL for the Blob
  const url = URL.createObjectURL(blob);
  // Set the 'href' attribute of the link to the Blob URL
  link.href = url;
  // Set the 'download' attribute to specify the filename
  link.download = 'ironMan-save';
  // Append the link to the DOM temporarily (it doesn't need to be visible)
  document.body.appendChild(link);
  // Programmatically click the link to start the download
  link.click();
  // Clean up by revoking the object URL
  URL.revokeObjectURL(url);
  // Remove the link element from the DOM
  document.body.removeChild(link);
}

/* 
 * Opens a popup to upload a file 
 * Offers the option to keep current tasks, workouts, and routines, etc
 */
function uploadSavePopup() {
  document.getElementById("popup-content").innerHTML = `
  <button id="popup-close-btn" class="close-btn">Close</button>
  <div id="upload-popup">
    <h2>Upload File</h2>
    <div id="drop-box">
    Drag and drop files here
    <br>
    Or click to select a file
    </div>
    <input type="file" hidden id="file-input">

    <form>
      <input type="radio" id="append-save" name="save-type" value="append" checked>
      <label for="append-save">Appened the loaded save with the current save</label>
      <br>

      <input type="radio" id="write-over" name="save-type" value="overwrite">
      <label for="write-over">Write over the current save with the new save</label>
    </form>
    <button id="submit-file">Submit</button>
  </div>
`;

// Add close button functionality
document.getElementById("popup-close-btn").addEventListener("click", closePopup);

// Show the popup and overlay
document.getElementById("popup").style.display = "block";
document.getElementById("overlay-bg").style.display = "block";

var dropBox = document.getElementById("drop-box");
var fileInput = document.getElementById("file-input");
var files = null; // 👈 define it here so it’s shared across the script

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropBox.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Handle file drop
dropBox.addEventListener('drop', e => {
  files = e.dataTransfer.files; // 👈 assign to the shared variable
  console.log("Dropped files:", files);
  dropBox.style.backgroundColor = "grey";
});

// Open file selector on click
dropBox.addEventListener("click", () => {
  fileInput.click();
});

// Handle selecting a file
fileInput.addEventListener("change", e => {
  files = e.target.files; // 👈 again, assign to the shared variable
  dropBox.style.backgroundColor = "grey";
});

// Submit the file for processing
document.getElementById("submit-file").addEventListener("click", () => {
  loadSave(files);
});

}

/*
 * Takes a file and loads the content into local storage
 */
function loadSave(files) {
  // initialize file unpacking
  const file = files[0];
  const reader = new FileReader();
  // grab the type of load
  const type = document.querySelector('input[name="save-type"]:checked').value;

  // create file unpacker function
  reader.onload = function(data) {
    // split data
    const content = data.target.result;
    const rows = content.split("\\/");

    // check the load type
    if (type === "overwrite") {
      localStorage.clear();
      for (let i = 0; i < rows.length; i++) {
        // split the rows into key value pairs
        let row = rows[i].split("|");
        if (row.length == 1) {
          localStorage.setItem(row[0], "");
        } else {
          localStorage.setItem(row[0], row[1]);
        }
      }
    } else if (type === "append") {
      console.log("no")
    } else {
      console.warn("incorrect type selected")
    }
    window.location.reload();
  };

  // start file unpacking
  reader.readAsText(file);
}