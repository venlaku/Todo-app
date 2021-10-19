// referring to index.html making index ids as variants to be used in javascript
var newTaskInput=document.getElementById("newTask");
var tasksTodo=document.getElementById("tasksTodo");
var tasksDone=document.getElementById("tasksDone");


//gets saved data from localstorage. If there is no saved data allows that as well
var todos = JSON.parse(window.localStorage.getItem('tasks')) || []
//gets listitems from todos list from localstorage
for (let i = 0; i < todos.length; i++) {
    var listItem = createNewTaskElement(todos[i].value, todos[i].isDone);
    if(todos[i].isDone){
        document.getElementById("tasksDone").appendChild(listItem);
    } else {
        document.getElementById("tasksTodo").appendChild(listItem);      
    }
    //updates taskCount after listitems have been retrieved from localstorage
    taskCount();
}

//add tasks by pressing enter. Does the same as clicking addBtn
newTaskInput.addEventListener("keyup", function(e) {
    if (e.code === 'Enter') {
        document.getElementById("addBtn").click();
    }
});


//function to create tasks in list. Includes button that ables to delete selected task
function createNewTaskElement(textInput, isDone){
	var listItem=document.createElement("li");
    //creating delete button
    var deleteButton=document.createElement("button");
	deleteButton.innerText="x";
	deleteButton.className="delete";
    deleteButton.addEventListener("click", deleteTask);
    //type of if else to mark tasks done or todo
    listItem.addEventListener("click", isDone ? markTodo : markDone);
	listItem.appendChild(deleteButton);
    //creating added text that user wrote to the input and returns it as listitem
    var textAdded = document.createElement('span');
    textAdded.textContent = textInput; 
    listItem.appendChild(textAdded);
    listItem.dataset.text=textInput;
	return listItem;
}

//function that adds tasks to list. Also gives warnings when there is no tasks given to input or the input was too short
function addTodo(){
    var textInput = newTaskInput.value
    //alert if input is empty
    if (textInput === '') {
        alert("Please write a task to be added!") 
        document.getElementById("newTask").style.borderColor ="red"
        document.getElementById("newTask").style.borderWidth ="3px"
    //checks if input value equals to 2 or is smaller
    } else if (textInput.length <= 2) { 
        alert("That is too short. Try again!")
        document.getElementById("newTask").style.borderColor ="red"
        document.getElementById("newTask").style.borderWidth ="3px"
     //creates list using previous function and input value
    } else {
        var listItem = createNewTaskElement(textInput); 
        document.getElementById("tasksTodo").appendChild(listItem);
        document.getElementById("newTask").style.borderColor =""
        updateLocalStorage()
    }
    //empties input and is ready for new inputTask
    document.getElementById("newTask").value = ""; 
    taskCount();
}

 //delete selected task from list 
function deleteTask(event) {
    //confirm action from used with confirmation alert
    var doDelete = confirm ("Do you really want to remove selected task?")
    //if user clicks "ok" this returns true and task is removed from the list
    if (doDelete === true) {
        this.parentElement.parentElement.removeChild(this.parentElement);
    }  
    //Both done and todo are possible to be removed from list
    this.parentElement.removeEventListener("click", markDone)
    this.parentElement.removeEventListener("click", markTodo)
    //saved into local storage and taskCount is updated
    updateLocalStorage();
    taskCount();
}

//function that saves data to local storage. Checks both lists tasksDone and tasksTodo
function updateLocalStorage(){
    var todo = []
    //pushes array of tasksdone list todo
    Array.from(tasksDone.children).forEach(element => {
        todo.push({
            value: element.querySelector('span').textContent, isDone: true
        })
    });
    //pushes array of tasksTodo list todo
    Array.from(tasksTodo.children).forEach(element => {
        todo.push({
            value: element.querySelector('span').textContent, isDone: false
        })
    });   
    //saves todo list that has tasksDone and tasksTodo to localstorage
    window.localStorage.setItem('tasks', JSON.stringify(todo));
}


//task counter that tells user how many tasks are left to do
function taskCount() {
    //counts todo elements
    const count = tasksTodo.childElementCount;
    //if there is only one task todo
    if (count == 1) {
        document.getElementById("taskCounter").innerHTML = `<strong>${count}</strong> <small>task left to do</small>`;   
    //if there are no todo tasks      
    } else if (count == 0) {
        document.getElementById("taskCounter").innerHTML = `<small>All done! Add new tasks!</small>`; 
    //returns this when count higher than 1
    } else {
        document.getElementById("taskCounter").innerHTML = `<strong>${count}</strong> <small>tasks left to do</small>`; 
    }
}

//check tasks to be completed. Moves to tasksDone list. 
function markDone(event) {
    document.getElementById("tasksDone").appendChild(this);
    this.removeEventListener("click", markDone);
    this.addEventListener("click", markTodo);
    //Saved in local storage and updating taskCount
    updateLocalStorage()
    taskCount();
}

//ables done tasks to be marked todo again. Moves tasks tasksTodo list. Saved in local storage
function markTodo(event) {
    document.getElementById("tasksTodo").appendChild(this);
    this.removeEventListener("click", markTodo);
    this.addEventListener("click", markDone);
    //Saved in local storage and updating taskCount
    updateLocalStorage()
    taskCount();
}

//Remove completed tasks when clicking Remove Completed button. Ask confirmation before removing completed. Saved in local storage
function removeDone() {
    var deleteDone = confirm("Do you really want to remove completed the tasks?");
    //if user clicks okay returns true. Gives and empty string for tasksDone list
    if  (deleteDone == true) {
      document.getElementById("tasksDone").innerHTML=""
      //Saved in local storage and updating taskCount
      updateLocalStorage()
      taskCount();
    }  
}
  
  //Empty Todo-list when Remove All is clicked. Ask confirmation before removing all. Saved in local storage
function removeAll() {
    var deleteAll = confirm("Do you really want to remove all the tasks?");
    //if user clicks okay returns true. Gives and empty strings for both lists
    if (deleteAll == true) {
      document.getElementById("tasksTodo").innerHTML =""
      document.getElementById("tasksDone").innerHTML=""
      //Saved in local storage and updating taskCount
      updateLocalStorage()
      taskCount();
    }
}

//shows all tasks on the list. This is default. 
function showAll() {
    document.getElementById("tasksDone").style.display="block";
    document.getElementById("tasksTodo").style.display="block";
    //Saved in local storage
    updateLocalStorage()
}

//when clicked shows only tasks that need to be done aka active tasks. Saved in local storage
function showActive() {
    document.getElementById("tasksDone").style.display="none";
    document.getElementById("tasksTodo").style.display ="block";
    //Saved in local storage
    updateLocalStorage()
}

//when clicked shows only tasks that are done. Saved in local storage
function showCompleted() {
    document.getElementById("tasksTodo").style.display ="none";
    document.getElementById("tasksDone").style.display="block";
    //Saved in local storage
    updateLocalStorage()
  
}
//Gets buttons inside wrapper
var btnContainer = document.getElementById("wrapper-show");
var buttons = btnContainer.getElementsByClassName("showBtn");
//Loop trough buttons. 
for (var i = 0; i < buttons.length; i++) {  
    //buttons eventlistener click 
    buttons[i].addEventListener("click", function() { 
     // Currently clicked button is marked as active class. Default active class button is All (look index.html)
    var current = document.getElementsByClassName("active");
    if (current.length > 0) { 
        current[0].className = current[0].className.replace(" active", "");
    }
    //Clicked button is marked as active class
    this.className += " active";
    });
}