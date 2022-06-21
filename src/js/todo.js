const todoList = JSON.parse(window.localStorage.getItem('todos')) || [];

const form = document.createElement('form');
form.classList = 'form card';
form.innerHTML = `
  <h2 class="form_heading">Register new todo</h2>
  <input type="text" placeholder="Title" id="txtTodoItemTitle" data-testid="txtTodoItemTitle" class="form_input"/>
  <input type="text" placeholder="Description" id="description-input" class="form_input"/>
  <div class="form_bottom">
    <button id="btnAddTodo" data-testid="btnAddTodo" class="form_btn">ADD</button>
  </div>
  `;

const todoContainer = document.createElement('section');
todoContainer.classList += 'section';
todoContainer.setAttribute('data-testid', 'todoList');

const root = document.getElementById('root');
root.append(form, todoContainer);

const toggleStatus = (el) => {
  const elementId = el.id;
  const todo = todoList.find((item) => item.id === elementId);
  if (todo) todo.status = todo.status === 'not-done' ? 'done' : 'not-done';
  window.localStorage.setItem('todos', JSON.stringify(todoList));
};

const removeTodo = (el) => {
  todoList.splice(todoList.findIndex((listEl) => el.id === listEl.id), 1);
  window.localStorage.setItem('todos', JSON.stringify(todoList));
};

const renderList = () => {
  todoContainer.innerHTML = '';
  const sortedList = [
    ...todoList.filter((e) => e.status !== 'done'),
    ...todoList.filter((e) => e.status === 'done'),
  ];
  sortedList.forEach((el) => {
    if (el !== undefined) {
      const newDiv = document.createElement('div');
      newDiv.className = `card ${el.status}`;
      newDiv.setAttribute('data-testid', 'todoItem');
      if (el.status === 'done') {
        newDiv.classList.add('todo__item--completed');
      }
      newDiv.innerHTML += `
        <h3 class="card_heading">${el.title}</h3>
        <p class="card_description">${el.description}</p>
      `;
      newDiv.onclick = () => {
        toggleStatus(el);
        renderList();
      };
      const buttonContainer = document.createElement('div');
      buttonContainer.classList = 'card_bottom';
      buttonContainer.innerHTML += `
        <span class="${el.status === 'done' ? 'card_status-done' : 'card_status'}">
          ${el.status === 'done' ? 'DONE' : 'NOT DONE'}
        </span>
      `;
      if (el.status === 'done') {
        const button = document.createElement('button');
        button.className = 'card_btn-remove';
        button.innerHTML = 'REMOVE';
        button.setAttribute('data-testid', 'btnDeleteTodo');
        button.onclick = () => removeTodo(el);
        buttonContainer.appendChild(button);
      }
      newDiv.appendChild(buttonContainer);
      todoContainer.appendChild(newDiv);
    }
  });
};

const addTodo = () => {
  const title = document.getElementById('txtTodoItemTitle').value;
  const description = document.getElementById('description-input').value;
  if (!title) {
    return;
  }
  form.reset();
  todoList.push({
    title, description, status: 'not-done', id: Date.now(),
  });
  window.localStorage.setItem('todos', JSON.stringify(todoList));
  renderList();
};

document.getElementById('btnAddTodo').addEventListener('click', (e) => {
  e.preventDefault();
  addTodo();
});
renderList();
