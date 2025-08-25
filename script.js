// 2025-26 School Year Countdown (Cedar Rapids CSD - Middle School hrs end 2:50 PM)
function isExcludedDate(date) {
    // Convert date to YYYY-MM-DD format for easy comparison
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    // List of excluded dates (no school for students) in YYYY-MM-DD format
    // From district calendar legend: Staff Learning, Teacher Directed, Teacher Comp Day,
    // Breaks, and District Holidays.
    const excludedDates = [
        // SEPTEMBER 2025
        '2025-09-01', // Labor Day (Holiday)
        '2025-09-22', // Staff Professional Learning

        // OCTOBER 2025
        '2025-10-16', // Teacher Comp Day
        '2025-10-17', // Staff Professional Learning
        '2025-10-27', // Teacher Directed

        // NOVEMBER 2025
        '2025-11-17', // Staff Professional Learning
        '2025-11-26', '2025-11-27', '2025-11-28', // Thanksgiving Break (Wed–Fri)

        // DECEMBER 2025 - WINTER BREAK
        '2025-12-22', '2025-12-23', '2025-12-24', '2025-12-25', '2025-12-26',
        '2025-12-29', '2025-12-30', '2025-12-31',

        // JANUARY 2026
        '2026-01-01', // New Year’s Day (Holiday)
        '2026-01-16', // Staff Professional Learning
        '2026-01-19', // MLK Jr. Day (Holiday)

        // FEBRUARY 2026
        '2026-02-13', // Staff Professional Learning
        '2026-02-16', // Presidents’ Day (Holiday)
        '2026-02-23', // Teacher Directed

        // MARCH 2026
        '2026-03-13', // Staff Professional Learning
        // Spring Break
        '2026-03-23', '2026-03-24', '2026-03-25', '2026-03-26', '2026-03-27',
        '2026-03-30', // Teacher Directed (after break)

        // APRIL 2026
        '2026-04-17', // Staff Professional Learning

        // MAY 2026
        '2026-05-01', // No school day
        '2026-05-11', // Teacher Comp Day
        '2026-05-25'  // Memorial Day (Holiday)
    ];

    return excludedDates.includes(dateString);
}

function getWeekdayCount(startDate, targetDate, includeFinalDay = true) {
    let count = 0;
    let currentDate = new Date(startDate);

    // Normalize to midnight
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
    target.setHours(14, 50, 0, 0); // Middle school dismissal 2:50 PM

    const total = target - now;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { total, days, hours, minutes, seconds };
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

    // Target dates to count down to (6:00 AM anchors; real-time shows 2:50 PM same day)
    const targetDates = [
        // Thanksgiving Break start (Wed)
        { target: new Date(2025, 10, 26, 6, 0, 0, 0), countdownId: 'countdown1', realtimeId: 'realtime1' },
        // Winter Break start (Mon)
        { target: new Date(2025, 11, 22, 6, 0, 0, 0), countdownId: 'countdown2', realtimeId: 'realtime2' },
        // Spring Break start (Mon)
        { target: new Date(2026, 2, 23, 6, 0, 0, 0), countdownId: 'countdown3', realtimeId: 'realtime3' },
        // Last day of school (Wed)
        { target: new Date(2026, 5, 3, 6, 0, 0, 0), countdownId: 'countdown4', realtimeId: 'realtime4' }
    ];

    targetDates.forEach(({ target, countdownId, realtimeId }) => {
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
