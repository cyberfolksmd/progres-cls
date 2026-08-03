import { useEffect } from 'react';

export function useFadeIn() {
  useEffect(() => {
    let observer;

    const observeElements = () => {
      if (observer) observer.disconnect();

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );

      const selectors = '.fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .zoom-in, .spatial-reveal';
      const elements = document.querySelectorAll(selectors);
      elements.forEach((el) => {
        if (!el.classList.contains('visible')) {
          observer.observe(el);
        }
      });
    };

    observeElements();
    const timer1 = setTimeout(observeElements, 200);
    const timer2 = setTimeout(observeElements, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (observer) observer.disconnect();
    };
  }, []);
}
