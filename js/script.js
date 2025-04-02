document.addEventListener('DOMContentLoaded', () => {
  // ======================
  // إعداد سلايد الكتاب
  // ======================
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slideshow img');
  const dotsContainer = document.getElementById('slideshow-dots');

  // إنشاء نقاط التنقل
  if (slides.length > 0 && dotsContainer) {
    if (slides.length > 1) {
      slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => showSlide(index));
        dotsContainer.appendChild(dot);
      });
    }
  }

  function showSlide(index) {
    currentSlide = index;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    updateDots();
  }

  function updateDots() {
    const dots = document.querySelectorAll('.slideshow-dots .dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;

  if (slides.length > 1) {
    setInterval(nextSlide, 5000);
  }

  showSlide(currentSlide);

  // ======================
  // إعداد عداد التنازلي
  // ======================
  const countdownElement = document.getElementById('countdown');
  if (countdownElement) {
    let timeLeft = 2 * 60 * 60; // ساعتين بالثواني

    function updateCountdown() {
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;

      countdownElement.textContent = `⏳ العرض ينتهي خلال: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      timeLeft--;

      if (timeLeft < 0) {
        clearInterval(countdownInterval);
        countdownElement.textContent = "⏳ العرض انتهى!";
        
        document.querySelectorAll('.cta-button').forEach(btn => {
          btn.style.display = 'none';
        });
      }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  // ======================
  // دعم اللمس للجوال
  // ======================
  let touchStartX = 0;
  let touchEndX = 0;
  const slideshowContainer = document.querySelector('.slideshow');

  if (slideshowContainer) {
    slideshowContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slideshowContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    }, { passive: true });
  }

  function handleGesture() {
    if (touchEndX < touchStartX - 50) nextSlide();
    else if (touchEndX > touchStartX + 50) prevSlide();
  }

  // ======================
  // تحسينات تجربة المستخدم
  // ======================
  document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
  });

  // تحميل الصور الكسولة
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // تتبع الأحداث محلياً
  function trackEvent(eventName, data = {}) {
    console.log('Event:', eventName, data);
    const events = JSON.parse(localStorage.getItem('events') || []);
    events.push({ timestamp: new Date().toISOString(), eventName, data });
    localStorage.setItem('events', JSON.stringify(events));
  }

  document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('click', () => {
      trackEvent('button_click', {
        button_text: btn.innerText.trim(),
        page_location: window.location.pathname
      });
    });
  });
});