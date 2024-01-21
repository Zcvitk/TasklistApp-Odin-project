import {createEventListener} from "./Create_Project";
import {listEvent} from "./Create_Task";
import {edit_container} from "./Edit_Project";
import {dragAndDropEvent} from "./Drag_Tiles";
import {show_all_tasks} from "./Home";


listEvent();
createEventListener();
edit_container();
dragAndDropEvent();
show_all_tasks();

//hide side menu event listener
const hiddenMenu = document.querySelector(".hiddenMenu");
hiddenMenu.addEventListener("click", ()=>{
    const left_Menu = document.querySelector(".left_Menu");
    left_Menu.classList.toggle("hidden");
});


