import { createHtmlTodo } from "./utils.js";
import { removeDuplicateInternalSpaces } from "./utils.js";
import { firstLetterUpperCase } from "./utils.js";


export function getLS() {
    return JSON.parse(localStorage.getItem('Todos')) || '';
}

export function removeLSTodo(id) {
    const listLocalStorage = getLS();
    const listLocalStorageFiltered = listLocalStorage.filter(elem => elem.id !== parseInt(id));
    localStorage.setItem('Todos', JSON.stringify(listLocalStorageFiltered));;
}

export function updateLS(listLSTodos, objTodo, ulContainerTodos) {
    listLSTodos.push(objTodo);
    localStorage.setItem('Todos', JSON.stringify(listLSTodos));
    createHtmlTodo(removeDuplicateInternalSpaces(objTodo), ulContainerTodos);
}

export function changeStateTodo(evt) {

    const localStorageTodos = getLS();
    localStorageTodos.forEach(elem => {
        if ("todo" + elem.id === evt.target.id) {
            evt.target.checked ? elem.done = true : elem.done = false;
        }
    });
    localStorage.setItem('Todos', JSON.stringify(localStorageTodos));
}

export function modifyTextTodo(evt) {
    const elem = evt.target.closest("button");
    const elemID = elem.id.replace('T', '');
    const oldTextTodo = document.querySelector('label[for="todo' + elemID + '"]');

    const modal = document.createElement('dialog');

    const modalTitle = document.createElement('p');
    modalTitle.innerText = "Inserisci un nuovo task!";

    const modalInputText = document.createElement('input');
    modalTitle.setAttribute('type', 'text');

    const modalEnterBtn = document.createElement('button');
    modalEnterBtn.innerText = "Enter";
    modalEnterBtn.addEventListener('click', () => {
        const listLocalStorage = getLS();

        if (listLocalStorage.find(elem => elem.text === modalInputText.value.toLocaleLowerCase())) {
            alert("Task già inserito!");
            modalInputText.value = '';
            modalInputText.focus();
            return null;
        }
        const updateTodoList = listLocalStorage.map(elem => {
            if (elem.id === parseInt(elemID)) {
                elem.text = firstLetterUpperCase(modalInputText.value);
            }
            return elem;
        });

        localStorage.setItem('Todos', JSON.stringify(updateTodoList));
        oldTextTodo.innerText = modalInputText.value;
        modal.close();
    });

    const modalCloseBtn = document.createElement('button');
    modalCloseBtn.innerText = "X";
    modalCloseBtn.setAttribute('id', 'closeBtnModal');
    modalCloseBtn.addEventListener('click', () => modal.remove(), { once: true });

    modal.appendChild(modalCloseBtn);
    modal.appendChild(modalTitle);
    modal.appendChild(modalInputText);
    modal.appendChild(modalEnterBtn);
    document.body.appendChild(modal);
    modal.showModal();

}

