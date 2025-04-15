// theme.js
// This file manages the theme functionality for iron man planner
// Key functions:
// - updateTheme: Sets up the theme selector and handles theme changes.
// - setTheme: Loads and applies the selected theme's colors.
// - applyTheme: Applies color values to specific DOM elements.
// - openCustomThemePopup: Displays a popup for editing custom theme colors.
// - handleCustomThemeSubmit: Saves custom theme colors and closes the popup.
// - getFormColors: Extracts colors from the custom theme form.
// - loadCustomTheme: Loads custom theme colors from storage with defaults.

/**
 * Sets up the theme selector and updates the theme on change.
 */
function updateTheme() {
    const selector = document.getElementById("themes");

    selector.onchange = (event) => {
        const selectedTheme = selector.value;
        localStorage.setItem("theme", selectedTheme);

        if (selectedTheme === "Custom") {
            openCustomThemePopup(); // Open popup every time "Custom" is selected
        } else {
            setTheme();
            showToast(`Theme Set To ${selectedTheme}`);
        }
    };
}

/**
 * Applies the selected theme by loading colors from storage and applying them.
 */
function setTheme() {
    const selector = document.getElementById("themes");
    const storedTheme = localStorage.getItem("theme") || "Deep Ocean";
    selector.value = storedTheme;

    let colors = {};
    switch (storedTheme) {
        case "Clear Sky":
            colors = {
                backgroundColor1: "#73c7e3",
                backgroundColor2: "#f0f2f2",
                backgroundColor3: "#fff9f0",
                calendarColor1: "#73c7e3",
                calendarColor2: "#bbc7d6",
                calendarColor3: "#fff9f0",
                textColor1: "#ffffff",
                textColor2: "#2e4a70",
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
                backgroundColor1: "#001f3f",
                backgroundColor2: "#003b6f",
                backgroundColor3: "#002b50",
                calendarColor1: "#5a6e7f",
                calendarColor2: "#667684",
                calendarColor3: "#7a8a99",
                textColor1: "#ffffff",
                textColor2: "#e0e0e0",
                textColor3: "#f0f8ff",
            };
            break;
        case "Lavender":
            colors = {
                backgroundColor1: "#c8a5e4",
                backgroundColor2: "#e0c2ef",
                backgroundColor3: "#f3e0f7",
                calendarColor1: "#8871be",
                calendarColor2: "#63589f",
                calendarColor3: "#aa8bd4",
                textColor1: "#ffffff",
                textColor2: "#000000",
                textColor3: "#000000",
            };
            break;
        case "Forest":
            colors = {
                backgroundColor1: "#2b4c12",
                backgroundColor2: "#2c5123",
                backgroundColor3: "#4f7149",
                calendarColor1: "#616161",
                calendarColor2: "#787878",
                calendarColor3: "#878787",
                textColor1: "#ffffff",
                textColor2: "#e0e0e0",
                textColor3: "#f2f8fe",
            };
            break;
        case "Custom":
            colors = loadCustomTheme(); // Load custom theme colors
            break;
    }

    applyTheme(colors); // Apply the colors, even for Custom
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
 * Opens a popup for custom theme editing.
 */
function openCustomThemePopup() {
    const currentColors = loadCustomTheme();

    document.getElementById("popup-content").innerHTML = `
        <div>
            <h2>Custom Theme Builder</h2>
            <button id="popup-close-btn" class="close-btn">Close</button>
            <hr>
            <form id="custom-theme-form" style="display: flex; justify-content: space-between; gap: 20px;">
                <!-- Background Colors Column -->
                <div style="flex: 1;">
                    <h3><u>Background Colors</u></h3>
                    <label for="bg1">Header Background:</label>
                    <input type="color" id="bg1" name="backgroundColor1" value="${currentColors.backgroundColor1}"><br><br>
                    <label for="bg2">Sidebar Background:</label>
                    <input type="color" id="bg2" name="backgroundColor2" value="${currentColors.backgroundColor2}"><br><br>
                    <label for="bg3">Calendar Background:</label>
                    <input type="color" id="bg3" name="backgroundColor3" value="${currentColors.backgroundColor3}">
                </div>
                <!-- Calendar Colors Column -->
                <div style="flex: 1;">
                    <h3><u>Calendar Colors</u></h3>
                    <label for="cal1">Weekdays Header:</label>
                    <input type="color" id="cal1" name="calendarColor1" value="${currentColors.calendarColor1}"><br><br>
                    <label for="cal2">Inactive Days:</label>
                    <input type="color" id="cal2" name="calendarColor2" value="${currentColors.calendarColor2}"><br><br>
                    <label for="cal3">Active Days:</label>
                    <input type="color" id="cal3" name="calendarColor3" value="${currentColors.calendarColor3}">
                </div>
                <!-- Text Colors Column -->
                <div style="flex: 1;">
                    <h3><u>Text Colors</u></h3>
                    <label for="text1">Header Text:</label>
                    <input type="color" id="text1" name="textColor1" value="${currentColors.textColor1}"><br><br>
                    <label for="text2">Sidebar Text:</label>
                    <input type="color" id="text2" name="textColor2" value="${currentColors.textColor2}"><br><br>
                    <label for="text3">Calendar Text:</label>
                    <input type="color" id="text3" name="textColor3" value="${currentColors.textColor3}">
                </div>
            </form>
            <br>
            <br>
            <button type="submit" form="custom-theme-form" class="submenuBtn">Set Custom Theme</button>
        </div>
    `;

    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay-bg").style.display = "block";

    document.getElementById("popup-close-btn").addEventListener("click", closePopup);
    document.getElementById("custom-theme-form").addEventListener("submit", handleCustomThemeSubmit);

    // Live preview as colors change
    document.querySelectorAll("#custom-theme-form input[type='color']").forEach(input => {
        input.addEventListener("input", () => {
            const colors = getFormColors();
            applyTheme(colors);
        });
    });
}

/**
 * Handles form submission for saving custom theme.
 */
function handleCustomThemeSubmit(event) {
    event.preventDefault();
    const colors = getFormColors();
    localStorage.setItem("customTheme", JSON.stringify(colors));
    closePopup(); // Close the popup when "Set Custom Theme" is clicked
    showToast("Custom Theme Saved!");
    applyTheme(colors);
    // No need to call setTheme() here since applyTheme() is already called live
}

/**
 * Extracts colors from the form.
 */
function getFormColors() {
    return {
        backgroundColor1: document.getElementById("bg1").value,
        backgroundColor2: document.getElementById("bg2").value,
        backgroundColor3: document.getElementById("bg3").value,
        calendarColor1: document.getElementById("cal1").value,
        calendarColor2: document.getElementById("cal2").value,
        calendarColor3: document.getElementById("cal3").value,
        textColor1: document.getElementById("text1").value,
        textColor2: document.getElementById("text2").value,
        textColor3: document.getElementById("text3").value
    };
}

/**
 * Loads custom theme from localStorage, with defaults if not set.
 */
function loadCustomTheme() {
    const defaultCustom = {
        backgroundColor1: "#001f3f",
        backgroundColor2: "#003b6f",
        backgroundColor3: "#002b50",
        calendarColor1: "#5a6e7f",
        calendarColor2: "#667684",
        calendarColor3: "#7a8a99",
        textColor1: "#ffffff",
        textColor2: "#e0e0e0",
        textColor3: "#f0f8ff"
    };

    const storedCustom = JSON.parse(localStorage.getItem("customTheme"));
    return { ...defaultCustom, ...storedCustom };
}