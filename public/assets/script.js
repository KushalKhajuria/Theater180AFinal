(() => {
  const path = window.location.pathname;
  document.querySelectorAll('[data-nav]').forEach((el) => {
    if (el.getAttribute('href') === path) {
      el.classList.add('active');
    }
  });

  const yearEls = document.querySelectorAll('[data-year]');
  const year = String(new Date().getFullYear());
  yearEls.forEach((el) => {
    el.textContent = year;
  });

  document.querySelectorAll('[data-qa]').forEach((panel) => {
    const answers = Array.from(panel.querySelectorAll('[data-answer]'));
    const prevBtn = panel.querySelector('[data-prev]');
    const nextBtn = panel.querySelector('[data-next]');
    const meta = panel.querySelector('[data-meta]');
    if (!answers.length || !prevBtn || !nextBtn || !meta) return;

    let idx = 0;

    const render = () => {
      answers.forEach((a, i) => {
        a.style.display = i === idx ? 'block' : 'none';
      });
      meta.textContent = `${idx + 1} / ${answers.length}`;
    };

    prevBtn.addEventListener('click', () => {
      idx = (idx - 1 + answers.length) % answers.length;
      render();
    });

    nextBtn.addEventListener('click', () => {
      idx = (idx + 1) % answers.length;
      render();
    });

    render();
  });

  document.querySelectorAll('[data-h-carousel]').forEach((carousel) => {
    const items = Array.from(carousel.querySelectorAll('[data-h-item]'));
    const prevBtn = carousel.querySelector('[data-h-prev]');
    const nextBtn = carousel.querySelector('[data-h-next]');
    const meta = carousel.parentElement?.querySelector('[data-h-meta]');
    if (!items.length || !prevBtn || !nextBtn || !meta) return;

    let idx = 0;
    const render = () => {
      items.forEach((item, i) => {
        item.style.display = i === idx ? 'block' : 'none';
      });
      meta.textContent = `${idx + 1} / ${items.length}`;
    };

    prevBtn.addEventListener('click', () => {
      idx = (idx - 1 + items.length) % items.length;
      render();
    });

    nextBtn.addEventListener('click', () => {
      idx = (idx + 1) % items.length;
      render();
    });

    render();
  });

  document.querySelectorAll('[data-table-carousel]').forEach((carousel) => {
    const rows = Array.from(carousel.querySelectorAll('[data-row-item]'));
    const prevBtn = carousel.querySelector('[data-row-prev]');
    const nextBtn = carousel.querySelector('[data-row-next]');
    const meta = carousel.querySelector('[data-row-meta]');
    if (!rows.length || !prevBtn || !nextBtn || !meta) return;

    let idx = 0;
    const render = () => {
      rows.forEach((row, i) => {
        row.style.display = i === idx ? 'table-row' : 'none';
      });
      meta.textContent = `${idx + 1} / ${rows.length}`;
    };

    prevBtn.addEventListener('click', () => {
      idx = (idx - 1 + rows.length) % rows.length;
      render();
    });

    nextBtn.addEventListener('click', () => {
      idx = (idx + 1) % rows.length;
      render();
    });

    render();
  });

  const initForcedSnap = (bodyClass, panelSelector) => {
    if (!document.body.classList.contains(bodyClass)) return;
    const panels = Array.from(document.querySelectorAll(panelSelector));
    if (!panels.length) return;

      let locked = false;
      let current = 0;
      let touchStartY = null;
      let unlockAt = 0;

      const nearestIndex = () => {
        let bestIdx = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        panels.forEach((panel, idx) => {
          const dist = Math.abs(panel.getBoundingClientRect().top - 84);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = idx;
          }
        });
        return bestIdx;
      };

      const jumpTo = (idx) => {
        if (idx < 0 || idx >= panels.length) return;
        locked = true;
        current = idx;
        unlockAt = Date.now() + 900;
        panels[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => {
          if (Date.now() >= unlockAt) {
            locked = false;
          }
        }, 920);
      };

      const canScrollRegion = (region, delta) => {
        if (!region) return false;
        const top = region.scrollTop;
        const max = region.scrollHeight - region.clientHeight;
        if (delta > 0) return top < max - 1;
        if (delta < 0) return top > 1;
        return false;
      };

      window.addEventListener(
        'wheel',
        (e) => {
          if (Math.abs(e.deltaY) < 4) return;
          const region = e.target instanceof Element ? e.target.closest('[data-scroll-region]') : null;
          if (region && canScrollRegion(region, e.deltaY)) return;
          if (Date.now() < unlockAt) return;
          if (locked) return;
          current = nearestIndex();
          const target = current + (e.deltaY > 0 ? 1 : -1);
          if (target < 0 || target >= panels.length) return;
          e.preventDefault();
          jumpTo(target);
        },
        { passive: false }
      );

      window.addEventListener('keydown', (e) => {
        const down = ['ArrowDown', 'PageDown', ' '];
        const up = ['ArrowUp', 'PageUp'];
        if (!down.includes(e.key) && !up.includes(e.key)) return;
        if (Date.now() < unlockAt) return;
        if (locked) return;
        current = nearestIndex();
        const target = current + (down.includes(e.key) ? 1 : -1);
        if (target < 0 || target >= panels.length) return;
        e.preventDefault();
        jumpTo(target);
      });

      window.addEventListener(
        'touchstart',
        (e) => {
          if (!e.touches || !e.touches.length) return;
          touchStartY = e.touches[0].clientY;
          touchStartY = e.touches[0].clientY;
        },
        { passive: true }
      );

      window.addEventListener(
        'touchmove',
        (e) => {
          if (touchStartY == null || !e.touches || !e.touches.length) return;
          const dy = touchStartY - e.touches[0].clientY;
          if (Math.abs(dy) < 28) return;
          const region = e.target instanceof Element ? e.target.closest('[data-scroll-region]') : null;
          if (region && canScrollRegion(region, dy)) return;
          if (Date.now() < unlockAt) return;
          if (locked) return;
          current = nearestIndex();
          const target = current + (dy > 0 ? 1 : -1);
          if (target < 0 || target >= panels.length) return;
          e.preventDefault();
          jumpTo(target);
          touchStartY = null;
        },
        { passive: false }
      );

      window.addEventListener('touchend', () => {
        touchStartY = null;
      });
  };

  initForcedSnap('snap-opinions', '.qa-panel');
  initForcedSnap('snap-social', '[data-snap-panel]');
  initForcedSnap('snap-courtroom', '[data-court-slide]');
  initForcedSnap('snap-performance', '[data-perf-slide]');
  initForcedSnap('snap-machinal', '[data-mach-slide]');
  initForcedSnap('snap-case', '[data-case-slide]');
  initForcedSnap('snap-synthesis', '.story-panel');

  const sectionMenuLinks = Array.from(document.querySelectorAll('.court-menu a[href^="#"]'));
  if (sectionMenuLinks.length) {
    const byId = new Map();
    sectionMenuLinks.forEach((link) => {
      const id = link.getAttribute('href').slice(1);
      const sections = [];
      const primary = document.getElementById(id);
      if (primary) sections.push(primary);
      document.querySelectorAll(`[data-menu-id="${id}"]`).forEach((el) => sections.push(el));
      if (sections.length) byId.set(id, { link, sections });
    });

    const setCurrent = (id) => {
      sectionMenuLinks.forEach((link) => {
        link.classList.toggle('current', link.getAttribute('href') === `#${id}`);
      });
    };

    const sections = Array.from(new Set(Array.from(byId.values()).flatMap((x) => x.sections)));
    if (sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (!visible.length) return;
          const id = visible[0].target.id || visible[0].target.dataset.menuId;
          if (id) setCurrent(id);
        },
        {
          root: null,
          rootMargin: '-20% 0px -55% 0px',
          threshold: [0.2, 0.45, 0.7],
        }
      );

      sections.forEach((s) => observer.observe(s));
      const firstId = sections[0].id || sections[0].dataset.menuId;
      if (firstId) setCurrent(firstId);
    }
  }

  const alignSideMenusToOverviewText = () => {
    if (window.innerWidth <= 900) {
      document.querySelectorAll('.court-menu').forEach((menu) => {
        menu.style.removeProperty('top');
        menu.style.removeProperty('transform');
      });
      return;
    }

    const alignOne = (layoutSelector, textSelector) => {
      const layout = document.querySelector(layoutSelector);
      if (!layout) return;
      const menu = layout.querySelector('.court-menu');
      const textEl = layout.querySelector(textSelector);
      if (!menu || !textEl) return;

      const rect = textEl.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      menu.style.top = `${Math.max(120, Math.round(centerY))}px`;
      menu.style.transform = 'translateY(-50%)';
    };

    const alignOneClamped = (layoutSelector, textSelector, topPadding = 116, bottomPadding = 20) => {
      const layout = document.querySelector(layoutSelector);
      if (!layout) return;
      const menu = layout.querySelector('.court-menu');
      const textEl = layout.querySelector(textSelector);
      if (!menu || !textEl) return;

      const rect = textEl.getBoundingClientRect();
      const desiredCenter = rect.top + rect.height / 2;
      const menuHeight = menu.offsetHeight || 0;
      const minCenter = topPadding + menuHeight / 2;
      const maxCenter = window.innerHeight - bottomPadding - menuHeight / 2;
      const clampedCenter = Math.min(Math.max(desiredCenter, minCenter), maxCenter);

      menu.style.top = `${Math.round(clampedCenter)}px`;
      menu.style.transform = 'translateY(-50%)';
    };

    const alignViewportCenter = (layoutSelector, topPadding = 116, bottomPadding = 20) => {
      const layout = document.querySelector(layoutSelector);
      if (!layout) return;
      const menu = layout.querySelector('.court-menu');
      if (!menu) return;

      const menuHeight = menu.offsetHeight || 0;
      const desiredCenter = window.innerHeight / 2;
      const minCenter = topPadding + menuHeight / 2;
      const maxCenter = window.innerHeight - bottomPadding - menuHeight / 2;
      const clampedCenter = Math.min(Math.max(desiredCenter, minCenter), maxCenter);

      menu.style.top = `${Math.round(clampedCenter)}px`;
      menu.style.transform = 'translateY(-50%)';
    };

    alignOne('.case-layout', '#case-overview-intro .lead');
    alignOne('.mach-layout', '#mach-intro .lead');
    alignOne('.court-layout', '#overview .lead');
    alignViewportCenter('.social-layout');
    alignOne('.synthesis-layout', '#synth-performance .story-copy p');
  };

  alignSideMenusToOverviewText();
  window.addEventListener('resize', alignSideMenusToOverviewText);
})();
