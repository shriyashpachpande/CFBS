document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('footer');
    const footerLogo = document.querySelector('.Flogo');
    const footerColumns = document.querySelectorAll('.footer-column');
  
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          footerLogo.classList.add('visible');
          footerColumns.forEach((col, index) => {
            setTimeout(() => {
              col.classList.add('visible');
            }, (index + 1) * 300);
          });
        }
      });
    }, observerOptions);
  
    observer.observe(footer);
  
    // In case footer is already visible on load
    if (footer.getBoundingClientRect().top < window.innerHeight) {
      footerLogo.classList.add('visible');
      footerColumns.forEach((col, index) => {
        setTimeout(() => {
          col.classList.add('visible');
        }, (index + 1) * 300);
      });
    }
  });
  