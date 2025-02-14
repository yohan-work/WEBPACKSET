// src/index.js
import './scss/main.scss';
import Handlebars from 'handlebars';

document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');

  let todos = [];

  // Handlebars 템플릿 문자열 (Todo 항목 렌더링)
  const todoTemplateSource = `
    {{#each todos}}
      <li>
        {{this}} <button data-index="{{@index}}" class="delete-btn">Delete</button>
      </li>
    {{/each}}
  `;
  const todoTemplate = Handlebars.compile(todoTemplateSource);

  // Todo 리스트를 렌더링하는 함수
  function renderTodos() {
    const html = todoTemplate({ todos });
    todoList.innerHTML = html;
  }

  // 폼 제출 시 새로운 Todo 추가
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTodo = todoInput.value.trim();
    if (newTodo !== '') {
      todos.push(newTodo);
      renderTodos();
      todoInput.value = '';
    }
  });

  // Delete 버튼 클릭 시 해당 Todo 삭제
  todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const index = e.target.getAttribute('data-index');
      todos.splice(index, 1);
      renderTodos();
    }
  });

  // 초기 렌더링
  renderTodos();
});
