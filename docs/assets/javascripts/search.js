/* Open Material's search from the homepage button, including after instant navigation. */
document.addEventListener("click", function (event) {
  if (!event.target.closest("[data-argus-search]")) return;

  var toggle = document.getElementById("__search");
  var input = document.querySelector(".md-search__input");
  if (toggle && input) {
    toggle.checked = true;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));
    input.focus();
  }
});
