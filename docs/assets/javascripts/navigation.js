/* Keep the desktop navigation preference across reloads and Material's instant navigation. */
(function () {
  var root = document.documentElement;

  function syncNavigation() {
    var hidden = root.dataset.argusNavigation === "hidden";
    var sidebar = document.querySelector(".md-sidebar--primary");
    if (sidebar) sidebar.id = "argus-navigation";
    document.querySelectorAll(".argus-nav-toggle").forEach(function (button) {
      var label = hidden ? "Show navigation" : "Hide navigation";
      button.setAttribute("aria-expanded", String(!hidden));
      button.setAttribute("aria-label", label);
      button.title = label;
    });
  }

  document.addEventListener("click", function (event) {
    if (event.target.closest(".argus-nav-toggle")) {
      var hidden = root.dataset.argusNavigation !== "hidden";
      if (hidden) root.dataset.argusNavigation = "hidden";
      else delete root.dataset.argusNavigation;
      try {
        localStorage.setItem("argus.docs.navigation", hidden ? "hidden" : "shown");
      } catch (e) {}
      syncNavigation();
    }

    if (event.target.closest("[data-argus-search]")) {
      var toggle = document.getElementById("__search");
      var input = document.querySelector(".md-search__input");
      if (toggle && input) {
        toggle.checked = true;
        toggle.dispatchEvent(new Event("change", { bubbles: true }));
        input.focus();
      }
    }
  });

  if (typeof document$ !== "undefined") document$.subscribe(syncNavigation);
  else syncNavigation();
})();
