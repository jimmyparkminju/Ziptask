
//한국공학대학교 2022551024 박민주

// 각 요소에 대한 참조를 가져오기
const form = document.getElementById("todo-form");
const taskInput = document.querySelector("#task-input");
const categoryInput = document.getElementById("category-input");
const ul = document.getElementById("todo-list");
const progressBar = document.getElementById("progress");
const progressText = document.getElementById("progress-text");
const congrats = document.getElementById("congrats");
const categorySelect = document.getElementById("category-select");
let todos = [];

// 저장된 할 일 목록 불러오기
const fetchTodos = () => {
    todos = JSON.parse(localStorage.getItem("todos")) || [];
}

// 할 일 추가 함수
const addTodo = () => {
    // 입력값 가져오기
    const taskValue = taskInput.value.trim();
    const categoryValue = categoryInput.value.trim();
    const priorityValue = document.querySelector('input[name="priority"]:checked')?.value || "normal";

    // 빈 값 확인
    if (taskValue === "") {
        return;
    }

    // 새로운 할 일 객체 생성
    const todo = {
        title: taskValue,
        completed: false,
        category: categoryValue,
        priority: priorityValue,
    };

    // 배열에 추가하고 로컬 스토리지에 저장
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    // 입력 필드 초기화
    taskInput.value = "";
    categoryInput.value = "";
    // 할 일 목록 다시 렌더링
    renderTodos();
}

// 할 일 삭제 함수
const removeTodo = (index) => {
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
}

// 할 일 완료 토글 함수
const toggleCompleted = (index) => {
    todos[index].completed = !todos[index].completed;
    localStorage.setItem("todos", JSON.stringify(todos));
    updateProgressBar();
    checkCompleted();
}

// 각 할 일 항목을 화면에 렌더링하는 함수
const renderTodo = (todo, index) => {
    const li = document.createElement("li");
    // 체크박스 생성 및 이벤트 리스너 등록
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleCompleted(index));
    // 텍스트 및 삭제 버튼 생성
    const span = document.createElement("span");
    span.innerText = todo.title;
    const categorySpan = document.createElement("span");
    categorySpan.innerText = todo.category ? ` [${todo.category}]` : '';
    const prioritySpan = document.createElement("span");
    prioritySpan.innerText = ` (${todo.priority})`;
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "X";
    deleteBtn.addEventListener("click", () => removeTodo(index));
    // DOM에 추가
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(categorySpan);
    li.appendChild(prioritySpan);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
}

// 할 일 목록을 화면에 렌더링하는 함수
const renderTodos = (filteredTodos = todos) => {
    ul.innerHTML = "";
    filteredTodos.forEach(renderTodo);
    updateProgressBar();
    checkCompleted();
    updateCategoryOptions();
}

// 진행상황 바 업데이트 (프로그레스)함수
const updateProgressBar = () => {
    const completedCount = todos.filter(todo => todo.completed).length;
    const percent = (todos.length > 0) ? (completedCount / todos.length) * 100 : 0;
    progressBar.style.width = percent + "%";
    progressText.innerText = `완료: ${completedCount}/${todos.length} (${percent.toFixed(2)}%)`;
}

//  할 일 모든 항목이 완료되었는지 확인하고 메시지 표시 함수
const checkCompleted = () => {
    if (todos.length === 0) {
        congrats.style.display = "none";
    } else if (todos.every(todo => todo.completed)) {
        congrats.style.display = "block";
    } else {
        congrats.style.display = "none";
    }
}

// 카테고리 필터링 옵션 함수
const updateCategoryOptions = () => {
    const uniqueCategories = [...new Set(todos.map(todo => todo.category))];
    const selectedCategory = categorySelect.value;
    categorySelect.innerHTML = "<option value=''>전체 카테고리</option>";

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.text = category;
        if (category === selectedCategory) {
            option.selected = true; // 현재 선택된 카테고리를 유지
        }
        categorySelect.add(option);
    });
};

// 카테고리에 따라 할 일을 필터링하는 함수
const filterByCategory = () => {
    const selectedCategory = categorySelect.value;
    const filteredTodos = selectedCategory
        ? todos.filter(todo => todo.category === selectedCategory)
        : todos;

    renderTodos(filteredTodos);
};

// 완료된 할 일 삭제 함수
const removeCompletedTodos = () => {
    todos = todos.filter(todo => !todo.completed);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
}

// 제출 이벤트 리스너 등록
form.addEventListener("submit", event => {
    event.preventDefault();
    addTodo();
});

// 초기 할 일 목록 불러오고 화면에 렌더링
fetchTodos();
renderTodos();
