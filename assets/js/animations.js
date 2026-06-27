const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const performanceLite = Boolean(window.__performanceLite);
const lowEndDevice = Boolean(window.__lowEndDevice || performanceLite);
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const richScrollEffects = !performanceLite && canHover && window.innerWidth >= 1200;

const formatCounterValue = (value, decimals, suffix) => {
  const rounded = decimals > 0 ? Number(value).toFixed(decimals) : String(Math.round(value));
  const [whole, fraction] = rounded.split('.');
  const formattedWhole = Number(whole).toLocaleString('en-US');
  return `${fraction ? `${formattedWhole}.${fraction}` : formattedWhole}${suffix}`;
};

const syncCounterValues = () => {
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-counter')) || 0;
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    el.textContent = formatCounterValue(target, decimals, suffix);
  });
};

const revealTargets = [
  '.about-item', '.stat-card', '.strength-card', '.domain-card', '.workflow-step', '.principle-card',
  '.expertise-intro', '.dashboard-intro', '.dashboard-card', '.metrics-intro', '.metric-card',
  '.metrics-panel', '.metrics-callout', '.projects-intro', '.featured-project', '.project-card',
  '.project-highlight-card', '.projects-callout', '.case-studies-intro', '.featured-case-study',
  '.walkthrough-step', '.decision-row', '.decision-summary', '.evidence-card', '.lesson-card',
  '.mini-case-card', '.case-study-stat', '.methodology-intro', '.methodology-philosophy',
  '.methodology-lifecycle', '.framework-section', '.calibration-section', '.justification-section',
  '.qa-section', '.philosophy-card', '.lifecycle-step', '.framework-criterion', '.framework-detail',
  '.calibration-step', '.justification-block', '.qa-step', '.timeline-intro', '.timeline-story',
  '.timeline-card', '.growth-section', '.future-section', '.growth-panel', '.certifications-intro',
  '.tools-section', '.certificates-section', '.learning-section', '.focus-section', '.roadmap-section',
  '.tool-card', '.certificate-card', '.pathway-step', '.focus-card', '.roadmap-card', '.cta-inner',
  '.collab-intro', '.collab-card', '.contact-form-wrap', '.availability-card', '.social-panel',
  '.site-footer'
];

if (!prefersReducedMotion && !performanceLite && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const revealBatch = (selector, options = {}) => {
    const {
      start = 'top 90%',
      duration = 0.82,
      stagger = 0.07,
      y = 24,
      ease = 'power3.out',
      leaveBack = false,
      once = true
    } = options;

    ScrollTrigger.batch(selector, {
      start,
      once,
      onEnter: (batch) => {
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration,
          stagger,
          ease,
          overwrite: 'auto'
        });
      },
      onLeaveBack: leaveBack
        ? (batch) => {
            gsap.set(batch, { y, opacity: 0 });
          }
        : undefined
    });
  };

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    onEnter: () => {
      document.body.classList.add('scroll-ready');
    }
  });

  if (richScrollEffects) {
    gsap.to('.hero-background', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.45
      }
    });
  }

  revealBatch('.stat-card, .strength-card, .about-item, .domain-panel, .expertise-panel, .domain-card, .workflow-step, .principle-card', {
    start: 'top 86%',
    duration: 0.8,
    stagger: 0.08,
    y: 26,
    once: true,
    leaveBack: false
  });

  revealBatch('.expertise-intro', { start: 'top 95%', duration: 0.9, stagger: 0, once: true, leaveBack: false });
  revealBatch('.dashboard-intro, .dashboard-card', { start: 'top 90%', duration: 0.84, stagger: 0.08, y: 26, once: true, leaveBack: false });
  revealBatch('.metrics-intro, .metric-card, .metrics-panel, .metrics-callout', { duration: 0.84, stagger: 0.07, once: true, leaveBack: false });
  revealBatch('.projects-intro, .featured-project, .project-card, .project-highlight-card, .projects-callout', { duration: 0.84, stagger: 0.07, once: true, leaveBack: false });
  revealBatch('.case-studies-intro, .featured-case-study, .walkthrough-section, .decision-section, .evidence-section, .lessons-section, .additional-case-studies', { duration: 0.84, stagger: 0.08, once: true, leaveBack: false });
  revealBatch('.case-study-stat, .walkthrough-step, .decision-row, .decision-summary, .evidence-card, .lesson-card, .mini-case-card', { duration: 0.78, stagger: 0.06, y: 20, once: true, leaveBack: false });
  revealBatch('.methodology-intro, .methodology-philosophy, .methodology-lifecycle, .framework-section, .calibration-section, .justification-section, .qa-section, .philosophy-card, .lifecycle-step, .framework-criterion, .framework-detail, .calibration-step, .justification-block, .qa-step', { duration: 0.8, stagger: 0.06, y: 20, once: true, leaveBack: false });
  revealBatch('.timeline-intro, .timeline-story, .timeline-card, .growth-section, .future-section, .growth-panel', { duration: 0.8, stagger: 0.06, y: 20, once: true, leaveBack: false });
  revealBatch('.certifications-intro, .tools-section, .certificates-section, .learning-section, .focus-section, .roadmap-section, .tool-card, .certificate-card, .pathway-step, .focus-card, .roadmap-card', { duration: 0.8, stagger: 0.06, y: 20, once: true, leaveBack: false });
  revealBatch('.cta-inner', { start: 'top 88%', duration: 0.95, stagger: 0, once: true, leaveBack: false });
  revealBatch('.collab-intro, .contact-form-wrap, .availability-card, .social-panel, .site-footer', { start: 'top 88%', duration: 0.84, stagger: 0.07, y: 26, once: true, leaveBack: false });
  revealBatch('.collab-card', { start: 'top 88%', duration: 0.74, stagger: 0.06, y: 20, once: true, leaveBack: false });

  const learningProgressFill = document.querySelector('.learning-progress-fill');
  if (learningProgressFill) {
    gsap.fromTo(
      learningProgressFill,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.learning-section', start: 'top 80%' }
      }
    );
  }

  document.querySelectorAll('.timeline-dot').forEach((dot) => {
    gsap.fromTo(
      dot,
      { scale: 0.72, opacity: 0.72 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.85,
        ease: 'power2.out',
        scrollTrigger: { trigger: dot, start: 'top 90%', once: true }
      }
    );
  });

  const animateBars = (selector, valueAttribute) => {
    document.querySelectorAll(selector).forEach((bar) => {
      const value = bar.getAttribute(valueAttribute) || '0%';
      gsap.fromTo(
        bar,
        { width: '0%' },
        {
          width: value,
          duration: 1.05,
          ease: 'power2.out',
          scrollTrigger: { trigger: bar, start: 'top 90%', once: true }
        }
      );
    });
  };

  animateBars('.roadmap-progress span', 'data-trajectory');
  animateBars('.meter span', 'data-meter');
  animateBars('.quality-bar span', 'data-progress');

  document.querySelectorAll('.tool-card').forEach((card) => {
    if (!canHover) return;
    const icon = card.querySelector('.tool-icon svg');
    if (!icon) return;

    const animateIn = () => {
      gsap.to(icon, { rotate: -9, y: -4, scale: 1.08, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
    };

    const animateOut = () => {
      gsap.to(icon, { rotate: 0, y: 0, scale: 1, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
    };

    card.addEventListener('mouseenter', animateIn);
    card.addEventListener('mouseleave', animateOut);
    card.addEventListener('focus', animateIn, true);
    card.addEventListener('blur', animateOut, true);
  });

  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-counter')) || 0;
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const counter = { value: 0 };

    gsap.fromTo(
      counter,
      { value: 0 },
      {
        value: target,
        duration: 1.35,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate() {
          const value = this.targets()[0].value;
          el.textContent = formatCounterValue(value, decimals, suffix);
        }
      }
    );
  });
} else if (window.gsap) {
  gsap.set(revealTargets, { opacity: 1, y: 0, clearProps: 'transform' });
  syncCounterValues();

  document.querySelectorAll('.roadmap-progress span').forEach((bar) => {
    const trajectory = bar.getAttribute('data-trajectory') || '65';
    bar.style.width = `${trajectory}%`;
  });

  const learningProgressFill = document.querySelector('.learning-progress-fill');
  if (learningProgressFill) {
    learningProgressFill.style.transform = 'scaleY(1)';
  }
} else {
  syncCounterValues();
}
