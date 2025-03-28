# Iron Man Planner

This is a group project for CS-386 (Software Engineering)

The Iron Man Planner is a fitness and nutrition tracker that allows groups such as athletes, trainers, and health conscious people to efficiently manage aspects of their fitness tasks by integrating all of these key elements into a single platform.

Current Version: 1.0.0

## Features

- **Greeting Card**: Presents relevant data tailored to the user like a time specific greeting and weather status report.
- **Calorie Counter**: A place where the user can add the calorie count of everything they eat in a day to see if they stay under their recommended daily intake. Count resets every day back to 0
- **Daily Calorie Intake Calculator**: A formula that takes in the users, age, height, sex and other factors to determine how many calories in a day they should be eating.
- **Calendar**: A grid layout calendar that shows you what tasks you have planned for each day and helps you stay organized
- **Scheduler**: A system that allows the user to create tasks for specific dates and times along with a description of the activity
- **To-Do List**: A generic to do list where less pressing tasks are meant to be put (Similar to short term reminders instead of schedules appointments)
- **Workout Planner**: System that allows you to pick an assortment of workouts and put them all together into one collection.
- **Workout Library**: List of workouts you can do containing a description of each workout, what part of your body it is training, and its expected calorie burn.
- **Save file export and load feature**: Store the users data in cookies but allow them the option to export their data to a separate file then load that file back into the cookies in their web browser. (This way if they want to clear cookies, they can still retain their information)
- **Streak feature**: If the user stays consistent with meeting their exercise goal and staying within their daily calorie intake then have a streak counter startup that increases by one for each day gained.

---

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
A Web Browser capable of running modern HTML, CSS, and JavaScript
```

```
Git(https://git-scm.com/)
```

```
A code editor (e.g., Visual Studio Code(https://code.visualstudio.com/))
```

### Installing

A step by step series of examples that tell you how to get a development env running

**Clone the repository:**

```
Open your terminal and run the following command to clone the repository:
git clone git@github.com:your-username/Personal-Planner.git
```

**Navigate to the project directory:**

```
cd Personal-Planner
```

**Edit Codebase Files:**

```
open index.html, styles.css, and script.js in a text editor
```

**View Your Changes In Real Time:**

```
open index.html in your web browser to view your local version of the website
```

**Ensure it is Working Properly:**

```
Make a JavaScript function to retreive the current day or calorie count to become familiar with fetching data in the system
```

## Running the tests

Iron Man Planner has a set of JavaScript tests to ensure proper functionality of the main features of the website.

### How to Test

```
Install NPM to your system using npm install --save-dev jest, run npn test in the repository, and sit back while jest confirms that all tests are passed
```

### Why to Test

```
When making changes to the Iron Man Planner codebase it is important to make sure that all features still work as intended before submitting that code via pull request. Our automated tests ensure that the most crucial features of our planner are fully functional.
```

## Deployment

When Deploying Iron Man Planner on a live enviornment you have 2 options:

1. Web Hosting - By uploading the codebase to a server you can host Iron Man Planner and access it from anywhere
2. Local Hosting - By downloading the Iron Man Planner codebase from GitHub you can run Iron Man Planner directly from your computer by clicking the HTML file

## Built With

* [HTML](https://www.w3schools.com/html/) - The Language Used for Designing the Website structure
* [CSS](https://www.w3schools.com/Css/) - Used for styling and adding theming to the website
* [JavaScript](https://www.w3schools.com/Js/) - Used to add logic and variables to the website

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Oracle451/Personal-Planner/tags). 

## Authors

* **Cole Bishop** - *Initial work* - [Oracle451](https://github.com/Oracle451)

* **Daniel Fillerup** - *Initial work* - [dfillerup](https://github.com/dfillerup)

* **Travian Lenox** - *Initial work* - [Ashfter](https://github.com/Ashfter)

* **Dorian Sanchez** - *Initial work* - [DorianOklahoma](https://github.com/DorianOklahoma)

* **Jesse** - *Initial work* - [jvc68](https://github.com/jvc68)

* **James** - *Initial work* - [jn867](https://github.com/jn867)

See also the list of [contributors]([https://github.com/your/project/contributors](https://github.com/Oracle451/Personal-Planner/graphs/contributors)) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.txt) file for details

## Acknowledgments

* Various websites inspired the central side bar like Gmail
* The Icloud website originally inspired the idea for an all in one planner site

