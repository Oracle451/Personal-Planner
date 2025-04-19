const { generateDateString, doesDayHaveTasks, addTask, removeTask, populateUpcomingEvents, fixTime } = require("./JavaScript/testedFunctions.js")

const dateString = "2025-03-22"
global.setTheme = jest.fn();

beforeEach(() => {
    // Mock the DOM
    document.body.innerHTML = `
    <input id="date" value="2025-03-22" />
    <input id="time" value="17:30" />
    <input id="location" value="Office" />
    <input id="desc" value="Team Meeting with Frank" />
    <input id="title" value="Meeting" />
    <div id="upcoming-event-sect"></div>
    <div id="no-Tasks"></div>
  `;

    // Mock localStorage
    global.localStorage = {
        store: {},
        getItem: function (key) {
            return this.store[key] || null;
        },
        setItem: function (key, value) {
            this.store[key] = value.toString();
        },
        clear: function () {
            this.store = {};
        }
    };

    const constantDate = new Date('2025-04-10T00:00:00');
    jest.useFakeTimers('modern');
    jest.setSystemTime(constantDate);

});

afterAll(() => {
    jest.useRealTimers();
});


//ACTUAL TESTS BELOW

test("addTask is handling all of its responsibilites", () => {
    localStorage.clear();
    addTask(0, "");


    expect(localStorage.getItem(`${dateString}-task1`)).toBe("Meeting");
    expect(localStorage.getItem(`${dateString}-desc1`)).toBe("Team Meeting with Frank");
    expect(localStorage.getItem(`${dateString}-time1`)).toBe("5:30 pm");
    expect(localStorage.getItem(`${dateString}-addy1`)).toBe("Office");

    expect(localStorage.getItem("2025-03-22-taskAmount")).toBe("1");

    addTask(0, "");

    expect(localStorage.getItem("2025-03-22-taskAmount")).toBe("2");

    addTask(0, "");

    expect(localStorage.getItem("2025-03-22-taskAmount")).toBe("3");

});


test("doesDayHaveTasks function properly returns true or false depending on given day", () => {
    localStorage.clear();
    addTask(0, "");
    expect(doesDayHaveTasks(dateString)).toBeTruthy();

    removeTask(dateString, 1)

    expect(doesDayHaveTasks(dateString)).toBeFalsy();



});

test("removeTask function properly deletes a task from localStorage.", () => {
    localStorage.clear();

    addTask(0, "");

    expect(localStorage.getItem("2025-03-22-task1")).toBe("Meeting");
    expect(localStorage.getItem("2025-03-22-desc1")).toBe("Team Meeting with Frank");
    expect(localStorage.getItem("2025-03-22-time1")).toBe("5:30 pm");
    expect(localStorage.getItem("2025-03-22-addy1")).toBe("Office");

    removeTask("2025-03-22", 1);

    expect(doesDayHaveTasks(dateString)).toBeFalsy();

    addTask(0, "");
    addTask(0, "");

    expect(localStorage.getItem("2025-03-22-taskAmount")).toBe("2");

    removeTask("2025-03-22", 2);

    expect(localStorage.getItem("2025-03-22-task1")).toBe(null);
    expect(doesDayHaveTasks(dateString)).toBeTruthy();

});

test('generateDateString produces correct strings', () => {
    const dateString = generateDateString(10, true);
    expect(dateString).toMatch("2025-04-10");

});


test("populateUpcomingEvents edits the proper div and hides no-Tasks div", () => {
    localStorage.clear();


    localStorage.setItem("2025-04-10-taskAmount", "1");
    localStorage.setItem("2025-04-10-taskStart", "1");
    localStorage.setItem("2025-04-10-task1", "Math Review");
    localStorage.setItem("2025-04-10-time1", "1:00 pm");
    localStorage.setItem("2025-04-10-addy1", "Library");
    localStorage.setItem("2025-04-10-desc1", "Study session");

    populateUpcomingEvents();

    let tasks = document.querySelectorAll(".upcoming-event");
    expect(tasks.length).toBe(1);
    expect(tasks[0].textContent).toContain("Review");
    expect(tasks[0].textContent).toContain("1:00 pm");

    expect(document.getElementById("no-Tasks").textContent).toBe("");

    removeTask("2025-04-10", 1);
    expect(doesDayHaveTasks("2025-04-10")).toBeFalsy();

    populateUpcomingEvents();

    expect(document.getElementById("no-Tasks").textContent).toBe("Nothing to do...");



    for (let i = 1; i < 8; i++) {
        localStorage.setItem(`2025-04-10-task${i}`, "Math Review");
        localStorage.setItem(`2025-04-10-time${i}`, `${i}:00 pm`);
        localStorage.setItem(`2025-04-10-addy${i}`, "Library");
        localStorage.setItem(`2025-04-10-desc${i}`, "Study session");
    }

    localStorage.setItem("2025-04-10-taskAmount", "6");
    localStorage.setItem("2025-04-10-taskStart", "1");

    populateUpcomingEvents();

    tasks = document.querySelectorAll(".upcoming-event");
    expect(tasks.length).toBe(5);
    expect(tasks[3].textContent).toContain("4:00 pm");

    expect(document.getElementById("no-Tasks").textContent).toBe("");





});

test("fixTime correctly turns the 24-hour format into 12-hour format.", () => {
    let time = fixTime(document.getElementById("time").value);
    expect(time).toBe("5:30 pm");

    document.getElementById("time").value = "1:30"
    time = fixTime(document.getElementById("time").value);
    expect(time).toBe("1:30 am");

    document.getElementById("time").value = "13:30"
    time = fixTime(document.getElementById("time").value);
    expect(time).toBe("1:30 pm");

});