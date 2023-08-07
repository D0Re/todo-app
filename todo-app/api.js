async function fetchTodos(owner) {
  const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
  const todoItemList = await response.json();
  return todoItemList;
}

async function updateTodoStatus(todoItem) {
  const response = await fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ done: todoItem.done }),
    headers: { 'Content-Type': 'application/json' },
  });
  return response;
}

async function deleteTodoItem(todoItem) {
  const response = await fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
    method: 'DELETE',
  });
  return response;
}

async function createTodoItem(name, owner) {
  const response = await fetch('http://localhost:3000/api/todos', {
    method: 'POST',
    body: JSON.stringify({ name: name.trim(), owner }),
    headers: { 'Content-Type': 'application/json' },
  });
  const todoItem = await response.json();
  return todoItem;
}

export {
  fetchTodos,
  updateTodoStatus,
  deleteTodoItem,
  createTodoItem
};
