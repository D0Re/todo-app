import { fetchTodos, updateTodoStatus, deleteTodoItem, createTodoItem } from './api.js';


function createAppTitle(title) {
  let appTitle = document.createElement('h2');
  appTitle.innerHTML = title;
  return appTitle;
}

function createTodoItemForm() {
  let form = document.createElement('form');
  let input = document.createElement('input');
  let button = document.createElement('button');
  let buttonWrapper = document.createElement('div');

  button.disabled = !input.value.length;

  input.addEventListener('input', () => {
    button.disabled = !input.value.length;
  });

  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = 'Введите название нового дела';
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Добавить дело';
  buttonWrapper.classList.add('input-group-append');

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  return {
    form,
    input,
    button,
  };
}

function createTodoList() {
  let list = document.createElement('ul');
  list.classList.add('list-group');
  return list;
}

function createTodoItemElement(todoItem, { onDone, onDelete }) {
  const doneClass = 'list-group-item-success';
  let item = document.createElement('li');
  let buttonGroup = document.createElement('div');
  let doneButton = document.createElement('button');
  let deleteButton = document.createElement('button');

  item.id = todoItem.id;
  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  if (todoItem.done) {
    item.classList.add(doneClass);
  }
  doneButton.classList.add('btn', 'btn-success');
  deleteButton.classList.add('btn', 'btn-danger');
  item.textContent = todoItem.name;
  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.textContent = 'Готово';
  deleteButton.textContent = 'Удалить';

  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  doneButton.addEventListener('click', () => {
    onDone(todoItem);
    item.classList.toggle(doneClass, todoItem.done);
  });

  deleteButton.addEventListener('click', () => {
    onDelete(todoItem);
    item.remove();
  });

  return {
    item,
    doneButton,
    deleteButton,
    buttonGroup,
  };
}

async function createTodoApp(container, title, owner) {
  let todoAppTitle = createAppTitle(title);
  let todoItemForm = createTodoItemForm();
  let todoList = createTodoList();
  let storageToggle = createStorageToggle();

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(storageToggle);
  container.append(todoList);

  const todoItemList = await fetchTodos(owner);

  todoItemList.forEach(todoItem => {
    const todoItemElement = createTodoItemElement(todoItem, {
      onDone: async todoItem => {
        todoItem.done = !todoItem.done;
        await updateTodoStatus(todoItem);
      },
      onDelete: async todoItem => {
        if (confirm('Вы уверены?')) {
          await deleteTodoItem(todoItem);
        }
      },
    });
    todoList.append(todoItemElement.item);
  });

  todoItemForm.form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!todoItemForm.input.value) {
      return;
    }

    const todoItem = await createTodoItem(todoItemForm.input.value, owner);

    const todoItemElement = createTodoItemElement(todoItem, {
      onDone: async todoItem => {
        todoItem.done = !todoItem.done;
        await updateTodoStatus(todoItem);
      },
      onDelete: async todoItem => {
        if (confirm('Вы уверены?')) {
          await deleteTodoItem(todoItem);
        }
      },
    });

    todoList.append(todoItemElement.item);
    todoItemForm.input.value = '';
    todoItemForm.button.disabled = !todoItemForm.button.disabled;
  });

  async function toggleStorage() {
    const currentStorage = localStorage.getItem('storage');
    if (currentStorage === 'local') {
      localStorage.setItem('storage', 'server');
    } else {
      localStorage.setItem('storage', 'local');
    }
    location.reload(); 
  }


  function createStorageToggle() {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary', 'mb-3');
    button.textContent = 'Перейти на серверное хранилище';


    const currentStorage = localStorage.getItem('storage');
    if (currentStorage === 'server') {
      button.textContent = 'Перейти на локальное хранилище';
    }

    button.addEventListener('click', toggleStorage);

    return button;
  }
}


export { createTodoApp };
