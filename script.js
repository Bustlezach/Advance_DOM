'use strict';

///////////////////////////////////////
// SELECTING VARIOUS CLASSES OF THE PROJECT

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const dotContainer = document.querySelector('.dots');

///////////////////////////////////////////////////////////
// TO HIDE AND REVEAL THE MODAL FORM

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////////////

// BUTTON SCROLLING

btnScrollTo.addEventListener('click', function (event) {
  // const s1coords = section1.getBoundingClientRect(); // the essence of this line is to capture the coordinate of the selected element, so that javascript could scroll there.

  // SCROLLING

  // 1. method
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // second method
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behaviour: 'smooth',
  // });

  // modern method
  section1.scrollIntoView({
    behaviour: 'smooth',
  });
});

//////////////////////////////////////////////////////////////////

// PAGE NAVIGATION

// const nav = document.querySelectorAll('.nav__link'); // We are using queryselectorAll because the menu is more than one.
// nav.forEach(function (el) {
//   el.addEventListener('click', function (event) {
//     event.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behaviour: 'smooth' });
//   });
// });

// 1. Add event listener to common parent elements
// 2. Determine what element originated the event using event dot target
document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();

    //MATCHING STRATEGY
    if (event.target.classList.contains('nav__link')) {
      const id = event.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behaviour: 'smooth' });
    }
  });

///////////////////////////////////////////////////////////////////

// TABBED COMPONENT

// tabs.forEach(t => t.addEventListener('click', () => console.log('TAB'))); // Each menu tab is added with event listener

// EVENT DELEGATION IS USED INSTEAD OF THE ABOVE METHOD. NOTE: EVENT HANDLER IS ADDED TO THE COMMON PARENT OF THE TABS
tabsContainer.addEventListener('click', function (event) {
  // we need to identify which button was clicked by using TARGET
  const clicked = event.target.closest('.operations__tab');
  // GUARD CLAUSE to clean null bugs when button was not clicked
  if (!clicked) return;

  // REMOVE ACTIVE
  // remove active classes for both tab and content
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // ACTIVE TAB

  clicked.classList.add('operations__tab--active');
  // console.log(clicked);

  //ACTIVE CONTENT AREA
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
///////////////////////////////////////////////////////////

// MENU FADE ANIMATION

const handlerHover = function (event, opacity) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handlerHover.bind(0.5));
nav.addEventListener('mouseout', handlerHover.bind(1));

//////////////////////////////////////////////////////////

//Using the new interception observerAPI for sticky navigation

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // nav.classList.add('sticky');
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
}); // We are making the observer to observe the header, so that once the header is scroll out the nav sticks.

headerObserver.observe(header);

/////////////////////////////////////////////////////////////

// REVEAL SECTIONS
const allSections = document.querySelectorAll('.section'); // Selecting all the sections
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden'); // revealing the target section
  observer.unobserve(entry.target);
  console.log(entry);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, //rootMargin: ,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section); // observing each section with intersection observer
  // section.classList.add('section--hidden');
});

//////////////////////////////////////////////////////////////

// LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // repalce image with data-src image
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

/////////////////////////////////////////////////////////////

// SLIDER
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = `scale(0.2)`;
  // slider.style.overflow = 'visible';

  // FUNCTIONS
  const createDots = function (slide) {
    slides.forEach(function (s, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, index) =>
        (s.style.transform = `translateX(${100 * (index - slide)}%)`)
    );
  };

  //moving to the next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const previousSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    // // 0%, 100%, 200%, 300%
    activateDot(0);
  };
  init();

  // BOTTON EVENT HANDLERS
  btnRight.addEventListener('click', function () {
    nextSlide();
  });
  btnLeft.addEventListener('click', function () {
    previousSlide();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === `ArrowLeft`) previousSlide();
    if (event.key === `ArrowRight`) nextSlide();
  });
  dotContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('dots__dot')) {
      const { slide } = event.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
// curSlide = 1: -100%, 0%, 100%, 200%

///////////////////////////////////////////////////////////////

// CREATING AND INSERTING HTML ELEMENTS

// 1 .insertAdjacentHTML
// 2 document.createElement()
const message = document.createElement('div'); // created html div
message.classList.add('cookie-message'); // added a class to the div
// message.textContent = `We used cookied for improved functionality.`; // textContent is used to insert text
// message.innerHTML = `We used cookied for improved functionality.`;
// console.log(message);
// header.prepend(message); // prepend is used to add element as the first child
const footer = document.querySelector('.footer');
footer.append(message); // append is used to add element as the last child

// DELECTING ELEMENT

// document.querySelector('.btn--close-cookie').addEventListener('click', function(){
// message.remove();
// })

// STYLE: to get to style an element; we have to select the element, style and the property name e.g

message.style.backgroundColor = '#37383d';
message.style.width = `120%`;
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

//ATTRIBUTE
const logo = document.querySelector('.nav__logo');
// selecting the attribute of logo
console.log(logo.alt);
console.log(logo.className);
console.log(logo.src);

document.addEventListener('DOMContentLoaded', function (event) {
  console.log(`HTML parsed and DOM tree built!`, event);
});
