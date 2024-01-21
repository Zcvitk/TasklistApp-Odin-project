import {projectList} from "./Create_Project";
import {sortArray} from "./Edit_Project";

function dragAndDropEvent (){
    const project = document.querySelector(".project");
    project.addEventListener("mousedown", enableDraggable);            
    
    const tiles = document.querySelectorAll(".project .tile");
    tiles.forEach((tile) =>{
        dragStartEndEvent(tile);
    });

    project.addEventListener("dragover", dragOver);
}

const enableDraggable = (e) => {
    const isMenuIcon = e.target.matches("[data-drag]");
    if (isMenuIcon) {
        e.target.parentNode.draggable = true;
    }
};

const dragStartEndEvent = (tile) => {
    tile.addEventListener("dragstart", () => {
        tile.classList.add("dragging");
    });

    tile.addEventListener("dragend", () => {
        tile.classList.remove("dragging");
        tile.draggable = false;
        sortArray();
        console.log(projectList);
    });
};

const dragOver = (e) => {
    e.preventDefault();
    const project = document.querySelector(".project");
    const dragging = document.querySelector(".dragging");
    const form = document.querySelector("#projectForm");
    const afterElement = getDragAfterElement(e.clientY);

    if (afterElement == null) {
        project.insertBefore(dragging, form);
    } else {
        project.insertBefore(dragging, afterElement);
    }
};

const getDragAfterElement = (y) => {
    const projectTiles = [...document.querySelectorAll(".project .tile:not(.dragging)")];

    return projectTiles.reduce((closest, tile) => {
        const box = tile.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return {
                offset,
                element: tile
            };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
};


export {dragAndDropEvent, dragStartEndEvent};