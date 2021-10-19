// referring to index.html making index ids as variants to be used in javascript
var newTaskInput=document.getElementById("newTask");
var tasksTodo=document.getElementById("tasksTodo");
var tasksDone=document.getElementById("tasksDone");


//gets saved data from localstorage. If there is no saved data allows that as well
var todos = JSON.parse(window.localStorage.getItem('tasks')) || []
for (let i = 0; i < todos.length; i++) {
    var listItem = createNewTaskElement(todos[i].value, todos[i].isDone);
    if(todos[i].isDone){
        document.getElementById("tasksDone").appendChild(listItem);
    } else {
        document.getElementById("tasksTodo").appendChild(listItem);      
    }
    taskCount();
}

//add tasks by pressing enter
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
    //type of if else
    listItem.addEventListener("click", isDone ? markTodo : markDone);
	listItem.appendChild(deleteButton);
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

 //delete selected task from list. Both done and todo are possible to be removed from list. Saved in local storage
function deleteTask(event) {
    var doDelete = confirm ("Do you really want to remove selected task?")
    if (doDelete === true) {
        this.parentElement.parentElement.removeChild(this.parentElement);
    }      
    this.parentElement.removeEventListener("click", markDone)
    this.parentElement.removeEventListener("click", markTodo)
    updateLocalStorage();
    taskCount();
}

//function that saves data to local storage. Checks both lists tasksDone and tasksTodo
function updateLocalStorage(){
    var todo = []
    Array.from(tasksDone.children).forEach(element => {
        todo.push({
            value: element.querySelector('span').textContent, isDone: true
        })
    });
    Array.from(tasksTodo.children).forEach(element => {
        todo.push({
            value: element.querySelector('span').textContent, isDone: false
        })
    });   
    window.localStorage.setItem('tasks', JSON.stringify(todo));
}


//task counter that tells user how many tasks are left to do
function taskCount() {
    const count = tasksTodo.childElementCount;
    if (count == 1) {
        document.getElementById("taskCounter").innerHTML = `<strong>${count}</strong> <small>task left to do</small>`;         
    } else if (count == 0) {
        document.getElementById("taskCounter").innerHTML = `<small>All done! Add new tasks!</small>`; 
    } else {
        document.getElementById("taskCounter").innerHTML = `<strong>${count}</strong> <small>tasks left to do</small>`; 
    }
}

//check tasks to be completed. Moves to tasksDone list. Saved in local storage
function markDone(event) {
    document.getElementById("tasksDone").appendChild(this);
    this.removeEventListener("click", markDone);
    this.addEventListener("click", markTodo);
    updateLocalStorage()
    taskCount();
}

//ables done tasks to be marked todo again. Moves tasks tasksTodo list. Saved in local storage
function markTodo(event) {
    document.getElementById("tasksTodo").appendChild(this);
    this.removeEventListener("click", markTodo);
    this.addEventListener("click", markDone);
    updateLocalStorage()
    taskCount();
}

//Remove completed tasks when clicking Remove Completed button. Ask confirmation before removing completed. Saved in local storage
function removeDone() {
    var deleteDone = confirm("Do you really want to remove completed the tasks?");
    if  (deleteDone == true) {
      document.getElementById("tasksDone").innerHTML=""
      updateLocalStorage()
      taskCount();
    }  
}
  
  //Empty Todo-list when Remove All is clicked. Ask confirmation before removing all. Saved in local storage
  function removeAll() {
    var deleteAll = confirm("Do you really want to remove all the tasks?");
    if (deleteAll == true) {
      document.getElementById("tasksTodo").innerHTML =""
      document.getElementById("tasksDone").innerHTML=""
      updateLocalStorage()
      taskCount();
    }
}

//shows all tasks on the list. This is default. Saved in local storage
function showAll() {
    document.getElementById("tasksDone").style.display="block";
    document.getElementById("tasksTodo").style.display="block";
    updateLocalStorage()
}

//when clicked shows only tasks that need to be done aka active tasks. Saved in local storage
function showActive() {
    document.getElementById("tasksDone").style.display="none";
    document.getElementById("tasksTodo").style.display ="block";
    updateLocalStorage()
}

//when clicked shows only tasks that are done. Saved in local storage
function showCompleted() {
    document.getElementById("tasksTodo").style.display ="none";
    document.getElementById("tasksDone").style.display="block";
    updateLocalStorage()
  
}
// Change button to be active depending on which showBtn is clicked. Starts with All showBtn being active
var btnContainer = document.getElementById("wrapper-show");
var buttons = btnContainer.getElementsByClassName("showBtn");
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    if (current.length > 0) { 
        current[0].className = current[0].className.replace(" active", "");
    }
    this.className += " active";
    });
}