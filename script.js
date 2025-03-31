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
  // Get the date string for the selected day in the current on-screen month
  let dateString = generateDateString(day);
  
  // Create proper date object using the onScreenDate context
  let inputDate = new Date(onScreenDate.getFullYear(), onScreenDate.getMonth(), day);
  
  // Get current date and yesterday, normalized to midnight
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  // Normalize input date to midnight for accurate comparison
  inputDate.setHours(0, 0, 0, 0);
  
  // Check if input date matches today or yesterday
  if (inputDate.getTime() === today.getTime() || inputDate.getTime() === yesterday.getTime()) {
    localStorage.setItem(`${dateString}-stat`, status);
    closePopup();
    generateCalendar(onScreenDate);
    updateStreak();
  } else {
    showToast("You can only rate today and yesterday");
    return;
  }
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
    
    showToast(`Theme Set To ${selector.value}`);
  };
}


function setTheme() {
  var selector = document.getElementById("themes");
  selector.value = localStorage.getItem("theme");
	
  // Object to hold the color set values
  let colors = {};

  switch (selector.value) {
    case "Deep Ocean":
      colors = {
		// Header Background Color
		backgroundColor1: "#73c7e3",
		// Sidebar Background Color
		backgroundColor2: "#f0f2f2",
		// Calendar Section Background Color
		backgroundColor3: "#fff9f0",
		// Weekdays Header Background Color
		calendarColor1: "#73c7e3",
		// Inactive Days Background Color
		calendarColor2: "#bbc7d6",
		// Active Month Days Background Color
		calendarColor3: "#fff9f0",
		// Header Text Color
		textColor1: "#ffffff",
		// Sidebar Text Color
		textColor2: "#2e4a70",
		// Calendar Section Text Color
		textColor3: "#2e4a70",
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
		textColor3: "#ffffff",
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
  }

  // Pass the color object to the applyTheme function
  applyTheme(colors);
}

function applyTheme(colors) {
  document.getElementById("head").style.backgroundColor = colors.backgroundColor1;
  document.getElementById("head").style.color = colors.textColor1;

  document.querySelectorAll(".sidebar").forEach(element => {
    element.style.backgroundColor = colors.backgroundColor2;
    element.style.color = colors.textColor2;
  });

  document.querySelectorAll(".calendar-section").forEach(element => {
    element.style.backgroundColor = colors.backgroundColor3;
    element.style.color = colors.textColor3;
  });

  document.querySelectorAll(".day").forEach(element => {
    element.style.backgroundColor = colors.calendarColor1;
    element.style.color = colors.textColor3;
  });
  
  document.querySelectorAll(".date").forEach(element => {
    element.style.backgroundColor = colors.calendarColor3;
    element.style.color = colors.textColor3;
  });

  document.querySelectorAll(".sidebarBtn").forEach(element => {
    element.style.backgroundColor = colors.calendarColor1;
  });

  document.querySelectorAll(".monthChangeBtn").forEach(element => {
    element.style.backgroundColor = colors.calendarColor1;
  });
  
  document.querySelectorAll(".inactive-date").forEach(element => {
    element.style.backgroundColor = colors.calendarColor2;
  });

  document.querySelectorAll(".upcoming-event").forEach(element => {
    element.style.backgroundColor = colors.backgroundColor3;
  });
  
  document.querySelectorAll(".option-content").forEach(element => {
    element.style.backgroundColor = colors.calendarColor2;
  });
  
  document.querySelectorAll(".add-task").forEach(element => {
    element.style.backgroundColor = colors.calendarColor1;
  });
}



function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = `! ${message} !`;

  // Style the toast
  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = "white";
  toast.style.color = "black";
  toast.style.padding = "12px 20px";
  toast.style.border = "2px solid black";
  toast.style.borderRadius = "10px";
  toast.style.fontWeight = "bold";
  toast.style.boxShadow = "0px 4px 8px rgba(0,0,0,0.3)";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.5s";
  toast.style.zIndex = "1000";

  // Add to DOM
  document.body.appendChild(toast);

  // Fade in
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100);

  // Fade out and remove
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 2500);
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

      localStorage.setItem(`${date}-taskStart`, 1);
      localStorage.setItem(`${date}-taskAmount`, 1)

      localStorage.setItem(`${date}-task1`, title)
      localStorage.setItem(`${date}-desc1`, desc)
      localStorage.setItem(`${date}-time1`, time)
      localStorage.setItem(`${date}-addy1`, address)
    } else {
      var taskAmount;
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

  location.reload();

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

function openCreateMealPopup() {
  document.getElementById("popup-content").innerHTML = `
      <div>
        <h2>Create Meal</h2>
		
		<hr>
		<br>
		
        <button id="popup-close-btn" class="close-btn">Close</button>
        <form id="create-meal-form">
          <div>
            <label for="create-meal-name">Meal Name:</label>
            <input type="text" id="create-meal-name" name="create-meal-name" class="inputArea" required>
          </div>
		  
		  <br>
		  
          <div>
            <label for="create-meal-calories">Calories (per serving):</label>
            <input type="number" id="create-meal-calories" name="create-meal-calories" min="0" class="inputArea" required>
          </div>
		  
		  <br>
		  
          <div>
            <label for="create-meal-protein">Protein (grams per serving) (Optional):</label>
            <input type="number" id="create-meal-protein" name="create-meal-protein" min="0" class="inputArea">
          </div>
		  
		  <br>
		  
          <div>
            <label for="create-meal-carbs">Carbohydrates (grams per serving) (Optional):</label>
            <input type="number" id="create-meal-carbs" name="create-meal-carbs" min="0" class="inputArea">
          </div>
		  
		  <br>
		  
          <div>
            <label for="create-meal-fats">Fats (grams per serving) (Optional):</label>
            <input type="number" id="create-meal-fats" name="create-meal-fats" min="0" class="inputArea">
          </div>
		  
		  <br>
		  
          <div>
            <label for="create-meal-serving-size">Serving Size:</label>
            <input type="text" id="create-meal-serving-size" name="create-meal-serving-size" class="inputArea" required>
          </div>
          <br>
          <button type="submit" class="submenuBtn">Create Meal</button>
        </form>
      </div>
    `;

  document.getElementById("popup-close-btn").addEventListener("click", closePopup);
  document.getElementById("create-meal-form").addEventListener("submit", handleCreateMealSubmit);
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay-bg").style.display = "block";
}


function openLogMealPopup() {
  document.getElementById("popup-content").innerHTML = `
      <div>
        <h2>Log Meal</h2>
		
		<hr>
		<br>
		
        <button id="popup-close-btn" class="close-btn">Close</button>
        <form id="log-meal-form">
		
          <div>
            <label for="meal-name">Meal Name:</label>
            <input type="text" id="meal-name" name="meal-name" class="inputArea" required>
          </div>
		  
		  <br>
		  
          <div>
            <label for="meal-date">Date:</label>
            <input type="date" id="meal-date" name="meal-date" value="${new Date().toISOString().split('T')[0]}" class="inputArea" required>
          </div>
		  
		  <br>
		  
          <div>
            <label for="meal-calories">Calories:</label>
            <input type="number" id="meal-calories" name="meal-calories" min="0" class="inputArea" required>
          </div>
		  
		  <br>
		  
          <div>
            <label for="serving-size">Serving Size (Optional):</label>
            <input type="text" id="serving-size" name="serving-size" class="inputArea">
          </div>
          <br>
          <button type="submit" class="submenuBtn">Log Meal</button>
        </form>
      </div>
    `;

  document.getElementById("popup-close-btn").addEventListener("click", closePopup);
  document.getElementById("log-meal-form").addEventListener("submit", handleLogMealSubmit);
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay-bg").style.display = "block";
}


function openViewMealsPopup() {
  let loggedMealsHTML = '<h3>Logged Meals:</h3>';
  let createdMealsHTML = '<h3>Created Meals:</h3>';


  let loggedMeals = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('loggedMeal-')) {
      try {
        const meal = JSON.parse(localStorage.getItem(key));
        loggedMeals.push(meal);
      } catch (e) {
        console.error('Error parsing logged meal:', key, e);
      }
    }
  }

  if (loggedMeals.length > 0) {
    loggedMeals.forEach(meal => {
      loggedMealsHTML += `
          <div class="meal-entry">
            <strong>${meal.name}</strong> (${meal.date})<br>
            Calories: ${meal.calories}
            ${meal.servingSize ? `<br>Serving Size: ${meal.servingSize}` : ''}
          </div>
        `;
    });
  } else {
    loggedMealsHTML += '<p>No meals have been logged yet.</p>';
  }


  let createdMeals = [];
  const createdMealsString = localStorage.getItem('createdMeals');
  if (createdMealsString) {
    try {
      createdMeals = JSON.parse(createdMealsString);
    } catch (e) {
      console.error('Error parsing created meals:', e);
    }
  }

  if (createdMeals.length > 0) {
    createdMeals.forEach(meal => {
      createdMealsHTML += `
          <div class="meal-entry">
            <strong>${meal.name}</strong><br>
            Calories (per serving): ${meal.calories}
            ${meal.protein ? `<br>Protein: ${meal.protein}g` : ''}
            ${meal.carbs ? `<br>Carbs: ${meal.carbs}g` : ''}
            ${meal.fats ? `<br>Fats: ${meal.fats}g` : ''}
            Serving Size: ${meal.servingSize}
          </div>
        `;
    });
  } else {
    createdMealsHTML += '<p>No meals have been created yet.</p>';
  }

  document.getElementById("popup-content").innerHTML = `
      <div>
        <h2>View Meals</h2>
        <button id="popup-close-btn" class="close-btn">Close</button>
        ${loggedMealsHTML}
        <hr>
        ${createdMealsHTML}
      </div>
    `;

  document.getElementById("popup-close-btn").addEventListener("click", closePopup);
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay-bg").style.display = "block";
}


function handleLogMealSubmit(event) {
  event.preventDefault();

  const mealName = document.getElementById("meal-name").value;
  const mealDate = document.getElementById("meal-date").value;
  const mealCalories = document.getElementById("meal-calories").value;
  const servingSize = document.getElementById("serving-size").value;

  const loggedMeal = {
    name: mealName,
    date: mealDate,
    calories: mealCalories,
    servingSize: servingSize
  };


  const timestamp = new Date().getTime();
  localStorage.setItem(`loggedMeal-${mealDate}-${timestamp}`, JSON.stringify(loggedMeal));

  closePopup();
}


function handleCreateMealSubmit(event) {
  event.preventDefault();

  const mealName = document.getElementById("create-meal-name").value;
  const calories = document.getElementById("create-meal-calories").value;
  const protein = document.getElementById("create-meal-protein").value;
  const carbs = document.getElementById("create-meal-carbs").value;
  const fats = document.getElementById("create-meal-fats").value;
  const servingSize = document.getElementById("create-meal-serving-size").value;

  const newMeal = {
    name: mealName,
    calories: calories,
    protein: protein,
    carbs: carbs,
    fats: fats,
    servingSize: servingSize
  };


  const existingMealsString = localStorage.getItem('createdMeals');
  let existingMeals = [];
  if (existingMealsString) {
    try {
      existingMeals = JSON.parse(existingMealsString);
    } catch (e) {
      console.error('Error parsing existing created meals:', e);
    }
  }
  existingMeals.push(newMeal);
  localStorage.setItem('createdMeals', JSON.stringify(existingMeals));

  closePopup();
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

  document.getElementById("create-Meal").addEventListener("click", () => openCreateMealPopup());
  document.getElementById("log-Meal").addEventListener("click", () => openLogMealPopup());
  document.getElementById("view-Meals").addEventListener("click", () => openViewMealsPopup());
}


/*
This if statement allows the jest to run, do not touch outside of appending functions after addTask
so they can be recognized by script.test.js
*/
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = { addTask, removeTask, doesDayHaveTasks };
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
  localStorage.clear();

  // Create toast
  showToast("Cookies Have Been cleared");
}


