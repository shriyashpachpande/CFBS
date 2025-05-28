function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const quoteLink = document.getElementById('quoteLink');
    navLinks.classList.toggle('active');
    quoteLink.classList.toggle('active');
}

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
    // Smooth movement for outline
    outlineX += (mouseX - outlineX) * 0.1;
    outlineY += (mouseY - outlineY) * 0.1;

    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;

    requestAnimationFrame(animate);
}

animate();


const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, {
      threshold: 0.2
    });

    sections.forEach(section => {
      observer.observe(section);
    });



        // Tilt effect for all images with class 'tilt-img'
        document.querySelectorAll('.image-box').forEach((imageBox) => {
            const image = imageBox.querySelector('.tilt-img');

            imageBox.addEventListener('mousemove', (e) => {
                const box = imageBox.getBoundingClientRect();
                const centerX = box.left + box.width / 2;
                const centerY = box.top + box.height / 2;

                const offsetX = e.clientX - centerX;
                const offsetY = e.clientY - centerY;

                const rotateX = -(offsetY / box.height) * 15; // Approx. 0.5cm effect
                const rotateY = (offsetX / box.width) * 15;

                image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            imageBox.addEventListener('mouseleave', () => {
                image.style.transform = 'rotateX(0deg) rotateY(0deg)';
            });
        });