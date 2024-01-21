import {projectList, saveToLocalStorage} from "./Create_Project";
import {hideDropDown, revertOptionLocation} from "./Edit_Project";
import {show_task, processDateData} from "./Create_Task";
import {checkWhichHomeTile} from "./Home";

//style completed task
const style_completed_task = e => {
    const uncheckedNode = e.target;
    const taskTile = e.target.closest("li");
    const listDetails = taskTile.querySelector(".list-details");
  
    listDetails.classList.toggle("lineThrough");
    listDetails.classList.toggle("fade");
    uncheckedNode.classList.toggle("checked");
  };

//update the completed object data
const update_completed_task = e => {
  const listId = e.target.closest("li").id;
  const selectedTask = find_selectedTask_byID(listId);

  selectedTask.completed = !selectedTask.completed;
  saveToLocalStorage();
};

//put styling on important task
const style_important_task = e => {
    const starOutline = e.target;
    starOutline.classList.toggle("listHidden");
  
    const starFilled = e.target.nextElementSibling;
    starFilled.classList.toggle("listHidden");
  };

//update important status on stored object
const update_important_task = e => {
    const listId = e.target.closest("li").id;
    const selectedTask = find_selectedTask_byID(listId);
  
    selectedTask.important = !selectedTask.important;
    saveToLocalStorage();
    revertOptionLocation();
    display_refresh_after_editing(selectedTask.dataProject);
  };
  
//delete task from array
const delete_task = e => {
    const listNode = e.target.closest("li");
    const id = listNode.id;
    const selectedTask = find_selectedTask_byID(id);
    const dataProject = selectedTask.dataProject;
  
    projectList[dataProject].taskList = projectList[dataProject].taskList.filter(task => task != selectedTask);
    saveToLocalStorage();
    revertOptionLocation();
    listNode.remove();
  };
  
//find the task via id
const find_selectedTask_byID = listId => {
    return projectList.reduce((acc, project) => {
      const currentTask = project.taskList.find(task => task.id == listId);
      if (currentTask != null) {
        acc = currentTask;
      }
      return acc;
    }, {});
  };

//process the input from the edit task form
const process_edit_task = e => {
    const title = document.querySelector("#editListTitle").value;
    const details = document.querySelector("#editListInputDetail").value;
    const dateInput = document.querySelector("#editListInputDate").value;
    const taskId = find_hidden_task().id;
    const selectedTask = find_selectedTask_byID(taskId);
  
    selectedTask.title = title;
    selectedTask.details = details;
    selectedTask.date = processDateData(dateInput);
    saveToLocalStorage();
  
    revertEditFormLocation();
    revertOptionLocation();
    show_hidden_task();
  
    const dataProject = selectedTask.dataProject;
    display_refresh_after_editing(dataProject);
  
    e.preventDefault();
  };

//refresh the content display after its been edited/changed in some way
const display_refresh_after_editing = dataProject => {
    const selectedTile = document.querySelector(".selected");
  
    if (selectedTile.closest(".project") != null) {
      show_task(dataProject);
    } else if (selectedTile.closest(".home") != null) {
      checkWhichHomeTile(selectedTile);
    }
  };

//find and return the task that is hidden
const find_hidden_task = () => {
    return document.querySelector("li.hidden");
  };

//reveal edit form for task
const show_editTask_form = e => {
    const editContainerNode = e.target.parentNode.parentNode;
    hideDropDown(editContainerNode);
    relocateEditListForm(e);
  
    document.getElementById("editListTitle").focus();
  };

//move the edit form in place of the task you want to edit
const relocateEditListForm = e => {
    const listNode = e.target.closest("li");
    const ul = listNode.parentNode;
    const editListForm = document.getElementById("editListForm");
    const taskTitle = listNode.querySelector(".taskTitle").textContent;
    const taskDetails = listNode.querySelector(".taskDetails").textContent;
    const taskDate = listNode.querySelector(".date").textContent;
  
    const titleInput = editListForm.querySelector("#editListTitle");
    const detailInput = editListForm.querySelector("#editListInputDetail");
    const dateInput = editListForm.querySelector("#editListInputDate");
  
    titleInput.value = taskTitle;
    detailInput.value = taskDetails;
    dateInput.value = taskDate;
  
    listNode.classList.add("hidden");
    editListForm.classList.remove("hidden");
    ul.insertBefore(editListForm, listNode);
  };

//move form from under the edited list to outside ul for standby
const revertEditFormLocation = () => {
    const editForm = document.querySelector("#editListForm");
    const listToDo = document.querySelector(".list-todo");
  
    editForm.classList.add("hidden");
    listToDo.appendChild(editForm);
  };

//show the hidden task that was hidden during edit mode
const show_hidden_task = () => {
    const hiddenTask = document.querySelector("li.hidden");
    hiddenTask.classList.remove("hidden");
  };

  
export {
style_completed_task,
style_important_task,
update_completed_task,
update_important_task,
delete_task,
show_editTask_form,
relocateEditListForm,
revertEditFormLocation,
process_edit_task,
show_hidden_task
}