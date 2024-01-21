import {projectList, createSpanIcon, saveToLocalStorage} from "./Create_Project";
import {style_completed_task, update_completed_task, style_important_task,
        update_important_task, delete_task, show_editTask_form, revertEditFormLocation,
        process_edit_task, show_hidden_task} from "./Edit_Task";

function listEvent() {
  const addList = document.querySelector("#addList");
  addList.addEventListener("click", showListForm);

  const listCancel = document.querySelector(".listCancelBtn");
  listCancel.addEventListener("click", hideListForm);

  const listSubmit = document.getElementById("listForm");
  listSubmit.addEventListener("submit", processListInput);

  const todoList = document.querySelector(".list-todo");
  todoList.addEventListener("click", checkListEvent);
}

const CreateTask = (dataProject, id, title, details, completed, important, date) => {
  return {
    dataProject,
    id,
    title,
    details,
    completed: completed,
    important: important,
    date: date
  };
};

function checkListEvent(e) {
  const isStarIcon = e.target.matches(".star-outline");
  const isCircleIcon = e.target.matches(".unchecked");
  const isEditSubmitBtn = e.target.matches(".editTaskSubmitBtn");
  const isEditTaskCancel = e.target.matches(".editTaskCancelBtn");
  const isDeleteBtn = e.target.matches("#listDelete");
  const isEditBtn = e.target.matches("#listEdit");

  if (isStarIcon) {
    style_important_task(e);
    update_important_task(e);

  } else if (isCircleIcon) {
    style_completed_task(e);
    update_completed_task(e);

  } else if (isDeleteBtn) {
    delete_task(e);

  } else if (isEditBtn) {
    show_editTask_form(e);

  } else if (isEditSubmitBtn) {
    process_edit_task(e);

  } else if (isEditTaskCancel) {
    revertEditFormLocation();
    show_hidden_task();

  } else {
    return;
  }
}

const showListForm = () => {
  const ListForm = document.querySelector("#listForm");
  ListForm.classList.remove("hidden");
  document.getElementById("listInput").focus();
};

const hideListForm = () => {
  const listForm = document.querySelector("#listForm");
  const listInput = document.querySelector('#listInput');
  const listInputDetail = document.querySelector("#listInputDetail");
  const dateInput = document.querySelector("#listInputDate");

  listInput.value = "";
  listInputDetail.value = "";
  dateInput.value = "";
  listForm.classList.add("hidden");
};

let defaultId = 0;
let id = Number(localStorage.getItem("currentId")) || defaultId;

function processListInput(e) {
  const title = document.getElementById("listInput").value;
  const details = document.getElementById("listInputDetail").value;
  const dateInput = document.getElementById("listInputDate").value;
  const dataProject = findCurrentDataProject();
  const date = processDateData(dateInput);
  const listId = id;

  const newTask = CreateTask(dataProject, listId, title, details, false, false, date);
  projectList[dataProject].taskList.push(newTask);
  id++;
  saveToLocalStorage();

  add_task(listId, title, details, date);
  hideListForm();
  e.preventDefault();
}

function processDateData(date) {
  return date ? date : "No Due Date";
}

function show_task(dataProject) {
  const ul = document.querySelector("ul");
  ul.textContent = "";
  projectList[dataProject].taskList.forEach(task => {
    add_task(task.id, task.title, task.details, task.date, task.completed, task.important);
  });
}

function add_task(listId, title, details, date, completed, important) {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  li.id = listId;
  ul.appendChild(li);

  const unchecked = document.createElement("div");
  unchecked.classList.add("unchecked");
  li.appendChild(unchecked);

  const listDetails = document.createElement("div");
  listDetails.classList.add("list-details");
  li.appendChild(listDetails);

  if (completed) {
    unchecked.classList.toggle("checked");
    listDetails.classList.toggle("lineThrough");
    listDetails.classList.toggle("fade");
  }

  const taskTitle = document.createElement("div");
  taskTitle.classList.add("taskTitle");
  taskTitle.textContent = title;
  listDetails.appendChild(taskTitle);

  const taskDetails = document.createElement("div");
  taskDetails.classList.add("taskDetails");
  taskDetails.textContent = details;
  listDetails.appendChild(taskDetails);

  const dateDiv = document.createElement("div");
  dateDiv.classList.add("date");
  dateDiv.textContent = date;
  li.appendChild(dateDiv);

  const listRight = document.createElement("div");
  listRight.classList.add("list-right");
  li.appendChild(listRight);

  const starOutline = createSpanIcon("star_outline");
  starOutline.classList.add("star-outline");
  listRight.appendChild(starOutline);

  const star = createSpanIcon("star");
  star.classList.add("important");
  listRight.appendChild(star);

  if (important) {
    starOutline.classList.add("listHidden");
  } else {
    star.classList.add("listHidden");
  }

  const edit_container = document.createElement("div");
  edit_container.dataset.dropdown = "";
  edit_container.classList.add("editContainer");
  listRight.appendChild(edit_container);

  const threeDots = createSpanIcon("more_vert");
  threeDots.dataset.dropdownButton = "";
  edit_container.appendChild(threeDots);
}

function title_update(nameNode) {
  const title = document.querySelector(".title");
  title.textContent = nameNode.textContent;
}

function findCurrentDataProject() {
  const selected = document.querySelector(".selected");
  return selected.dataset.project;
}

export {title_update, listEvent, show_task, id, add_task, processDateData};
