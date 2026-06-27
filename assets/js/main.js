const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-navigation');
const navLinks = document.querySelectorAll('.site-nav a');
const siteHeader = document.querySelector('.site-header');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowDeviceMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 2;
const lowCpuCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
const compactViewport = window.innerWidth < 1024;
window.__lowEndDevice = Boolean(lowDeviceMemory || lowCpuCores || compactViewport);

const isLongDocument = () => document.documentElement.scrollHeight > window.innerHeight * 6;

const syncPerformanceMode = () => {
  const performanceLite = Boolean(window.__lowEndDevice || isLongDocument());
  window.__performanceLite = performanceLite;
  document.documentElement.classList.toggle('performance-lite', performanceLite);
  document.body.classList.toggle('performance-lite', performanceLite);
};

const syncHeaderOffset = () => {
  if (!siteHeader) return;
  const offset = Math.round(siteHeader.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--header-offset', `${offset}px`);
};

let headerResizeTimer;
window.addEventListener('resize', () => {
  window.clearTimeout(headerResizeTimer);
  headerResizeTimer = window.setTimeout(() => {
    syncHeaderOffset();
    syncPerformanceMode();
  }, 140);
});
window.addEventListener('load', syncHeaderOffset);
syncHeaderOffset();
syncPerformanceMode();
window.addEventListener('load', syncPerformanceMode);

if (navToggle && siteNav) {
  const closeNav = () => {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const openNav = () => {
    siteNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeNav();
    } else {
      openNav();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (siteNav.classList.contains('is-open')) {
        closeNav();
      }
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
      closeNav();
      navToggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && siteNav.classList.contains('is-open')) {
      closeNav();
    }
  });

  window.addEventListener('click', (event) => {
    if (!siteNav.classList.contains('is-open')) return;
    const target = event.target;
    if (target instanceof Node && !siteNav.contains(target) && !navToggle.contains(target)) {
      closeNav();
    }
  });
}

if (siteHeader) {
  const syncHeaderState = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  if (window.__performanceLite) {
    siteHeader.classList.add('is-scrolled');
  } else {
    syncHeaderState();
    window.addEventListener('scroll', syncHeaderState, { passive: true });
  }
}

const navLinkMap = Array.from(navLinks)
  .map((link) => {
    const hash = link.getAttribute('href');
    if (!hash || !hash.startsWith('#') || hash.length < 2) return null;
    const section = document.querySelector(hash);
    if (!section) return null;
    return { link, section };
  })
  .filter(Boolean);

if (navLinkMap.length && 'IntersectionObserver' in window && !window.__performanceLite) {
  const setActiveLink = (activeLink) => {
    navLinkMap.forEach(({ link }) => {
      const isActive = link === activeLink;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;

      const active = navLinkMap.find(({ section }) => section === visible[0].target);
      if (active) {
        setActiveLink(active.link);
      }
    },
    {
      rootMargin: '-40% 0px -52% 0px',
      threshold: [0.15, 0.35, 0.55]
    }
  );

  navLinkMap.forEach(({ section }) => observer.observe(section));
}

const getToggleTarget = (button) => {
  const targetId = button.getAttribute('aria-controls');
  if (targetId) {
    return document.getElementById(targetId);
  }

  const localScope = button.closest('.footer-item, .project-card');
  return localScope ? localScope.querySelector('.evidence-text') : null;
};

const syncToggleState = (button, expanded) => {
  button.setAttribute('aria-expanded', String(expanded));
  const collapsedLabel = button.getAttribute('data-collapsed-label') || 'Show details';
  const expandedLabel = button.getAttribute('data-expanded-label') || 'Hide details';
  button.textContent = expanded ? expandedLabel : collapsedLabel;

  const target = getToggleTarget(button);
  if (target) {
    target.hidden = !expanded;
  }
};

document.querySelectorAll('.toggle-details').forEach((button) => {
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  syncToggleState(button, isExpanded);

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    syncToggleState(button, !expanded);
  });
});

const livePillText = document.querySelector('.live-pill-text');
const scoreRing = document.querySelector('.score-ring');
const scoreValue = scoreRing?.querySelector('.score-value');
const liveScoreCopy = document.querySelector('[data-live-score-copy]');
const liveConfidence = document.querySelector('[data-live-confidence]');
const liveStatus = document.querySelector('[data-live-status]');
const liveCalibration = document.querySelector('[data-live-calibration]');
const livePreference = document.querySelector('[data-live-preference]');
const liveComparisonConfidence = document.querySelector('[data-live-comparison-confidence]');
const liveRationale = document.querySelector('[data-live-rationale]');

const activatePressableGroup = (items, activeItem) => {
  items.forEach((item) => {
    const isActive = item === activeItem;
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-pressed', String(isActive));
  });
};

const bindPressable = (items, handler) => {
  items.forEach((item) => {
    item.addEventListener('click', () => handler(item));
    item.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      handler(item);
    });
  });
};

const dimensionRowsInteractive = document.querySelectorAll('.dimension-row[role="button"]');

if (dimensionRowsInteractive.length && scoreRing && scoreValue && liveScoreCopy && liveConfidence && liveStatus && liveCalibration) {
  const updateLiveDimension = (row) => {
    const score = Number.parseFloat(row.getAttribute('data-live-score') || '0');
    const scoreCopy = row.getAttribute('data-live-score-copy') || `${score}% review score`;
    const confidence = row.getAttribute('data-live-confidence') || 'High';
    const status = row.getAttribute('data-live-status') || 'Calibrated';
    const calibration = row.getAttribute('data-live-calibration') || '97%+';
    const pill = row.getAttribute('data-live-pill');

    scoreRing.style.setProperty('--progress', String(score));
    scoreValue.textContent = `${score.toFixed(score % 1 ? 1 : 0)}%`;
    liveScoreCopy.textContent = scoreCopy;
    liveConfidence.textContent = confidence;
    liveStatus.textContent = status;
    liveCalibration.textContent = calibration;
    if (livePillText && pill) livePillText.textContent = pill;

    activatePressableGroup(dimensionRowsInteractive, row);
  };

  bindPressable(dimensionRowsInteractive, updateLiveDimension);
}

const comparisonCardsInteractive = document.querySelectorAll('.comparison-card[role="button"]');

if (comparisonCardsInteractive.length && livePreference && liveComparisonConfidence && liveRationale) {
  const updateComparisonSelection = (card) => {
    const preference = card.getAttribute('data-final-preference') || 'No preference selected.';
    const confidence = card.getAttribute('data-confidence') || 'High';
    const rationale = card.getAttribute('data-rationale') || 'No rationale available.';
    const pill = card.getAttribute('data-live-pill');

    livePreference.textContent = preference;
    liveComparisonConfidence.textContent = confidence;
    liveRationale.textContent = rationale;
    if (livePillText && pill) livePillText.textContent = pill;

    const rationaleToggle = document.querySelector('.comparison-footer .toggle-details');
    if (rationaleToggle) {
      syncToggleState(rationaleToggle, true);
    }

    activatePressableGroup(comparisonCardsInteractive, card);
  };

  bindPressable(comparisonCardsInteractive, updateComparisonSelection);
}

const decisionRows = document.querySelectorAll('.decision-row');
const decisionSummary = document.querySelector('.decision-summary');

if (decisionRows.length && decisionSummary) {
  const updateDecisionSummary = (row) => {
    const dimension = row.getAttribute('data-dimension') || 'Instruction Following';
    const weight = row.getAttribute('data-weight') || '25%';
    const responseA = row.getAttribute('data-response-a') || 'N/A';
    const responseB = row.getAttribute('data-response-b') || 'N/A';
    const winner = row.getAttribute('data-winner') || 'Response A';
    const confidence = row.getAttribute('data-confidence') || 'High';
    const explanation = row.getAttribute('data-explanation') || 'No summary available.';

    decisionSummary.querySelector('.decision-summary-title').textContent = dimension;
    decisionSummary.querySelector('[data-summary-weight]').textContent = weight;
    decisionSummary.querySelector('[data-summary-a]').textContent = responseA;
    decisionSummary.querySelector('[data-summary-b]').textContent = responseB;
    decisionSummary.querySelector('[data-summary-winner]').textContent = winner;
    decisionSummary.querySelector('[data-summary-confidence]').textContent = confidence;
    decisionSummary.querySelector('[data-summary-explanation]').textContent = explanation;
  };

  decisionRows.forEach((row) => {
    row.addEventListener('click', () => {
      decisionRows.forEach((button) => {
        button.classList.remove('is-active');
        button.setAttribute('aria-pressed', 'false');
      });

      row.classList.add('is-active');
      row.setAttribute('aria-pressed', 'true');
      updateDecisionSummary(row);
    });
  });

  updateDecisionSummary(decisionRows[0]);
}

const methodologyCriteria = document.querySelectorAll('.framework-criterion');
const methodologyDetail = document.querySelector('.framework-detail');

if (methodologyCriteria.length && methodologyDetail) {
  const updateMethodologyDetail = (criterion) => {
    const description = criterion.getAttribute('data-description') || 'No details available.';
    const weight = criterion.getAttribute('data-weight') || 'Medium';
    const title = criterion.getAttribute('data-criterion') || 'Criterion';

    methodologyDetail.querySelector('.framework-title').textContent = title;
    methodologyDetail.querySelector('.framework-description').textContent = description;
    methodologyDetail.querySelector('[data-framework-weight]').textContent = weight;
  };

  methodologyCriteria.forEach((criterion) => {
    criterion.addEventListener('click', () => {
      methodologyCriteria.forEach((button) => {
        button.classList.remove('is-active');
        button.setAttribute('aria-pressed', 'false');
      });

      criterion.classList.add('is-active');
      criterion.setAttribute('aria-pressed', 'true');
      updateMethodologyDetail(criterion);
    });
  });

  updateMethodologyDetail(methodologyCriteria[0]);
}

window.initLenis = function initLenis() {
  syncPerformanceMode();
  if (!window.Lenis || prefersReducedMotion || window.__lenisInitialized || window.__performanceLite) return;

  const lenis = new Lenis({
    duration: 0.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    wheelMultiplier: 0.95,
    infinite: false
  });

  window.__lenisInitialized = true;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
};

window.initLenis();

if (!prefersReducedMotion && !window.__performanceLite && canHover && window.gsap) {
  document.querySelectorAll('.button, .form-submit-btn, .back-to-top').forEach((el) => {
    let moveFrame = null;

    const onMove = (event) => {
      if (moveFrame) return;

      moveFrame = requestAnimationFrame(() => {
        moveFrame = null;
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
        gsap.to(el, {
          x: x * 7,
          y: y * 7,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    };

    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });

  document.querySelectorAll('.stat-card, .strength-card, .metric-card, .project-card, .tool-card, .certificate-card, .focus-card, .roadmap-card, .collab-card').forEach((card) => {
    const onMove = (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 4;
      const rotateX = (0.5 - py) * 3;

      gsap.to(card, {
        rotateX,
        rotateY,
        y: -2,
        transformPerspective: 900,
        transformOrigin: 'center center',
        duration: 0.24,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const onLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.32,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
}

document.querySelectorAll('.button, .form-submit-btn, .back-to-top, .social-link').forEach((el) => {
  el.addEventListener('pointerdown', () => {
    el.classList.add('is-pressed');
  });

  const clearPressed = () => el.classList.remove('is-pressed');
  el.addEventListener('pointerup', clearPressed);
  el.addEventListener('pointercancel', clearPressed);
  el.addEventListener('mouseleave', clearPressed);
});

// ─── Footer year ────────────────────────────────────────────
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─── Back to top ────────────────────────────────────────────
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

// ─── Contact form ────────────────────────────────────────────
const contactForm = document.getElementById('contact-form-el');

if (contactForm) {
  const fields = {
    name:    { el: document.getElementById('cf-name'),    err: document.getElementById('cf-name-err'),    msg: 'Please enter your full name.' },
    email:   { el: document.getElementById('cf-email'),   err: document.getElementById('cf-email-err'),   msg: 'Please enter a valid email address.' },
    project: { el: document.getElementById('cf-project'), err: document.getElementById('cf-project-err'), msg: 'Please select a project type.' },
    message: { el: document.getElementById('cf-message'), err: document.getElementById('cf-message-err'), msg: 'Please include a brief message.' }
  };

  const statusMsg   = document.getElementById('form-status-msg');
  const submitBtn   = contactForm.querySelector('.form-submit-btn');

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const clearError = (field) => {
    field.el.removeAttribute('aria-invalid');
    field.err.textContent = '';
  };

  const setError = (field) => {
    field.el.setAttribute('aria-invalid', 'true');
    field.err.textContent = field.msg;
  };

  const validateField = (key) => {
    const f = fields[key];
    const v = f.el.value.trim();
    if (!v || (key === 'email' && !validateEmail(v))) {
      setError(f);
      return false;
    }
    clearError(f);
    return true;
  };

  // Real-time validation on blur
  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.getAttribute('aria-invalid') === 'true') validateField(key);
    });
  });

  const setFormState = (state) => {
    contactForm.setAttribute('data-state', state);
    submitBtn.disabled = (state === 'loading');
  };

  const showStatus = (text, type) => {
    statusMsg.textContent = text;
    statusMsg.className = `form-status ${type === 'success' ? 'is-success' : 'is-error'}`;
  };

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const valid = Object.keys(fields).every((key) => validateField(key));
    if (!valid) {
      const firstInvalid = Object.values(fields).find((f) => f.el.getAttribute('aria-invalid') === 'true');
      firstInvalid?.el.focus();
      return;
    }

    setFormState('loading');
    statusMsg.textContent = '';
    statusMsg.className = 'form-status';

    const companyValue = document.getElementById('cf-company')?.value.trim() || 'Not provided';
    const roleValue = document.getElementById('cf-role')?.value.trim() || 'Not provided';
    const projectSelect = document.getElementById('cf-project');
    const projectLabel = projectSelect?.selectedOptions?.[0]?.textContent?.trim() || fields.project.el.value.trim();
    const subject = `Portfolio inquiry: ${projectLabel}`;
    const body = [
      `Name: ${fields.name.el.value.trim()}`,
      `Email: ${fields.email.el.value.trim()}`,
      `Company or organisation: ${companyValue}`,
      `Role: ${roleValue}`,
      `Project type: ${projectLabel}`,
      '',
      'Message:',
      fields.message.el.value.trim()
    ].join('\n');

    window.location.href = `mailto:busquadc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setFormState('success');
    showStatus('Your email draft is ready. If your mail app did not open, email busquadc@gmail.com directly.', 'success');

    if (window.gsap) {
      gsap.fromTo(statusMsg, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
  });
}
