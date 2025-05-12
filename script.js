function isExcludedDate(date) {
    // Convert date to YYYY-MM-DD format for easy comparison
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // List of excluded dates (holidays, breaks, etc.) in YYYY-MM-DD format
    const excludedDates = [
        // Thanksgiving break
        '2024-11-27', '2024-11-28', '2024-11-29',
        
        // Winter break
        '2024-12-23', '2024-12-24', '2024-12-25', '2024-12-26', '2024-12-27', '2024-12-30', '2024-12-31',
        '2025-01-01', '2025-01-02', '2025-01-03',
        
        // Individual excluded dates before Spring Break
        '2025-01-17', // January 17
        '2025-01-20', // January 20
        '2025-02-10', // February 10
        '2025-02-28', // February 28
        
        // Spring Break week
        '2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20', '2025-03-21',
        
        // Individual excluded dates after Spring Break
        '2025-03-31', // March 31
        '2025-04-18', // April 18
        '2025-04-21', // April 21
        '2025-05-02', // May 2
        '2025-05-12', // May 12
        '2025-05-26'  // May 26
    ];
    
    return excludedDates.includes(dateString);
}

function getWeekdayCount(startDate, targetDate, includeFinalDay = true) {
    let count = 0;
    let currentDate = new Date(startDate);
    
    // Start counting from today if before 6 AM, or start counting from today regardless of time
    currentDate.setHours(0, 0, 0, 0);

    const endDate = new Date(targetDate);
    endDate.setHours(0, 0, 0, 0);

    // If includeFinalDay is true, we'll count through the target date
    const finalDay = includeFinalDay ? endDate.getTime() : endDate.getTime() - 1;

    while (currentDate.getTime() <= finalDay) {
        const dayOfWeek = currentDate.getDay();
        // Count Monday (1) through Friday (5) BUT exclude specific dates
        if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isExcludedDate(currentDate)) {
            count++;
            console.log(`Counting ${currentDate.toDateString()} (${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dayOfWeek]}): ${count}`);
        } else if (isExcludedDate(currentDate)) {
            console.log(`Skipping excluded date: ${currentDate.toDateString()}`);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return count;
}

function getTimeRemaining(targetDate) {
    const now = new Date();
    const target = new Date(targetDate);
    target.setHours(14, 50, 0, 0); // Set to 3:20 PM
    
    const total = target - now;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    
    return {
        total,
        days,
        hours,
        minutes,
        seconds
    };
}

function updateRealTimeCountdown(elementId, targetDate) {
    const time = getTimeRemaining(targetDate);
    const element = document.getElementById(elementId);
    
    if (time.total <= 0) {
        element.innerHTML = "Break has started!";
    } else {
        element.innerHTML = `
            <span class="time-value">${time.days}</span><span class="time-label">d</span>
            <span class="time-value">${String(time.hours).padStart(2, '0')}</span><span class="time-label">h</span>
            <span class="time-value">${String(time.minutes).padStart(2, '0')}</span><span class="time-label">m</span>
            <span class="time-value">${String(time.seconds).padStart(2, '0')}</span><span class="time-label">s</span>
        `;
    }
}

function updateCountdowns() {
    const now = new Date();

    const checkTodayIsSchoolDay = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayOfWeek = today.getDay();
        return dayOfWeek >= 1 && dayOfWeek <= 5 && !isExcludedDate(today);
    };

    const adjustCount = (weekdayCount) => {
        const isTodaySchoolDay = checkTodayIsSchoolDay();
        return (now.getHours() >= 6 && isTodaySchoolDay) ? weekdayCount - 1 : weekdayCount;
    };

    // Set target dates
    const targetDates = [
        { target: new Date(2024, 10, 26, 6, 0, 0, 0), countdownId: 'countdown1', realtimeId: 'realtime1' },
        { target: new Date(2024, 11, 20, 6, 0, 0, 0), countdownId: 'countdown2', realtimeId: 'realtime2' },
        { target: new Date(2025, 2, 14, 6, 0, 0, 0), countdownId: 'countdown3', realtimeId: 'realtime3' },
        { target: new Date(2025, 5, 5, 6, 0, 0, 0), countdownId: 'countdown4', realtimeId: 'realtime4' }
    ];

    targetDates.forEach(({ target, countdownId, realtimeId }, index) => {
        if (now >= target) {
            document.getElementById(countdownId).textContent = "0 school days";
        } else {
            const weekdayCount = getWeekdayCount(now, target, true);
            const adjustedCount = adjustCount(weekdayCount);
            document.getElementById(countdownId).textContent = `${adjustedCount} school day${adjustedCount === 1 ? '' : 's'}`;
        }

        // Update real-time countdown to 2:50 PM on target date
        const realTimeTarget = new Date(target);
        realTimeTarget.setHours(14, 50, 0, 0);
        updateRealTimeCountdown(realtimeId, realTimeTarget);
    });
}


function scheduleNextUpdate() {
    const now = new Date();
    const nextUpdate = new Date(now);
    
    // Set to 6 AM
    nextUpdate.setHours(6, 0, 0, 0);
    
    // If it's already past 6 AM, schedule for 6 AM tomorrow
    if (now.getHours() >= 6) {
        nextUpdate.setDate(nextUpdate.getDate() + 1);
    }
    
    const timeUntilUpdate = nextUpdate - now;
    console.log(`Next update scheduled for: ${nextUpdate.toLocaleString()} (in ${Math.round(timeUntilUpdate/1000/60)} minutes)`);
}

function scheduleUpdates() {
    // Update school day counts at 6 AM
    scheduleNextUpdate();
    updateCountdowns(); // Initial update
    
    // Schedule first 6 AM update
    const now = new Date();
    const nextUpdate = new Date(now);
    nextUpdate.setHours(6, 0, 0, 0);
    if (now.getHours() >= 6) {
        nextUpdate.setDate(nextUpdate.getDate() + 1);
    }
    const timeUntilUpdate = nextUpdate - now;
    
    setTimeout(() => {
        updateCountdowns();
        // After first 6 AM update, schedule daily updates
        setInterval(updateCountdowns, 24 * 60 * 60 * 1000);
    }, timeUntilUpdate);
    
    // Update real-time countdowns every second
    setInterval(updateCountdowns, 1000);
}

// Start all countdowns when the script loads
scheduleUpdates();
