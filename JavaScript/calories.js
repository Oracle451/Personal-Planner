// Updates the remaining calories for a user
function updateCaloriesRemaining() 
{
    const todayCalories = parseInt(document.getElementById("today-calories").textContent);
    const dailyGoal = parseInt(document.getElementById("daily-goal").textContent);
    const remaining = dailyGoal - todayCalories;
  
    document.getElementById("calories-remaining").textContent = remaining >= 0 ? remaining : 0;
  }
  

  // After user sets a new goal:
document.getElementById("set-calorie-goal").addEventListener("click", () => {
    document.getElementById("daily-goal").textContent = 2200;
    updateCaloriesRemaining();
  });

  
  // Wait until the DOM is fully loaded before running
  document.addEventListener("DOMContentLoaded", updateCaloriesRemaining);
  