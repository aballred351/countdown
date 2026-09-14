// Cedar Rapids Community School District
// 2026-27 School Countdown

// ============================================================
// NO-SCHOOL DATES
// Weekends are automatically excluded, so they do not
// need to be listed here.
// ============================================================

const noSchoolDates = new Set([
    // September 2026
    "2026-09-21",

    // October 2026
    "2026-10-05",
    "2026-10-19",

    // November 2026
    "2026-11-02",
    "2026-11-03",
    "2026-11-25",
    "2026-11-26",
    "2026-11-27",

    // December 2026
    "2026-12-24",
    "2026-12-25",
    "2026-12-28",
    "2026-12-29",
    "2026-12-30",
    "2026-12-31",

    // January 2027
    "2027-01-01",
    "2027-01-18",

    // February 2027
    "2027-02-01",
    "2027-02-15",

    // March 2027
    "2027-03-15",
    "2027-03-16",
    "2027-03-17",
    "2027-03-18",
    "2027-03-19",
    "2027-03-29",

    // April 2027
    "2027-04-19",

    // May 2027
    "2027-05-10"
]);


// ============================================================
// COUNTDOWN TARGETS
//
// IMPORTANT:
// JavaScript months start at ZERO.
//
// January   = 0
// February  = 1
// March     = 2
// April     = 3
// May       = 4
// June      = 5
// July      = 6
// August    = 7
// September = 8
// October   = 9
// November  = 10
// December  = 11
// ============================================================

const targets = [

    // Thanksgiving Break
    // Students finish Tuesday, November 24 at 2:50 PM
    {
        prefix: "tg",
        year: 2026,
        month: 10,
        day: 24,
        hr: 14,
        min: 50
    },

    // Winter Break
    // Students finish Wednesday, December 23 at 2:50 PM
    {
        prefix: "xm",
        year: 2026,
        month: 11,
        day: 23,
        hr: 14,
        min: 50
    },

    // Spring Break
    // Students finish Friday, March 12 at 2:50 PM
    {
        prefix: "sb",
        year: 2027,
        month: 2,
        day: 12,
        hr: 14,
        min: 50
    },

    // End of School
    // Friday, May 28
    // Middle School Early Dismissal = 1:20 PM
    {
        prefix: "ey",
        year: 2027,
        month: 4,
        day: 28,
        hr: 13,
        min: 20
    }
];


// ============================================================
// CARD CONTROLS
// ============================================================

let activeIndex = null;

const cards = document.querySelectorAll(".card");
const grid = document.getElementById("cardGrid");


function toggleCard(index) {

    if (activeIndex === index) {

        grid.classList.remove("single-mode");

        cards[index].classList.remove("active");

        activeIndex = null;

    } else {

        cards.forEach(card => {
            card.classList.remove("active");
        });

        grid.classList.add("single-mode");

        cards[index].classList.add("active");

        activeIndex = index;
    }
}


// ============================================================
// PREVIOUS BUTTON
// ============================================================

document.getElementById("prevBtn").onclick = (e) => {

    e.stopPropagation();

    const newIdx =
        activeIndex === null
            ? cards.length - 1
            : (activeIndex - 1 + cards.length) % cards.length;

    toggleCard(newIdx);
};


// ============================================================
// NEXT BUTTON
// ============================================================

document.getElementById("nextBtn").onclick = (e) => {

    e.stopPropagation();

    const newIdx =
        activeIndex === null
            ? 0
            : (activeIndex + 1) % cards.length;

    toggleCard(newIdx);
};


// ============================================================
// CREATE YYYY-MM-DD DATE STRING
// ============================================================

function formatDateKey(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ============================================================
// DETERMINE WHETHER A DATE IS A SCHOOL DAY
// ============================================================

function isSchoolDay(date) {

    const dayOfWeek = date.getDay();

    // Sunday = 0
    // Saturday = 6

    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
    }

    const dateKey = formatDateKey(date);

    if (noSchoolDates.has(dateKey)) {
        return false;
    }

    return true;
}


// ============================================================
// COUNT REMAINING SCHOOL DAYS
// ============================================================

function countSchoolDays(targetDate) {

    const now = new Date();

    const current = new Date(now);


    // --------------------------------------------------------
    // Keep the behavior from the old countdown:
    //
    // After 6:00 AM, today's school day is considered underway
    // and is no longer included in "school days remaining."
    // --------------------------------------------------------

    if (current.getHours() >= 6) {

        current.setDate(
            current.getDate() + 1
        );
    }


    current.setHours(0, 0, 0, 0);


    let count = 0;


    while (current < targetDate) {

        if (isSchoolDay(current)) {
            count++;
        }

        current.setDate(
            current.getDate() + 1
        );
    }


    return count;
}


// ============================================================
// SAFELY UPDATE AN ELEMENT
// ============================================================

function setCountdownValue(prefix, id, value) {

    const element =
        document.getElementById(
            `${prefix}-${id}`
        );

    if (element) {
        element.innerText = value;
    }
}


// ============================================================
// UPDATE ALL COUNTDOWNS
// ============================================================

function update() {

    const now = new Date();


    targets.forEach(targetInfo => {

        const target = new Date(

            targetInfo.year,

            targetInfo.month,

            targetInfo.day,

            targetInfo.hr,

            targetInfo.min,

            0,

            0
        );


        const distance =
            target.getTime() -
            now.getTime();


        // ----------------------------------------------------
        // TARGET HAS PASSED
        // ----------------------------------------------------

        if (distance <= 0) {

            [
                "days",
                "hours",
                "mins",
                "secs",
                "school-days"
            ].forEach(id => {

                setCountdownValue(
                    targetInfo.prefix,
                    id,
                    "0"
                );
            });

            return;
        }


        // ----------------------------------------------------
        // CALCULATE REGULAR CALENDAR COUNTDOWN
        // ----------------------------------------------------

        const days =
            Math.floor(
                distance / 86400000
            );


        const hours =
            Math.floor(
                (distance % 86400000) /
                3600000
            );


        const mins =
            Math.floor(
                (distance % 3600000) /
                60000
            );


        const secs =
            Math.floor(
                (distance % 60000) /
                1000
            );


        // ----------------------------------------------------
        // DISPLAY CALENDAR DAYS
        // ----------------------------------------------------

        setCountdownValue(
            targetInfo.prefix,
            "days",
            days
        );


        // ----------------------------------------------------
        // DISPLAY HOURS
        // ----------------------------------------------------

        setCountdownValue(
            targetInfo.prefix,
            "hours",
            String(hours).padStart(2, "0")
        );


        // ----------------------------------------------------
        // DISPLAY MINUTES
        // ----------------------------------------------------

        setCountdownValue(
            targetInfo.prefix,
            "mins",
            String(mins).padStart(2, "0")
        );


        // ----------------------------------------------------
        // DISPLAY SECONDS
        // ----------------------------------------------------

        setCountdownValue(
            targetInfo.prefix,
            "secs",
            String(secs).padStart(2, "0")
        );


        // ----------------------------------------------------
        // DISPLAY ACTUAL SCHOOL DAYS
        // ----------------------------------------------------

        setCountdownValue(
            targetInfo.prefix,
            "school-days",
            countSchoolDays(target)
        );
    });
}


// ============================================================
// START COUNTDOWN
// ============================================================

// Run immediately when page loads
update();

// Then update once every second
setInterval(update, 1000);
