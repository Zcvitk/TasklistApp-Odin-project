import {projectList, saveToLocalStorage} from "./Create_Project";
import {title_update} from "./Create_Task";

function edit_container(){

    //Drop-down edit_container
    document.addEventListener("click", project_edit_dropdown);

    //Rename/delete option
    const option = document.querySelector('.project .option');
    option.firstElementChild.addEventListener("click", open_project_rename_form);
    option.lastElementChild.addEventListener("click", delete_project_from_list);

    //Rename form buttons
    const project_edit_renameBTN = document.querySelector(".rename-renameBtn");
    project_edit_renameBTN.addEventListener("click", function(e){
        process_renamed_project(e);
        e.preventDefault();
    });

    const project_rename_cancel_btn = document.querySelector(".rename-cancelBtn");
    project_rename_cancel_btn.addEventListener("click", function(){
        put_rename_option_back();
        display_renamed_project();
    });
}

//Display the dropdown menu of the editContainer
const project_edit_dropdown = (e) =>{
    const isDropdownButton = e.target.matches("[data-dropdown-button]");        

    //If not a dropdown button and clicked within the dropdown, return
    if(!isDropdownButton && e.target.closest('[data-dropdown]') != null){
        return;
    }

    let currentDropDown;

    if(isDropdownButton){
        relocate_edit_container(e);
        currentDropDown = e.target.closest("[data-dropdown]");

        setTimeout(function(){
            currentDropDown.classList.toggle("active");
        },0);
    }

    //Close other open dropdowns
    document.querySelectorAll('[data-dropdown].active').forEach(dropdown => {
        if(dropdown === currentDropDown){
            return;
        }      
        dropdown.classList.remove("active");
    });
}

//Show the rename form for a project
const open_project_rename_form = (e) =>{
    let editContainerNode = e.target.parentNode.parentNode;
    let tileNode = editContainerNode.parentNode;
    
    hideDropDown(editContainerNode);

    let haveForm = check_form_exist();

    if(haveForm === true){
        put_rename_option_back();
        display_renamed_project();
    }

    rename_form_relocate(tileNode);
    rename_form_animate();

    document.getElementById("projectRenameInput").focus();
    tileNode.classList.add("hidden");
}

//Hide the dropdown when the form is open
const hideDropDown = (editContainerNode) => {
    editContainerNode.classList.remove('active');
}

//Check if the rename form already exists
const check_form_exist = () =>{
    const renameForm = document.querySelector("#renameForm");
    if (renameForm.classList.contains("hidden")){
        return false;
    } else {
        return true;
    }
}

//Move the rename form to the clicked tile
function rename_form_relocate(tileNode){
    const projectNode = tileNode.parentNode;
    const renameForm = document.getElementById("renameForm");

    const nameNode = tileNode.querySelector(".projectName");
    let name = nameNode.textContent;

    const input = renameForm.querySelector("input");
    input.value = name;

    projectNode.insertBefore(renameForm, tileNode);
}

//Put the rename form back to original position
function put_rename_option_back(){
    const renameForm = document.getElementById("renameForm");
    const project = document.querySelector(".project");

    renameForm.classList.add("hidden");
    project.appendChild(renameForm);
}

//Animate the rename form when it pops up
const rename_form_animate = () =>{
    const form = document.querySelector("#renameForm");

    setTimeout(function(){
        form.classList.remove("hidden");
    }, 0);
}

//Process the renamed project
const process_renamed_project = (e) =>{
    const tileNode = document.querySelector(".project .tile.hidden");
    let renameInput = document.getElementById("projectRenameInput").value;
    const projectName = tileNode.querySelector(".projectName");
    projectName.textContent = renameInput;

    let dataNum = tileNode.dataset.project;
    projectList[dataNum].name = renameInput;
    saveToLocalStorage();

    display_renamed_project();
    title_update(projectName);
    put_rename_option_back();
}

//Display the renamed project
const display_renamed_project = () => {
    const hiddenTile = document.querySelector("div.hidden");
    hiddenTile.classList.remove("hidden");
}

//Delete a project from the list
const delete_project_from_list = (e) => {
    let tile = e.target.closest(".tile");
    let index = tile.dataset.project;
  
    if(tile.classList.contains("selected")){
        const today = document.querySelector("#today");
        const nameNode = today.querySelector("[data-name]");
        today.classList.add("selected");
        title_update(nameNode);    
    }

    revertOptionLocation(e);
    tile.remove();
    sortArray();
    projectList.splice(index,1);
    saveToLocalStorage();
}

//Sort the projects array and update the dataset
function sortArray(){
    let i=0;

    const tiles = document.querySelectorAll(".project .tile");
    tiles.forEach((tile) =>{
        let dataNum = tile.dataset.project;
        tile.dataset.project = i;
        projectList[dataNum].dataProject = i;
        i++;
    });

    projectList.sort((a,b) => a.dataProject - b.dataProject);
    saveToLocalStorage();
}

//Relocate the option divs under the selected edit_container div to show the container
//projectOption - popup in project, listOption - popup in tasklist

function relocate_edit_container(e){
    const edit_container = e.target.closest(".editContainer");

    if(e.target.closest(".tile") != null){  // Popup in project
        const projectOption = document.getElementById("projectOption");
        projectOption.classList.remove("hidden");
        edit_container.appendChild(projectOption);
    }
    else if(e.target.closest("li") != null){  // Popup in list
        const listOption = document.getElementById("listOption");
        listOption.classList.remove("hidden");
        edit_container.appendChild(listOption);        
    }
} 

// Function to revert the option divs to their original place under .project
function revertOptionLocation() {
    const hideAndMove = (optionId, parentClass) => {
      const option = document.querySelector(`#${optionId}`);
      option.classList.add("hidden");
      const parent = document.querySelector(`.${parentClass}`);
      parent.appendChild(option);
    }
  
    hideAndMove("projectOption", "project");
    hideAndMove("listOption", "list-todo");
  }

export {
edit_container,
open_project_rename_form,
hideDropDown,
delete_project_from_list,
revertOptionLocation,
sortArray
};
