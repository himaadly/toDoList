let button  = document.getElementById("eraseDataBtn");

button.addEventListener("click",function(event){
    window.localStorage.removeItem("tasks");
    window.alert("All tasks have been deleted !!");
});


window.onload = (event) => {
    var checked = localStorage.getItem("display");
    if (checked == "none") {
        document.getElementById("DissapearActicator").checked = true;
    }
};

function myFunction(){
var checkBox  = document.getElementById("DissapearActicator");

if (checkBox.checked == true) {
    window.localStorage.setItem("display", "none");
}
else {
    window.localStorage.setItem("display", "block");
}
}

function getTasks(){
    return JSON.parse(window.localStorage.getItem("tasks")) || [];
}

const allTask = this.getTasks();

let tasksTrue = this.getTasks();
tasksTrue = tasksTrue.filter((task) => task.completed == true);

let tasksFalse = this.getTasks();
tasksFalse = tasksFalse.filter((task) => task.completed == false);

updateStatus(allTask.length,tasksTrue.length,tasksFalse.length);

function updateStatus(length,lengthTrue,lengthFalse){
let statusParagragh = document.getElementById("status");
       let status = length.toString(16);
       statusParagragh.innerText ="Number of  Tasks: "+ status;  

       let completedParagraph = document.getElementById("completedStatus");
       let lengthcomplete = lengthTrue.toString(16);
       completedParagraph.innerText ="Number of  Tasks Completed: "+ lengthcomplete;

       let notcompletedParagraph = document.getElementById("notCompletedStatus");
       let lengthnotComplete = lengthFalse.toString(16);
       notcompletedParagraph.innerText ="Number of  Tasks Not-Completed: "+ lengthnotComplete;
}