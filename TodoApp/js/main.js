import { getLS } from "./service.js";
import { getMaxIdTodo } from "./utils.js";
import { removeDuplicateInternalSpaces } from "./utils.js";
import { createHtmlTodo } from "./utils.js";
import { updateLS } from "./service.js";


document.addEventListener('DOMContentLoaded', () => {

    const listLocalStorage = getLS() || [];
    const clearTodoBtn = document.getElementById("clear-todo");
    const addTodoBtn = document.getElementById("add-todo");
    const inputTextTodo = document.getElementById("write-todo");
    let listLSTodos = [];
    let objTodo = {};
    let idTodo = 0;
    let textTask = '';

    let ulContainerTodos = document.createElement("ul");
    ulContainerTodos.setAttribute("id", "todo-list");



    // at start, I check if localstorage has Todos
    if (listLocalStorage.length > 0) {
        listLocalStorage.forEach(elem => createHtmlTodo(elem, ulContainerTodos));
    }

    // adding a new Todo
    addTodoBtn.addEventListener('click', () => {

        const clearButton = document.createElement("button");

        if (inputTextTodo.value.trim() === '') {
            alert("Inserire un testo non vuoto!");
            return null;
        } else {
            textTask = removeDuplicateInternalSpaces(inputTextTodo.value).toLocaleLowerCase();
        }

        if (getLS().length > 0) {


            if (getLS().find(elem => elem.text === textTask)) {
                alert("Task già inserito!");
                inputTextTodo.value = '';
                return null;
            } else {
                idTodo = parseInt(getMaxIdTodo(getLS()));
                objTodo = {
                    id: idTodo + 1,
                    text: textTask,
                    done: false,
                    createAt: Math.floor(Date.now() / 1000)
                }

                updateLS(getLS(), objTodo, ulContainerTodos);
            }
        } else {
            objTodo = {
                id: 1,
                text: textTask,
                done: false,
                createAt: Math.floor(Date.now() / 1000)
            }
            updateLS(listLSTodos, objTodo, ulContainerTodos);

        }
        inputTextTodo.value = '';

    });

    // clear input text Todo
    clearTodoBtn.addEventListener('click', () => {
        inputTextTodo.value = '';
        inputTextTodo.focus();
    });

});


