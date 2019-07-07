var toggle = document.querySelector(".main-nav__toggle");
var mainHeaderLogo = document.querySelector(".main-header__logo");
var navWrapper = document.querySelector(".main-nav__wrapper");

var openMenu = function() {
  toggle.classList.remove("main-nav__toggle--on");
  toggle.classList.add("main-nav__toggle--off");
  mainHeaderLogo.classList.remove("main-header__logo--menu-active");
  navWrapper.classList.remove("main-nav__wrapper--hidden");
};

var closeMenu = function() {
  toggle.classList.remove("main-nav__toggle--off");
  toggle.classList.add("main-nav__toggle--on");
  mainHeaderLogo.classList.add("main-header__logo--menu-active");
  navWrapper.classList.add("main-nav__wrapper--hidden");
};

closeMenu();

toggle.addEventListener("click", function(evt) {
  evt.preventDefault();
  if (toggle.classList.contains("main-nav__toggle--off")) {
    closeMenu();
  } else if (toggle.classList.contains("main-nav__toggle--on")) {
    openMenu();
  }
});

$(document).ready( function() {
  $(".owl-carousel").owlCarousel({
    items: 6,
    autoWidth: true,
    loop: true,
  });
});

