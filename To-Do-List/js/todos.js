let taskActivator = document.getElementById("tasksCreator");
let taskArea = document.getElementById("taskArea");

let completedArea = document.getElementById("CompletedTaskArea");

// global variable to save id of the task that we pressed edit on 
let selectedTaskID = null;

// Creating an event for the button and test it
taskActivator.addEventListener("click", function (event) {

    // 1. Get values
    let primaryTask = document.querySelector("#tasksInput");
    const value = {
        title: primaryTask.value
    };

    // 2. Validate incoming values
    if (!value.title) return;
    

    // 3. Create task with incoming values
    const task = database.saveTask(value);

    // 4. Insert the new task into the UI
    UI.insertTask(task);
    
    //5.empty the input after sending data 
    primaryTask.value = "";

    // 6. Update side bar stats
    // const count = database.getCount();
    // UI.updateStats();
    database.getCount();
});


//Creating an event to delete and edit the Active tasks
taskArea.addEventListener("click",(e)=>{
    if (e.target.classList.contains("delete")) {
        database.deleteActiveTask(e.target.parentElement.getAttribute("data-id"));
        e.target.parentElement.remove();
        database.getCount();
    }
    if (e.target.classList.contains("edit")) {
        UI.editActiveTask(e.target.parentElement.getAttribute("data-id"));
        selectedTaskID = e.target.parentElement.getAttribute("data-id") ;
    }
    if (e.target.classList.contains("Completed")) {
        // console.log("hahaha");
        database.changeToCompleted(e.target.parentElement.getAttribute("data-id"))
        database.getCount();
    }
});
//creating an event for delete and edit in completed tasks
completedArea.addEventListener("click",(e)=>{
    if (e.target.classList.contains("delete")) {
        database.deleteActiveTask(e.target.parentElement.getAttribute("data-id"));
        e.target.parentElement.remove();
        database.getCount();
    }
    if (e.target.classList.contains("notCompleted")) {
        // console.log("hahaha");
        database.changeToNotCompleted(e.target.parentElement.getAttribute("data-id"));
        database.getCount();
    }
});

 //make span in the edited change it back to hiddean 
let editSpan = document.getElementById("editActivator");
    editSpan.addEventListener("click",function(event){
    //send data to local Storage 
    UI.editSelectedTask();
    document.getElementById("popUpForm").style.display = "none";
    
})




const UI = {

    loadAllTasks(tasks) {
        tasks.forEach((task) => {this.insertTask(task)
    
        });
    },

    insertTask(task) {

        if(task.completed == false){
        //the taskDiv in the active tasks
        let taskDiv = document.createElement("div");
        taskDiv.className = "completedTask";
        taskDiv.setAttribute("data-id", task.id); // custome attribute for each
        // taskDiv.appendChild(document.createTextNode(task.title));
        taskArea.appendChild(taskDiv);

        let data = document.createElement("p");
        data.innerText = task.title;
        taskDiv.appendChild(data);

        // the delete span for each cmpleted task
        let deleteSpan = document.createElement("span");
        deleteSpan.className = "delete";
        deleteSpan.appendChild(document.createTextNode("Delete"));
        taskDiv.appendChild(deleteSpan);

        // the Edit span for each cmpleted task
        let editSpan = document.createElement("span");
        editSpan.className = "edit";
        editSpan.appendChild(document.createTextNode("Edit"));
        taskDiv.appendChild(editSpan);

        //the completed span for each task 
        let completedSpan = document.createElement("span");
        completedSpan.className = "Completed";
        completedSpan.appendChild(document.createTextNode("complete"));
        taskDiv.appendChild(completedSpan);
        
    }
    else{

         UI.changeToCompleted(task.title,task.id);

    }

    },

    editActiveTask(activeTaskID){

        // change display of div as we press edit span 
        document.getElementById("popUpForm").style.display = "block";
         // get data from local storage for this specific task 
        let tasks = database.getTasks();
        tasks = tasks.filter((task) => task.id == activeTaskID);
        tasks.forEach(task => {
        // database.editedData(task.title);
        let form =  document.getElementById("popUpinput");
        form.value =task.title;
        
        
        });
    
    },
    editSelectedTask(){
        let input  = document.getElementById("popUpinput");
        let paragraph = document.querySelector(`div[data-id="${selectedTaskID}"]`).querySelector("p");
        paragraph.innerText = input.value; 
        database.updatedData(paragraph.innerText);
    },
    updateStatus(length,lengthTrue,lengthFalse){

        let statusParagragh = document.getElementById("status");
       let status = length.toString(16);
       statusParagragh.innerText ="Number of  Tasks: "+ status;  

       let completedParagraph = document.getElementById("completedStatus");
       let lengthcomplete = lengthTrue.toString(16);
       completedParagraph.innerText ="Number of  Tasks Completed: "+ lengthcomplete;

       let notcompletedParagraph = document.getElementById("notCompletedStatus");
       let lengthnotComplete = lengthFalse.toString(16);
       notcompletedParagraph.innerText ="Number of  Tasks Not-Completed: "+ lengthnotComplete;

    },
    quotesDissapear(){
        let displayData = window.localStorage.getItem("display");
        
        if(displayData == "none"){
        document.getElementById("quotesArea").style.display = "none" ;
            
        }
    },
    changeToCompleted(data,id){
        // console.log(typeof data);
        let completed = document.getElementById("CompletedTaskArea");
        let notcompletedTask = document.createElement("div");
        notcompletedTask.className = "completedTask";
        notcompletedTask.setAttribute("data-id",id);
        notcompletedTask.appendChild(document.createTextNode(data));
        completed.appendChild(notcompletedTask);

        //the not completed span for each task 
        let notCompletedSpan = document.createElement("span");
        notCompletedSpan.className = "notCompleted";
        notCompletedSpan.appendChild(document.createTextNode("Not-Complete"));
        notcompletedTask.appendChild(notCompletedSpan);

         // the delete span for each cmpleted task
         let deleteSpan = document.createElement("span");
         deleteSpan.className = "delete";
         deleteSpan.appendChild(document.createTextNode("Delete"));
         notcompletedTask.appendChild(deleteSpan);

    }
  
}

const database = {

    getTasks() {
        return JSON.parse(window.localStorage.getItem("tasks")) || [];
    },

    saveTask(value) {

        const task = {
            id: Date.now(),
            title: value.title,
            completed: false,
        };

        // Get all tasks
        const allTasks = this.getTasks();

        // Save task into local storage
        allTasks.push(task);

        window.localStorage.setItem("tasks", JSON.stringify(allTasks));

        return task;
    },

    deleteActiveTask(activeTaskID){

        let tasks = this.getTasks();
        
        tasks = tasks.filter((task) => task.id != activeTaskID);

        window.localStorage.setItem("tasks", JSON.stringify(tasks)); 
        
    },
    updatedData(updatedText){
        
        let tasks = this.getTasks();
        // let task = tasks.find((task) => task.id == selectedTaskID);
        // task.title = updatedText ; 
        for(let i=0; i<tasks.length ; i++){
            if(tasks[i].id == selectedTaskID){
                tasks[i].title = updatedText;
            }
        }
        window.localStorage.setItem("tasks",JSON.stringify(tasks));
        
        // select element from data storage 
        
        // update data of selected array in local storage 

        
    },

    getCount() {
        
        const allTask = this.getTasks();

        let tasksTrue = this.getTasks();
        tasksTrue = tasksTrue.filter((task) => task.completed == true);
        
        let tasksFalse = this.getTasks();
        tasksFalse = tasksFalse.filter((task) => task.completed == false);

        UI.updateStatus(allTask.length,tasksTrue.length,tasksFalse.length);
    },
    changeToCompleted(selectedTaskID){
        let tasks = this.getTasks();
        for(let i=0; i<tasks.length ; i++){
            if(tasks[i].id == selectedTaskID){
        document.querySelector(`div[data-id="${selectedTaskID}"]`).remove(); 
            tasks[i].completed = true;
            UI.changeToCompleted(tasks[i].title,tasks[i].id);
            }
        }
        window.localStorage.setItem("tasks",JSON.stringify(tasks));
    },
    changeToNotCompleted(selectedTaskID){
        let tasks = this.getTasks();
        for(let i=0; i<tasks.length ; i++){
            if(tasks[i].id == selectedTaskID){
             document.querySelector(`div[data-id="${selectedTaskID}"]`).remove(); 
            tasks[i].completed = false;
            UI.insertTask(tasks[i]);
            }
        }
        window.localStorage.setItem("tasks",JSON.stringify(tasks));
        
    }
}   


    // Load all tasks
    const allTasks = database.getTasks();
    UI.loadAllTasks(allTasks);
    // database.changeToCompleted();
    
    // Update the stats
    database.getCount();
    UI.quotesDissapear();



    


