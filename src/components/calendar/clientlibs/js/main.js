// src/components/calendar/clientlibs/js/main.js

document.addEventListener('DOMContentLoaded', function() {
	const calendarEl = document.getElementById('calendar');
  
	// 현재 표시할 월과 연도
	let currentDate = new Date();
	let currentMonth = currentDate.getMonth(); // 0 ~ 11
	let currentYear = currentDate.getFullYear();
  
	// 캘린더 렌더링 함수
	function renderCalendar(month, year) {
	  calendarEl.innerHTML = ''; // 캘린더 영역 초기화
  
	  // 캘린더 헤더 생성: 이전/다음 버튼과 월/연도 표시
	  const headerDiv = document.createElement('div');
	  headerDiv.className = 'calendar-header';
  
	  const prevBtn = document.createElement('button');
	  prevBtn.textContent = '<';
	  const nextBtn = document.createElement('button');
	  nextBtn.textContent = '>';
	  const monthYearText = document.createElement('span');
	  monthYearText.textContent = `${year} - ${month + 1}`;
  
	  headerDiv.appendChild(prevBtn);
	  headerDiv.appendChild(monthYearText);
	  headerDiv.appendChild(nextBtn);
	  calendarEl.appendChild(headerDiv);
  
	  // 이전/다음 버튼 이벤트
	  prevBtn.addEventListener('click', function() {
		currentMonth--;
		if (currentMonth < 0) {
		  currentMonth = 11;
		  currentYear--;
		}
		renderCalendar(currentMonth, currentYear);
	  });
  
	  nextBtn.addEventListener('click', function() {
		currentMonth++;
		if (currentMonth > 11) {
		  currentMonth = 0;
		  currentYear++;
		}
		renderCalendar(currentMonth, currentYear);
	  });
  
	  // 캘린더 그리드 생성: 요일 레이블
	  const daysGrid = document.createElement('div');
	  daysGrid.className = 'calendar-days';
	  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	  daysOfWeek.forEach(day => {
		const dayLabel = document.createElement('div');
		dayLabel.textContent = day;
		daysGrid.appendChild(dayLabel);
	  });
  
	  // 해당 월의 총 일수와 첫날의 요일 계산
	  const daysInMonth = new Date(year, month + 1, 0).getDate();
	  const firstDay = new Date(year, month, 1).getDay();
  
	  // 첫 날 이전의 빈 칸 채우기
	  for (let i = 0; i < firstDay; i++) {
		const emptyCell = document.createElement('div');
		daysGrid.appendChild(emptyCell);
	  }
  
	  // 날짜 셀 생성
	  for (let day = 1; day <= daysInMonth; day++) {
		const dayCell = document.createElement('div');
		dayCell.textContent = day;
		dayCell.style.cursor = 'pointer';
		// 날짜 선택 시 이벤트 처리
		dayCell.addEventListener('click', function() {
		  alert(`Selected date: ${year}-${month + 1}-${day}`);
		});
		daysGrid.appendChild(dayCell);
	  }
  
	  calendarEl.appendChild(daysGrid);
	}
  
	// 초기 캘린더 렌더링
	renderCalendar(currentMonth, currentYear);
  });
  