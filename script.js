const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const forceScrollTop = () => {
  window.scrollTo(0, 0);
  requestAnimationFrame(() => window.scrollTo(0, 0));
};

window.addEventListener("DOMContentLoaded", forceScrollTop);
window.addEventListener("load", forceScrollTop);
window.addEventListener("pageshow", forceScrollTop);

const themeToggleBtn = document.getElementById("theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let savedTheme = null;
try {
  savedTheme = localStorage.getItem("theme");
} catch (error) {
  savedTheme = null;
}
const startTheme = savedTheme || (prefersDark ? "dark" : "light");

document.body.setAttribute("data-theme", startTheme);

const applyThemeButtonLabel = () => {
  if (!themeToggleBtn) return;
  const activeTheme = document.body.getAttribute("data-theme");
  themeToggleBtn.setAttribute("data-theme-state", activeTheme);
  themeToggleBtn.setAttribute(
    "aria-label",
    activeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
};

applyThemeButtonLabel();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch (error) {
      // Ignore storage errors in restricted browser modes.
    }
    applyThemeButtonLabel();
  });
}

const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => observer.observe(el));

const experienceSection = document.getElementById("experience");
const researchSection = document.getElementById("research");
const researchTitleEl = document.getElementById("research-title");
const timelineEl = document.getElementById("exp-timeline");
const workTitleEl = document.getElementById("work-title");
let timelineDelayTimer = null;

if (researchSection && researchTitleEl) {
  const researchObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          researchTitleEl.classList.remove("pull");
          void researchTitleEl.offsetWidth;
          researchTitleEl.classList.add("pull");
        } else {
          researchTitleEl.classList.remove("pull");
        }
      });
    },
    { threshold: 0.35 }
  );
  researchObserver.observe(researchSection);
}

if (experienceSection && timelineEl && workTitleEl) {
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          workTitleEl.classList.remove("pull");
          timelineEl.classList.remove("timeline-show");
          if (timelineDelayTimer) clearTimeout(timelineDelayTimer);

          // Restart title animation first, then reveal timeline.
          void workTitleEl.offsetWidth;
          workTitleEl.classList.add("pull");
          timelineDelayTimer = setTimeout(() => {
            timelineEl.classList.add("timeline-show");
          }, 680);
        } else {
          if (timelineDelayTimer) clearTimeout(timelineDelayTimer);
          workTitleEl.classList.remove("pull");
          timelineEl.classList.remove("timeline-show");
        }
      });
    },
    { threshold: 0.3 }
  );
  timelineObserver.observe(experienceSection);
}

const skillsetTrigger = document.getElementById("skillset-trigger");
const skillPopupBackdrop = document.getElementById("skill-popup-backdrop");
const skillPopupClose = document.getElementById("skill-popup-close");
const expPopupBackdrop = document.getElementById("exp-popup-backdrop");
const expPopupClose = document.getElementById("exp-popup-close");
const expPopupTitle = document.getElementById("exp-popup-title");
const expPopupPoints = document.getElementById("exp-popup-points");
const expMoreBtns = document.querySelectorAll(".exp-more-btn");

const syncModalState = () => {
  const hasOpenModal =
    (skillPopupBackdrop && skillPopupBackdrop.classList.contains("open")) ||
    (expPopupBackdrop && expPopupBackdrop.classList.contains("open"));
  document.body.classList.toggle("modal-open", hasOpenModal);
};

const closeSkillPopup = () => {
  if (!skillPopupBackdrop) return;
  skillPopupBackdrop.classList.remove("open");
  syncModalState();
};

if (skillsetTrigger && skillPopupBackdrop) {
  skillsetTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    skillPopupBackdrop.classList.add("open");
    syncModalState();
  });
}

if (skillPopupClose) {
  skillPopupClose.addEventListener("click", closeSkillPopup);
}

if (skillPopupBackdrop) {
  skillPopupBackdrop.addEventListener("click", (event) => {
    if (event.target === skillPopupBackdrop) closeSkillPopup();
  });
}

const closeExpPopup = () => {
  if (!expPopupBackdrop) return;
  expPopupBackdrop.classList.remove("open");
  syncModalState();
};


if (expMoreBtns.length && expPopupBackdrop && expPopupTitle && expPopupPoints) {
  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const formatExpPoint = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return "";
    const escaped = escapeHtml(trimmed);
    return `<li><span class="exp-bullet-dot"></span><span class="exp-bullet-text">${escaped}</span></li>`;
  };

  expMoreBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-exp-title") || "Role Details";
      const points = (btn.getAttribute("data-exp-points") || "")
        .split("||")
        .map((item) => item.trim())
        .filter(Boolean);

      expPopupTitle.textContent = title;
      expPopupPoints.innerHTML = points.map(formatExpPoint).join("");
      expPopupPoints.querySelectorAll("li").forEach((item, index) => {
        item.style.setProperty("--delay", `${index * 90}ms`);
      });
      expPopupBackdrop.classList.add("open");
      syncModalState();
    });
  });
}

if (expPopupClose) {
  expPopupClose.addEventListener("click", closeExpPopup);
}

if (expPopupBackdrop) {
  expPopupBackdrop.addEventListener("click", (event) => {
    if (event.target === expPopupBackdrop) closeExpPopup();
  });
}



window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSkillPopup();
    closeExpPopup();
  }
});

const projectGroups = document.querySelectorAll(".project-group");
if (projectGroups.length) {
  projectGroups.forEach((group) => {
    const trigger = group.querySelector(".project-group-head");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      projectGroups.forEach((other) => {
        if (other !== group) {
          other.classList.remove("is-open");
          const otherTrigger = other.querySelector(".project-group-head");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        }
      });
      const isOpen = group.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
}
