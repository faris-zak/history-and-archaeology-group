(function () {
  const data = window.HAG_DATA;
  const renderTarget = (name) => document.querySelector(`[data-render="${name}"]`);
  const escapeText = (value) =>
    String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);

  const renderStats = () => {
    const target = renderTarget("stats");
    target.innerHTML = data.stats
      .map((stat) => `
        <div>
          <strong>${escapeText(stat.value)}</strong>
          <span>${escapeText(stat.label)}</span>
        </div>
      `)
      .join("");
  };

  const renderFeatureImages = () => {
    const heroImage = document.querySelector("[data-feature-image='0']");
    if (heroImage) {
      heroImage.src = data.featureImages[0].src;
      heroImage.alt = "";
    }

    const target = renderTarget("feature-images");
    target.innerHTML = data.featureImages
      .slice(1)
      .map((image) => `
        <figure>
          <img src="${escapeText(image.src)}" alt="${escapeText(image.alt)}" loading="lazy">
          <figcaption>${escapeText(image.credit)}</figcaption>
        </figure>
      `)
      .join("");
  };

  const renderCommittees = () => {
    const target = renderTarget("committees");
    target.innerHTML = data.committees
      .map((committee) => `
        <article class="committee-card">
          <h3>${escapeText(committee.name)}</h3>
          <p>${escapeText(committee.description)}</p>
        </article>
      `)
      .join("");
  };

  const renderArchive = (filter = "all") => {
    const target = renderTarget("archive");
    const items = filter === "all"
      ? data.archiveItems
      : data.archiveItems.filter((item) => item.type === filter);

    target.innerHTML = items
      .map((item) => `
        <article class="archive-card">
          <div class="archive-meta">
            <span>${escapeText(item.year)}</span>
            <span>${escapeText(item.type)}</span>
          </div>
          <h3>${escapeText(item.title)}</h3>
          <p>${escapeText(item.description)}</p>
          <a href="${escapeText(item.href)}" target="_blank" rel="noreferrer">المصدر: ${escapeText(item.source)}</a>
        </article>
      `)
      .join("");
  };

  const renderSocial = () => {
    const target = renderTarget("social");
    target.innerHTML = data.socialLinks
      .map((link) => `
        <a class="social-card" href="${escapeText(link.href)}" target="_blank" rel="noreferrer">
          <span>${escapeText(link.name)}</span>
          <strong>${escapeText(link.handle)}</strong>
          <p>${escapeText(link.description)}</p>
        </a>
      `)
      .join("");
  };

  const setupMenu = () => {
    const button = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#main-nav");
    if (!button || !nav) return;

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        button.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
  };

  const setupFilters = () => {
    const buttons = document.querySelectorAll(".filter-button");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        renderArchive(button.dataset.filter);
      });
    });
  };

  renderStats();
  renderFeatureImages();
  renderCommittees();
  renderArchive();
  renderSocial();
  setupMenu();
  setupFilters();

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
