const holidays = [
    "2026-01-16", "2026-01-19", "2026-02-13", "2026-02-23",
    "2026-03-16", "2026-03-17", "2026-03-18", "2026-03-19", "2026-03-20", 
    "2026-03-30", "2026-04-17", "2026-05-01", "2026-05-11", "2026-05-25"
];

const targets = [
    { prefix: "tg", year: 2025, month: 10, day: 25, hr: 14, min: 50 },
    { prefix: "xm", year: 2025, month: 11, day: 25, hr: 14, min: 50 },
    { prefix: "sb", year: 2026, month: 2,  day: 13, hr: 14, min: 50 },
    { prefix: "ey", year: 2026, month: 5,  day: 3,  hr: 12, min: 50 }
];

let activeIndex = null;
const cards = document.querySelectorAll('.card');
const grid = document.getElementById('cardGrid');

function toggleCard(index) {
    if (activeIndex === index) {
        grid.classList.remove('single-mode');
        cards[index].classList.remove('active');
        activeIndex = null;
    } else {
        cards.forEach(c => c.classList.remove('active'));
        grid.classList.add('single-mode');
        cards[index].classList.add('active');
        activeIndex = index;
    }
}

// ARROW NAVIGATION
document.getElementById('prevBtn').onclick = (e) => {
    e.stopPropagation(); // Prevents clicking the card background
    let newIdx = (activeIndex - 1 + cards.length) % cards.length;
    toggleCard(newIdx);
};

document.getElementById('nextBtn').onclick = (e) => {
    e.stopPropagation();
    let newIdx = (activeIndex + 1) % cards.length;
    toggleCard(newIdx);
};

// Keyboard Support
window.addEventListener('keydown', (e) => {
    if (activeIndex !== null) {
        if (e.key === "ArrowLeft") document.getElementById('prevBtn').click();
        if (e.key === "ArrowRight") document.getElementById('nextBtn').click();
        if (e.key === "Escape") toggleCard(activeIndex);
    }
});

function countSchoolDays(targetDate) {
    let today = new Date();
    if (today.getHours() >= 6) today.setDate(today.getDate() + 1);
    today.setHours(0, 0, 0, 0); 
    let count = 0;
    let current = new Date(today);
    while (current < targetDate) {
        const ds = `${current.getFullYear()}-${String(current.getMonth()+1).padStart(2,'0')}-${String(current.getDate()).padStart(2,'0')}`;
        if (current.getDay() !== 0 && current.getDay() !== 6 && !holidays.includes(ds)) count++;
        current.setDate(current.getDate() + 1);
    }
    return count;
}

function update() {
    const now = new Date();
    targets.forEach(t => {
        const target = new Date(t.year, t.month, t.day, t.hr, t.min);
        const offset = (now.getTimezoneOffset() - target.getTimezoneOffset()) * 60000;
        let dist = target.getTime() - now.getTime() + offset;

        if (dist < 0) {
            ["days", "hours", "mins", "secs", "school-days"].forEach(id => {
                document.getElementById(`${t.prefix}-${id}`).innerText = "0";
            });
            return;
        }

        document.getElementById(`${t.prefix}-days`).innerText = Math.floor(dist / 86400000);
        document.getElementById(`${t.prefix}-hours`).innerText = Math.floor((dist % 86400000) / 3600000).toString().padStart(2, '0');
        document.getElementById(`${t.prefix}-mins`).innerText = Math.floor((dist % 3600000) / 60000).toString().padStart(2, '0');
        document.getElementById(`${t.prefix}-secs`).innerText = Math.floor((dist % 60000) / 1000).toString().padStart(2, '0');
        document.getElementById(`${t.prefix}-school-days`).innerText = countSchoolDays(target);
    });
}

setInterval(update, 1000);
update();
