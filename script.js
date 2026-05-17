const yearElement = document.querySelector("#year");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#primary-menu");
const leafField = document.querySelector(".leaf-field");
const revealElements = document.querySelectorAll(
  ".section-heading, .hero-content, .hero-panel, .two-column, .timeline-item, .card, .skills-grid > div, .education-list article, .contact > div"
);

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  });
}

if (revealElements.length > 0) {
  revealElements.forEach((element) => element.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }
}

if (
  leafField &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const leaves = 14;
  const leafTypes = ["leaf-oval", "leaf-maple", "leaf-long", "leaf-round"];
  const activeLeaves = [];

  for (let index = 0; index < leaves; index += 1) {
    const leaf = document.createElement("span");
    const size = 10 + Math.random() * 15;
    const left = Math.random() * 100;
    const duration = 12 + Math.random() * 12;
    const delay = Math.random() * -24;
    const sway = 3.5 + Math.random() * 3.5;
    const drift = -70 + Math.random() * 140;
    const rotate = Math.random() * 180;
    const opacity = 0.18 + Math.random() * 0.28;
    const type = leafTypes[index % leafTypes.length];

    leaf.className = `falling-leaf ${type}`;
    leaf.style.setProperty("--leaf-size", `${size}px`);
    leaf.style.setProperty("--leaf-left", `${left}%`);
    leaf.style.setProperty("--fall-duration", `${duration}s`);
    leaf.style.setProperty("--fall-delay", `${delay}s`);
    leaf.style.setProperty("--sway-duration", `${sway}s`);
    leaf.style.setProperty("--leaf-drift", `${drift}px`);
    leaf.style.setProperty("--leaf-rotate", `${rotate}deg`);
    leaf.style.setProperty("--leaf-opacity", opacity.toFixed(2));
    leaf.style.setProperty("--push-x", "0px");
    leaf.style.setProperty("--push-y", "0px");

    leafField.appendChild(leaf);
    activeLeaves.push(leaf);
  }

  if (window.matchMedia("(pointer: fine)").matches) {
    const blowerRadius = 170;
    let animationFrame = null;
    let pointer = null;

    const updateLeafPush = () => {
      animationFrame = null;

      activeLeaves.forEach((leaf) => {
        if (!pointer) {
          leaf.style.setProperty("--push-x", "0px");
          leaf.style.setProperty("--push-y", "0px");
          return;
        }

        const rect = leaf.getBoundingClientRect();
        const leafX = rect.left + rect.width / 2;
        const leafY = rect.top + rect.height / 2;
        const deltaX = leafX - pointer.x;
        const deltaY = leafY - pointer.y;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance > blowerRadius || distance === 0) {
          leaf.style.setProperty("--push-x", "0px");
          leaf.style.setProperty("--push-y", "0px");
          return;
        }

        const force = ((blowerRadius - distance) / blowerRadius) ** 2;
        const pushX = (deltaX / distance) * force * 135;
        const pushY = (deltaY / distance) * force * 92 - force * 26;

        leaf.style.setProperty("--push-x", `${pushX.toFixed(1)}px`);
        leaf.style.setProperty("--push-y", `${pushY.toFixed(1)}px`);
      });
    };

    const requestLeafPush = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateLeafPush);
      }
    };

    window.addEventListener("pointermove", (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      requestLeafPush();
    });

    window.addEventListener("pointerleave", () => {
      pointer = null;
      requestLeafPush();
    });
  }
}
