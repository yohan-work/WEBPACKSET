// src/components/todo/clientlibs/js/main.js

document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('todo-form');
	const input = document.getElementById('todo-input');
	const list = document.getElementById('todo-list');
	let todos = [];
  
	// 새 Todo 추가
	form.addEventListener('submit', function(e) {
	  e.preventDefault();
	  const todoText = input.value.trim();
	  if (todoText !== '') {
		todos.push(todoText);
		input.value = '';
		renderTodos();
	  }
	});
  
	// Todo 삭제 (Delete 버튼 클릭 시)
	list.addEventListener('click', function(e) {
	  if (e.target.classList.contains('delete-btn')) {
		const index = e.target.getAttribute('data-index');
		todos.splice(index, 1);
		renderTodos();
	  }
	});
  
	// Todo 항목 렌더링 함수
	function renderTodos() {
	  list.innerHTML = todos.map((todo, index) => {
		return `<li>${todo} <button class="delete-btn" data-index="${index}">Delete</button></li>`;
	  }).join('');
	}
  });
  