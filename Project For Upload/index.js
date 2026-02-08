 // DOM Elements
        const dayInput = document.getElementById('day');
        const monthInput = document.getElementById('month');
        const yearInput = document.getElementById('year');
        const findDayBtn = document.getElementById('findDayBtn');
        const todayBtn = document.getElementById('todayBtn');
        const formattedDate = document.getElementById('formattedDate');
        const dayResult = document.getElementById('dayResult');
        const dayInfo = document.getElementById('dayInfo');
        const historyList = document.getElementById('historyList');
        
        // Days of the week
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        // Months of the year
        const monthsOfYear = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        // Load history from localStorage
        let searchHistory = JSON.parse(localStorage.getItem('dayFinderHistory')) || [];
        updateHistoryList();
        
        // Set current date as default
        setCurrentDate();
        
        // Event Listeners
        findDayBtn.addEventListener('click', findDayOfWeek);
        todayBtn.addEventListener('click', setCurrentDateAndFind);
        
        // Allow Enter key to trigger findDayOfWeek
        [dayInput, monthInput, yearInput].forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    findDayOfWeek();
                }
            });
        });
        
        // Main function to find day of the week
        function findDayOfWeek() {
            // Get input values
            const day = parseInt(dayInput.value);
            const month = parseInt(monthInput.value);
            const year = parseInt(yearInput.value);
            
            // Validate inputs
            if (!isValidDate(day, month, year)) {
                dayResult.textContent = "Invalid Date";
                dayInfo.textContent = "Please enter a valid date";
                formattedDate.textContent = "Invalid Date";
                dayResult.style.color = "#e74c3c";
                return;
            }
            
            // Create date object (month is 0-indexed in JavaScript Date)
            const date = new Date(year, month - 1, day);
            
            // Get day of week (0 = Sunday, 6 = Saturday)
            const dayOfWeekIndex = date.getDay();
            const dayOfWeekName = daysOfWeek[dayOfWeekIndex];
            
            // Format the date for display
            const formattedDateStr = `${monthsOfYear[month-1]} ${day}, ${year}`;
            
            // Display results
            formattedDate.textContent = formattedDateStr;
            dayResult.textContent = dayOfWeekName;
            dayInfo.textContent = `${formattedDateStr} falls on a ${dayOfWeekName}`;
            dayResult.style.color = "#6a11cb";
            
            // Add to history
            addToHistory(day, month, year, dayOfWeekName, formattedDateStr);
        }
        
        // Function to validate date
        function isValidDate(day, month, year) {
            // Basic validation
            if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
            if (day < 1 || day > 31) return false;
            if (month < 1 || month > 12) return false;
            if (year < 100 || year > 9999) return false;
            
            // Check for valid days in month
            const daysInMonth = new Date(year, month, 0).getDate();
            return day <= daysInMonth;
        }
        
        // Function to set current date
        function setCurrentDate() {
            const today = new Date();
            dayInput.value = today.getDate();
            monthInput.value = today.getMonth() + 1; // Months are 0-indexed
            yearInput.value = today.getFullYear();
        }
        
        // Function to set current date and find day
        function setCurrentDateAndFind() {
            setCurrentDate();
            findDayOfWeek();
        }
        
        // Function to add search to history
        function addToHistory(day, month, year, dayOfWeekName, formattedDateStr) {
            // Create history item
            const historyItem = {
                date: formattedDateStr,
                day: dayOfWeekName,
                timestamp: new Date().toISOString()
            };
            
            // Add to beginning of history array
            searchHistory.unshift(historyItem);
            
            // Keep only last 5 items
            if (searchHistory.length > 5) {
                searchHistory = searchHistory.slice(0, 5);
            }
            
            // Save to localStorage
            localStorage.setItem('dayFinderHistory', JSON.stringify(searchHistory));
            
            // Update history list display
            updateHistoryList();
        }
        
        // Function to update history list
        function updateHistoryList() {
            // Clear current list
            historyList.innerHTML = '';
            
            // If no history
            if (searchHistory.length === 0) {
                const emptyItem = document.createElement('li');
                emptyItem.className = 'history-item';
                emptyItem.innerHTML = '<span class="history-date">No searches yet</span><span class="history-day">--</span>';
                historyList.appendChild(emptyItem);
                return;
            }
            
            // Add history items
            searchHistory.forEach(item => {
                const li = document.createElement('li');
                li.className = 'history-item';
                li.innerHTML = `
                    <span class="history-date">${item.date}</span>
                    <span class="history-day">${item.day}</span>
                `;
                historyList.appendChild(li);
            });
        }
        
        // Initialize with today's date result
        window.addEventListener('load', () => {
            setTimeout(setCurrentDateAndFind, 500);
        });
        
        // Add some example history if empty
        if (searchHistory.length === 0) {
            const today = new Date();
            const exampleDate1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
            const exampleDate2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            const exampleDate3 = new Date(2020, 0, 1); // New Year's Day 2020
            
            addToHistory(
                exampleDate1.getDate(),
                exampleDate1.getMonth() + 1,
                exampleDate1.getFullYear(),
                daysOfWeek[exampleDate1.getDay()],
                `${monthsOfYear[exampleDate1.getMonth()]} ${exampleDate1.getDate()}, ${exampleDate1.getFullYear()}`
            );
            
            addToHistory(
                exampleDate2.getDate(),
                exampleDate2.getMonth() + 1,
                exampleDate2.getFullYear(),
                daysOfWeek[exampleDate2.getDay()],
                `${monthsOfYear[exampleDate2.getMonth()]} ${exampleDate2.getDate()}, ${exampleDate2.getFullYear()}`
            );
            
            addToHistory(
                exampleDate3.getDate(),
                exampleDate3.getMonth() + 1,
                exampleDate3.getFullYear(),
                daysOfWeek[exampleDate3.getDay()],
                `${monthsOfYear[exampleDate3.getMonth()]} ${exampleDate3.getDate()}, ${exampleDate3.getFullYear()}`
            );
        }