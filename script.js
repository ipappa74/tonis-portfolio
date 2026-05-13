const header = document.getElementById("header");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const revealElements = document.querySelectorAll(".reveal");
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

const sunIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.2"></circle>
    <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9L5.3 5.3"></path>
  </svg>
`;

const moonIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M20 14.2A7.8 7.8 0 1 1 9.8 4a6.4 6.4 0 0 0 10.2 10.2z"></path>
  </svg>
`;

function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

function updateThemeIcon(theme) {
  if (!themeToggleIcon) return;
  themeToggleIcon.innerHTML = theme === "dark" ? sunIcon : moonIcon;
}

function updateThemeToggleLabel(theme) {
  if (!themeToggle) return;
  const nextThemeLabel =
    theme === "dark" ? "Vaihda vaaleaan teemaan" : "Vaihda tummaan teemaan";
  themeToggle.setAttribute("aria-label", nextThemeLabel);
  themeToggle.setAttribute("title", nextThemeLabel);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateThemeIcon(theme);
  updateThemeToggleLabel(theme);
}

function updateActiveNavLink() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  navAnchors.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", () => {
  if (header) {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  updateActiveNavLink();
});

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks) navLinks.classList.remove("open");
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("visible"));
}

updateThemeIcon(getCurrentTheme());
updateThemeToggleLabel(getCurrentTheme());
updateActiveNavLink();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = getCurrentTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function handleSystemThemeChange(event) {
  const savedTheme = localStorage.getItem("theme");
  if (!savedTheme) {
    const systemTheme = event.matches ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", systemTheme);
    updateThemeIcon(systemTheme);
    updateThemeToggleLabel(systemTheme);
  }
}

if (mediaQuery.addEventListener) {
  mediaQuery.addEventListener("change", handleSystemThemeChange);
} else if (mediaQuery.addListener) {
  mediaQuery.addListener(handleSystemThemeChange);
}

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    const wrapper = img.parentElement;
    if (wrapper) {
      wrapper.classList.add("has-fallback");
    }
  });

  if (img.complete && img.naturalWidth === 0) {
    const wrapper = img.parentElement;
    if (wrapper) {
      wrapper.classList.add("has-fallback");
    }
  }
});