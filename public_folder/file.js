
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


        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            document.getElementById('liveTime').textContent = timeString;
        }

        setInterval(updateTime, 1000);
        updateTime();
        
        
        const cards = document.querySelectorAll('.card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150); // ⏱️ stagger delay (150ms between each)
      }
    });
  }, {
    threshold: 0.1
  });

  cards.forEach(card => {
    observer.observe(card);
  });


  const testimonials = document.querySelectorAll('.testimonial');
  let current = 0;

  function showSlide(index) {
    testimonials.forEach((t, i) => {
      t.classList.remove('active');
      if (i === index) {
        t.classList.add('active');
      }
    });
    document.getElementById('counter').textContent = `${index + 1} – ${testimonials.length}`;
  }

  function nextSlide() {
    current = (current + 1) % testimonials.length;
    showSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + testimonials.length) % testimonials.length;
    showSlide(current);
  }

  setInterval(nextSlide, 3000);
  showSlide(current);




  document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };

    const footerLogo = document.querySelector('.Flogo');
    const footerColumns = document.querySelectorAll('.footer-column');

    let observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate logo
          footerLogo.classList.remove('visible');
          setTimeout(() => footerLogo.classList.add('visible'), 100);

          // Animate each column with delay
          footerColumns.forEach((col, index) => {
            col.classList.remove('visible');
            setTimeout(() => {
              col.classList.add('visible');
            }, (index + 1) * 300);
          });
        }
      });
    }, observerOptions);

    // Observe footer itself
    observer.observe(document.querySelector('footer'));
  });



  document.addEventListener("DOMContentLoaded", () => {
    const videoInner = document.querySelector(".video-inner");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoInner.classList.remove("flip");
            void videoInner.offsetWidth; // force reflow
            videoInner.classList.add("flip");
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(document.getElementById("flipVideo"));
  });




  const section = document.getElementById('contactSection');
  const observer1 = new IntersectionObserver(
      entries => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  section.style.animation = 'none';
                  // Reflow trick
                  void section.offsetWidth;
                  section.style.animation = 'epicEntrance 1.5s ease-in-out forwards';
              }
          });
      },
      { threshold: 0.5 }
  );

  observer1.observe(section);



  const section1 = document.getElementById('contactForm');
  const observer2 = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.style.animation = 'none';
          void section.offsetWidth; // Trigger reflow
          section.style.animation = null;
        }
      });
    },
    { threshold: 0.5 }
  );

  observer2.observe(section1);

  const sections = document.querySelectorAll('.section');

  const observer3 = new IntersectionObserver((entries) => {
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
    observer3.observe(section);
  });