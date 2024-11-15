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
    // Set target dates
    const targetDate1 = new Date(2024, 10, 26, 6, 0, 0, 0); // November 26, 2024 at 6:00 AM
    const targetDate2 = new Date(2024, 11, 20, 6, 0, 0, 0); // December 20, 2024 at 6:00 AM
    const targetDate3 = new Date(2025, 2, 14, 6, 0, 0, 0);  // March 14, 2025 at 6:00 AM
    const targetDate4 = new Date(2025, 5, 3, 6, 0, 0, 0);   // June 3, 2025 at 6:00 AM

    // Handle November 26th countdown
    if (now >= targetDate1) {
        document.getElementById('countdown1').textContent = "0 school days";
    } else {
        const weekdayCount1 = getWeekdayCount(now, targetDate1);
        const adjustedCount1 = now.getHours() >= 6 ? weekdayCount1 - 1 : weekdayCount1;
        document.getElementById('countdown1').textContent = `${adjustedCount1} school day${adjustedCount1 === 1 ? '' : 's'}`;
    }
    
    // Handle December 20th countdown
    if (now >= targetDate2) {
        document.getElementById('countdown2').textContent = "0 school days";
    } else {
        const weekdayCount2 = getWeekdayCount(now, targetDate2);
        const adjustedCount2 = now.getHours() >= 6 ? weekdayCount2 - 1 : weekdayCount2;
        document.getElementById('countdown2').textContent = `${adjustedCount2} school day${adjustedCount2 === 1 ? '' : 's'}`;
    }

    // Handle Spring Break countdown
    if (now >= targetDate3) {
        document.getElementById('countdown3').textContent = "0 school days";
    } else {
        const weekdayCount3 = getWeekdayCount(now, targetDate3, true);
        const adjustedCount3 = now.getHours() >= 6 ? weekdayCount3 - 1 : weekdayCount3;
        document.getElementById('countdown3').textContent = `${adjustedCount3} school day${adjustedCount3 === 1 ? '' : 's'}`;
    }

    // Handle End of School countdown
    if (now >= targetDate4) {
        document.getElementById('countdown4').textContent = "0 school days";
    } else {
        const weekdayCount4 = getWeekdayCount(now, targetDate4, true);
        const adjustedCount4 = now.getHours() >= 6 ? weekdayCount4 - 1 : weekdayCount4;
        document.getElementById('countdown4').textContent = `${adjustedCount4} school day${adjustedCount4 === 1 ? '' : 's'}`;
    }

    // Update real-time countdowns
    const realTimeTarget1 = new Date(2024, 10, 26); // Nov 26
    const realTimeTarget2 = new Date(2024, 11, 20); // Dec 20
    const realTimeTarget3 = new Date(2025, 2, 14);  // Mar 14
    const realTimeTarget4 = new Date(2025, 5, 3);   // Jun 3
    
    updateRealTimeCountdown('realtime1', realTimeTarget1);
    updateRealTimeCountdown('realtime2', realTimeTarget2);
    updateRealTimeCountdown('realtime3', realTimeTarget3);
    updateRealTimeCountdown('realtime4', realTimeTarget4);
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
