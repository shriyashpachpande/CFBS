document.addEventListener('DOMContentLoaded', async () => {
    // Fix the sport for the current page
    const currentSport = "Cricket";
    const sportSelect = document.getElementById("sportSelect");
    Array.from(sportSelect.options).forEach(option => {
        option.selected = option.value === currentSport;
        option.disabled = option.value !== currentSport;
    });

    // Auto-fill student ID from session
    try {
        const res = await fetch('/auth/me');
        if (res.ok) {
            const data = await res.json();
            const studentIdField = document.querySelector('input[name="studentId"]');
            if (studentIdField) {
                studentIdField.value = data.studentId;
                studentIdField.readOnly = true;
            }
        } else {
            console.warn('User not logged in');
        }
    } catch (err) {
        console.error('Failed to fetch user info:', err);
    }

    // Initialize pickers after DOM is loaded
    startTimePicker = flatpickr("#startTime", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        defaultHour: new Date().getHours() + 1
    });

    endTimePicker = flatpickr("#endTime", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        defaultHour: new Date().getHours() + 2
    });

    flatpickr("#dateInput", {
        minDate: "today",
        maxDate: new Date().fp_incr(30),
        defaultDate: "today",
        dateFormat: "Y-m-d",
        onChange: function (selectedDates, dateStr) {
            const today = new Date();
            const selected = new Date(dateStr);
            const todayStr = today.toISOString().slice(0, 10);

            if (dateStr === todayStr) {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMin = now.getMinutes() + 1;
                const minTime = `${String(currentHour).padStart(2, '0')}:${String(currentMin % 60).padStart(2, '0')}`;

                startTimePicker.set("minTime", minTime);
                endTimePicker.set("minTime", minTime);
            } else {
                startTimePicker.set("minTime", "00:00");
                endTimePicker.set("minTime", "00:00");
            }
        }
    });

    // Form submit
    document.getElementById('bookingForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        const msgDiv = document.getElementById('message');
        msgDiv.textContent = result.message;
        msgDiv.style.color = response.ok ? 'green' : 'red';
    });

    // Cursor Animation (no change)
    const dot = document.createElement('div');
    const outline = document.createElement('div');

    dot.classList.add('cursor-dot');
    outline.classList.add('cursor-outline');
    document.body.appendChild(dot);
    document.body.appendChild(outline);

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    function animate() {
        outlineX += (mouseX - outlineX) * 0.1;
        outlineY += (mouseY - outlineY) * 0.1;

        outline.style.left = `${outlineX}px`;
        outline.style.top = `${outlineY}px`;

        requestAnimationFrame(animate);
    }

    animate();
});

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const quoteLink = document.getElementById('quoteLink');
    navLinks.classList.toggle('active');
    quoteLink.classList.toggle('active');
}
