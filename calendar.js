/**
 * calendar.js
 * 
 * This module contains functions for managing the calendar display and navigation
 * in the application.
 */

let onScreenDate = new Date();

function updateOnScreen(num) {
  // Updates the displayed month based on navigation input
  switch (num) {
    case 1:
      onScreenDate = new Date(onScreenDate.getFullYear(), onScreenDate.getMonth() + 2, 0);
      break;
    case -1:
      onScreenDate = new Date(onScreenDate.getFullYear(), onScreenDate.getMonth(), 0);
      break;
    default:
      break;
  }

  // Sets the month and year text in the UI
  document.getElementById('current-month').textContent = `${onScreenDate.toLocaleString('default', { month: 'long' })} : ${onScreenDate.getFullYear().toString()}`;
  // Refreshes the calendar display
  generateCalendar(onScreenDate);
}

function generateCalendar(today) {
  const calendarElement = document.getElementById("calendar");
  // Clears previous calendar content
  calendarElement.innerHTML = "";
  let monthday = today.getDate(); /* gets the day in the month */
  let last_day = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  let days_in_month = last_day.getDate(); /* gets the length of this month */
  let weekday = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); /* gets the first weekday of this month */

  // Get current date for comparison
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

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

    // Highlight current date with different color if it matches
    if (today.getFullYear() === currentYear && today.getMonth() === currentMonth && i === currentDay) {
      dateElement.classList.add("current-date");
    }

    if (localStorage.getItem(`${dateString}-stat`) !== null) {
      let status = localStorage.getItem(`${dateString}-stat`);
      dateElement.classList.remove("good", "decent", "bad");
      if (status) {
        let rating = document.createElement("div");
        rating.classList.add("day-rating");
        switch (status) {
          case "good":
            rating.style.backgroundColor = "#4CAF50";
            break;
          case "decent":
            rating.style.backgroundColor = "#FFC107";
            break;
          case "bad":
            rating.style.backgroundColor = "#FF5722";
            break;
        }
        dateElement.appendChild(rating);
      }
    }

    /* Based on dateString, attempts to add Tasks for that day*/
    if (doesDayHaveTasks(dateString)) {
      let taskAmount = localStorage.getItem(`${dateString}-taskAmount`);
      let taskStart = localStorage.getItem(`${dateString}-taskStart`);

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

  // Adds event listener to the add-task button and updates UI
  document.getElementById(`add-task`).addEventListener("click", () => addTaskPopup());
  setTheme();
  updateStreak();
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