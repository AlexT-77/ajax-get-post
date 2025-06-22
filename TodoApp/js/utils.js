import { removeLSTodo } from "./service.js";
import { changeStateTodo } from "./service.js";
import { modifyTextTodo } from "./service.js";


export function deleteTodo(clearTodo, objTodo) {

    clearTodo.addEventListener('click', () => {
        objTodo.value = "";
        objTodo.focus();
    });
}


export function removeDuplicateInternalSpaces(text) {
    return typeof (text) === 'string' ? text.replace('\nX', '').trim().replace(/\s+/g, ' ') : text;
}

export function createHtmlTodo(objTodo, ulContainerTodos) {
    const li = document.createElement("li");
    const wrapperTodo = document.createElement("div");
    const wrapperButtons = document.createElement("div");
    const todosSection = document.getElementById("todos-section");

    wrapperTodo.classList.add("todo");
    const pastTime = Math.floor(Date.now() / 1000) - objTodo.createAt;

    if (pastTime >= 172800) {
        wrapperTodo.classList.add('danger');
    } else if (pastTime >= 86400 && pastTime < 172800) {
        wrapperTodo.classList.add('warning');
    } else {
        wrapperTodo.classList.add('normal');
    }

    const div = document.createElement("div");
    const checkTodo = document.createElement("input");
    checkTodo.setAttribute("type", "checkbox");
    checkTodo.id = "todo" + objTodo.id;
    checkTodo.addEventListener('change', (evt) => changeStateTodo(evt));


    li.setAttribute("id", objTodo.id);

    const labelTodo = document.createElement("label");
    labelTodo.setAttribute("for", "todo" + objTodo.id);
    labelTodo.innerText = firstLetterUpperCase(objTodo.text);

    const removeTodoBtn = document.createElement("button");

    removeTodoBtn.id = "C" + objTodo.id;
    removeTodoBtn.textContent = "X";
    removeTodoBtn.addEventListener('click', (evt) => {
        const elem = evt.target.closest("li");
        elem.remove();
        removeLSTodo(elem.id);
    }, { once: true });



    const modifyTodoBtn = document.createElement("button");
    modifyTodoBtn.id = "T" + objTodo.id;
    modifyTodoBtn.textContent = "T";

    wrapperButtons.appendChild(modifyTodoBtn);
    wrapperButtons.appendChild(removeTodoBtn);
    wrapperButtons.classList.add('wrapperButtons');
    modifyTodoBtn.addEventListener('click', modifyTextTodo);


    // creating HTML structure
    div.appendChild(checkTodo);
    div.appendChild(labelTodo);
    wrapperTodo.appendChild(div);
    wrapperTodo.appendChild(wrapperButtons);
    li.appendChild(wrapperTodo);
    li.classList.add('todo-item-enter');

    if (objTodo.done) {
        checkTodo.setAttribute('checked', true);
    }
    ulContainerTodos.appendChild(li);

    todosSection.appendChild(ulContainerTodos);

}

export function getMaxIdTodo(listLSTodos) {
    return listLSTodos.reduce((max, elem) => elem.id > max ? elem.id : max, 0);
}

export function firstLetterUpperCase(text) {
    const firstLetter = text.charAt(0).toUpperCase();
    const restOfText = text.slice(1);
    return firstLetter + restOfText;
}
