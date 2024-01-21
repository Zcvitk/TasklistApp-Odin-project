import {show_task, title_update, id} from "./Create_Task";
import {revertEditFormLocation} from "./Edit_Task";
import {revertOptionLocation} from "./Edit_Project";
import {dragStartEndEvent} from "./Drag_Tiles";
import {checkWhichHomeTile} from "./Home";

const createEventListener = () => {
  //Form for adding projects
  const cancel = document.querySelector(".projectCancelBtn");
  cancel.addEventListener("click", hideProjectForm);

  const add = document.getElementById('addProject');
  add.addEventListener("click", showProjectForm);

  const submit = document.getElementById("projectForm");
  submit.addEventListener("submit", processProjectInput);

  const left_Menu = document.querySelector(".left_Menu");
  left_Menu.addEventListener("click", checkTile);

  displayProject(projectList);
};

//Get project list of objects from local storage or start with empty
const defaultProjectList = [];
let projectList = JSON.parse(localStorage.getItem("myProjectList")) || defaultProjectList;

//Process the input and prepare to create element project
const processProjectInput = (e) => {
  const projectName = document.getElementById("projectInput").value;
  const dataProject = findNextDataset();
  const newProject = createProject(dataProject, projectName);

  projectList.push(newProject);
  saveToLocalStorage();

  addProject(dataProject, projectName);
  hideProjectForm();
  e.preventDefault();
};

//Save projectList and last id data on local storage
function saveToLocalStorage() {
  localStorage.setItem("myProjectList", JSON.stringify(projectList));
  localStorage.setItem("currentId", id.toString());
}

//Create project factory function
function createProject(dataProject, name) {
  const taskList = [];
  const taskNum = taskList.length;
  return {
    dataProject,
    name,
    taskList,
    taskNum
  };
}

//Pop up the project form
const showProjectForm = () => {
  const projectForm = document.querySelector("#projectForm");
  projectForm.classList.remove("hidden");
  document.getElementById("projectInput").focus();
};

//Hide project form
const hideProjectForm = () => {
  const projectForm = document.querySelector("#projectForm");
  const projectInput = document.querySelector('#projectInput');

  projectInput.value = "";
  projectForm.classList.add("hidden");
};

//Display the list of all projects in the left menu
const displayProject = (array) => {
  array.forEach((project) => {
    addProject(project.dataProject, project.name);
  });
};

//Create a project and add it to the list of projects in HTML
const addProject = (dataProject, textInput) => {
  const project = document.querySelector('.project');
  const form = document.querySelector('#projectForm');

  const container = document.createElement('div');
  container.setAttribute("data-project", `${dataProject}`);
  container.classList.add("tile");
  project.insertBefore(container, form);

  //Menu three lines icon
  const menuIcon = createSpanIcon("menu");
  menuIcon.setAttribute("data-drag", "");
  container.appendChild(menuIcon);

  //Name and number status
  const projectInfo = document.createElement("div");
  projectInfo.classList.add("projectInfo");
  container.appendChild(projectInfo);

  const projectName = document.createElement('div');
  projectName.classList.add("projectName");
  projectName.textContent = textInput;
  projectInfo.appendChild(projectName);

  //Three dots on the right section
  const editdiv = document.createElement('div');
  editdiv.classList.add('editContainer');
  editdiv.setAttribute("data-dropdown", "");
  container.appendChild(editdiv);

  //Call function to create a span icon from Google
  const editIcon = createSpanIcon("more_vert");
  editIcon.setAttribute("data-dropdown-button", "");
  editdiv.appendChild(editIcon);

  dragStartEndEvent(container);
};

//Google Material Icons
const createSpanIcon = (name) => {
  const icon = document.createElement('span');
  icon.classList.add("material-icons-round");
  icon.textContent = name;
  return icon;
};

//Find next data-set
const findNextDataset = () => {
  const allprojects = document.querySelectorAll("[data-project]");
  return allprojects.length;
};

//Remove add task Btn when homeTiles is selected
function hide_addTask_BTN() {
  const add_taskBtn = document.getElementById("addList");
  add_taskBtn.classList.add("hidden");
}

//Show add_taskBtn when project tile
function show_addTask_BTN() {
  const add_taskBtn = document.getElementById("addList");
  add_taskBtn.classList.remove("hidden");
}

//Check to see which tile is selected
function checkTile(e) {
  const homeTile = e.target.closest(".home .tile");
  const projectTile = e.target.closest(".project .tile");

  if (homeTile) {
    const title = homeTile.querySelector("[data-name]");
    selectTile(homeTile);
    revertOptionLocation();
    checkWhichHomeTile(homeTile);
    title_update(title);
    hide_addTask_BTN();
    
  } else if (projectTile) {
    const title = projectTile.querySelector(".projectName");
    const dataProject = projectTile.dataset.project;

    revertEditFormLocation();
    revertOptionLocation();

    show_task(dataProject);
    selectTile(projectTile);
    title_update(title);
    show_addTask_BTN();
  }
}

//When selecting a tile from left menu, apply CSS
const selectTile = (node) => {
  const selectedTile = document.querySelector(".selected");
  selectedTile.classList.remove("selected");
  node.classList.add("selected");
}

export {
  createEventListener,
  createSpanIcon,
  projectList,
  saveToLocalStorage,
  hide_addTask_BTN
};