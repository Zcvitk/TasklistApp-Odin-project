import {addDays, format, isEqual, isWithinInterval} from "date-fns";
import parseISO from "date-fns/parseISO";
import {projectList, hide_addTask_BTN} from "./Create_Project";
import {add_task} from "./Create_Task";


document.addEventListener("DOMContentLoaded", function() {
    //Hide all home divs at the start
    const homeDivs = document.querySelectorAll(".home > div");
    homeDivs.forEach(div => {
      div.style.display = 'none';
    });
  
    //Show/hide tiles when click on "Home"
    const homeHeading = document.getElementById("homeHeading");
    let areHomeDivsVisible = false;
  
    homeHeading.addEventListener("click", function() {
      if (areHomeDivsVisible) {
        homeDivs.forEach(div => {
          div.style.display = 'none';
        });
        areHomeDivsVisible = false;
      } else {
        homeDivs.forEach(div => {
          div.style.display = '';
        });
        areHomeDivsVisible = true;
      }
    });
  });

document.addEventListener("DOMContentLoaded", function() {
    //Hide all project divs at the start
    const projectDivs = document.querySelectorAll(".project > div");
    projectDivs.forEach(div => {
      div.style.display = 'none';
    });
  
    //Show/hide tiles when click on "Projects"
    const projectsHeading = document.getElementById("projectsHeading");
    let areProjectDivsVisible = false;
  
    projectsHeading.addEventListener("click", function() {

      if (areProjectDivsVisible) {
        projectDivs.forEach(div => {
          div.style.display = 'none';
        });
        areProjectDivsVisible = false;

      } else {
        projectDivs.forEach(div => {
          div.style.display = '';
        });
        areProjectDivsVisible = true;
      }
    });
  });

function checkWhichHomeTile(homeTile){
    if(homeTile.matches("#allTasks")){
        show_all_tasks();
    }
    else if(homeTile.matches("#today")){
        show_today_tasks();
    }
    else if(homeTile.matches("#thisWeek")){
        show_week_tasksk();
    }
    else if(homeTile.matches("#next30Days")){
        show_month_tasks();
    }
    else if(homeTile.matches("#important")){
        show_important_tasks();
    }
}

function clearContent(){
    const ul = document.querySelector("ul");
    ul.textContent = "";
}

//Show all tasks
function show_all_tasks(){
    clearContent();
    projectList.forEach((project) =>{
        project.taskList.forEach((task) => {
            add_task(task.id, task.title, task.details, task.date,task.completed, task.important);
        });
    });
    hide_addTask_BTN();
    checkNoTask();
};

//Show todays tasks
function show_today_tasks(){
    clearContent();
    let today = Date.parse(format(new Date(), "yyyy-MM-dd"));           
    projectList.forEach((project) =>{
        project.taskList.forEach((task) => {
            let date = Date.parse(task.date);
            if(isEqual(date, today)){
                add_task(task.id, task.title, task.details, task.date,task.completed, task.important);
            }
            else{
                return;
            }
        });
    });
    checkNoTask();
}

//Show next week tasks
function show_week_tasksk() {
    clearContent();

    projectList.forEach((project) =>{
        project.taskList.forEach((task) => {
            let date = parseISO(task.date);
            if(checkNextWeek(date)){
                add_task(task.id, task.title, task.details, task.date,task.completed, task.important);
            }
            else{
                return;
            }
        });
    });
    checkNoTask();
}

//Check if the date is within the interval of next week
function checkNextWeek(taskDate) {
    let nextWeek = addDays(new Date(), 7); // interval does not count the edges
    let today = new Date();
    return isWithinInterval(taskDate,{
        start: today,
        end: nextWeek
    });
}

//Show this month tasks
function show_month_tasks() {
    clearContent();
    projectList.forEach((project) =>{
        project.taskList.forEach((task) => {
            let date = parseISO(task.date);
            if(checkNextMonth(date)){
                add_task(task.id, task.title, task.details, task.date,task.completed, task.important);
            }
            else{
                return;
            }
        });
    });
    checkNoTask();
}

//Check if the date is within the interval of next 30 days
function checkNextMonth(taskDate) {
    let nextMonth = addDays(new Date(), 30); // interval does not count the edges
    let today = new Date();
    return isWithinInterval(taskDate,{
        start: today,
        end: nextMonth
    });
}

//Show important tasks
function show_important_tasks(){
    clearContent();
    projectList.forEach((project) =>{
        project.taskList.forEach((task) => {
            if(task.important){
                add_task(task.id, task.title, task.details, task.date,task.completed, task.important);
            }
            else{
                return;
            }
        });
    });
    checkNoTask();
}

function checkNoTask(){
    const ul = document.querySelector("ul");
    if(ul.textContent === ""){
        showNoTask();
    }
    else{
        return;
    }
}

function showNoTask(){
    const ul = document.querySelector("ul");
    const div = document.createElement("div");
    div.classList.add("noTask");
    div.textContent = "No tasks yet";
    ul.appendChild(div);
}


export {checkWhichHomeTile, show_all_tasks}