/* -------------------------------------------

Name:           Ruizarch
Version:    1.0
Developer:      Nazar Miller (millerDigitalDesign)
Portfolio:  https://themeforest.net/user/millerdigitaldesign/portfolio?ref=MillerDigitalDesign

p.s. I am available for Freelance hire (UI design, web development). email: miller.themes@gmail.com

------------------------------------------- */

function initApp() {
    "use strict";

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const accent = 'rgba(255, 152, 0, 1)';
    const dark = '#000';
    const light = '#fff';

    if (!window.milPreloaderInitialized) {
        const timeline = gsap.timeline();

        timeline.to(".mil-preloader-animation", {
            opacity: 1,
        });

        timeline.fromTo(
            ".mil-animation-1 .mil-h3", {
                y: "30px",
                opacity: 0
            }, {
                y: "0px",
                opacity: 1,
                stagger: 0.4
            },
        );

        timeline.to(".mil-animation-1 .mil-h3", {
            opacity: 0,
            y: '-30',
        }, "+=.3");

        timeline.fromTo(".mil-reveal-box", 0.1, {
            opacity: 0,
        }, {
            opacity: 1,
            x: '-30',
        });

        timeline.to(".mil-reveal-box", 0.45, {
            width: "100%",
            x: 0,
        }, "+=.1");
        timeline.to(".mil-reveal-box", {
            right: "0"
        });
        timeline.to(".mil-reveal-box", 0.3, {
            width: "0%"
        });
        timeline.fromTo(".mil-animation-2 .mil-h3", {
            opacity: 0,
        }, {
            opacity: 1,
        }, "-=.5");
        timeline.to(".mil-animation-2 .mil-h3", 0.6, {
            opacity: 0,
            y: '-30'
        }, "+=.5");
        timeline.to(".mil-preloader", 0.8, {
            opacity: 0,
            ease: 'sine',
        }, "+=.2");
        timeline.fromTo(".mil-up", 0.8, {
            opacity: 0,
            y: 40,
            scale: .98,
            ease: 'sine',

        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            onComplete: function () {
                $('.mil-preloader').addClass("mil-hidden");
            },
        }, "-=1");

        window.milPreloaderInitialized = true;
    }

    $(document).off('click.milSmoothScroll');
    $(document).on('click.milSmoothScroll', 'a[href^="#"]', function (event) {
        const target = $($.attr(this, 'href'));
        if (!target.length) {
            return;
        }

        event.preventDefault();

        let offset = 0;

        if ($(window).width() < 1200) {
            offset = 90;
        }

        $('html, body').animate({
            scrollTop: target.offset().top - offset
        }, 400);
    });

    $(".mil-arrow-place .mil-arrow, .mil-animation .mil-dodecahedron, .mil-lines-place .mil-lines, .mil-current-page a").remove();
    $(".mil-arrow").clone().appendTo(".mil-arrow-place");
    $(".mil-dodecahedron").clone().appendTo(".mil-animation");
    $(".mil-lines").clone().appendTo(".mil-lines-place");
    $(".mil-main-menu ul li.mil-active > a").clone().appendTo(".mil-current-page");

    const groups = gsap.utils.toArray(".mil-accordion-group");
    const menus = gsap.utils.toArray(".mil-accordion-menu");

    menus.forEach((menu) => {
        if (menu.__milClickHandler) {
            menu.removeEventListener("click", menu.__milClickHandler);
        }
    });

    const menuToggles = groups.map(createAnimation);

    menus.forEach((menu) => {
        const handler = (event) => {
            event.preventDefault();
            toggleMenu(menu);
        };
        menu.__milClickHandler = handler;
        menu.addEventListener("click", handler);
    });

    function toggleMenu(clickedMenu) {
        menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
    }

    function createAnimation(element) {
        const menu = element.querySelector(".mil-accordion-menu");
        const box = element.querySelector(".mil-accordion-content");
        const symbol = element.querySelector(".mil-symbol");
        const minusElement = element.querySelector(".mil-minus");
        const plusElement = element.querySelector(".mil-plus");

        if (!menu || !box || !symbol || !minusElement || !plusElement) {
            return () => {};
        }

        gsap.set(box, {
            height: "auto",
        });

        const animation = gsap
            .timeline()
            .from(box, {
                height: 0,
                duration: 0.4,
                ease: "sine"
            })
            .from(minusElement, {
                duration: 0.4,
                autoAlpha: 0,
                ease: "none",
            }, 0)
            .to(plusElement, {
                duration: 0.4,
                autoAlpha: 0,
                ease: "none",
            }, 0)
            .to(symbol, {
                background: accent,
                ease: "none",
            }, 0)
            .reverse();

        return function (clickedMenu) {
            if (clickedMenu === menu) {
                animation.reversed(!animation.reversed());
            } else {
                animation.reverse();
            }
        };
    }

    const btt = document.querySelector(".mil-back-to-top .mil-link");

    if (btt) {
        gsap.set(btt, {
            x: -30,
            opacity: 0,
        });

        gsap.to(btt, {
            x: 0,
            opacity: 1,
            ease: 'sine',
            scrollTrigger: {
                trigger: "body",
                start: "top -40%",
                end: "top -40%",
                toggleActions: "play none reverse none"
            }
        });
    }

    const cursor = document.querySelector('.mil-ball');

    if (cursor) {
        if (window.milCursorHandler) {
            document.removeEventListener('pointermove', window.milCursorHandler);
        }

        window.milCursorHandler = function (e) {
            gsap.to(cursor, {
                duration: 0.6,
                ease: 'sine',
                x: e.clientX,
                y: e.clientY,
            });
        };

        gsap.set(cursor, {
            xPercent: -50,
            yPercent: -50,
        });

        document.addEventListener('pointermove', window.milCursorHandler);

        $('.mil-drag, .mil-more, .mil-choose').off('mouseover.milCursorHover mouseleave.milCursorHover');
        $('.mil-drag, .mil-more, .mil-choose')
            .on('mouseover.milCursorHover', function () {
                gsap.to($(cursor), .2, {
                    width: 90,
                    height: 90,
                    opacity: 1,
                    ease: 'sine',
                });
            })
            .on('mouseleave.milCursorHover', function () {
                gsap.to($(cursor), .2, {
                    width: 20,
                    height: 20,
                    opacity: .1,
                    ease: 'sine',
                });
            });

        $('.mil-accent-cursor').off('mouseover.milCursorAccent mouseleave.milCursorAccent');
        $('.mil-accent-cursor')
            .on('mouseover.milCursorAccent', function () {
                gsap.to($(cursor), .2, {
                    background: accent,
                    ease: 'sine',
                });
                $(cursor).addClass('mil-accent');
            })
            .on('mouseleave.milCursorAccent', function () {
                gsap.to($(cursor), .2, {
                    background: dark,
                    ease: 'sine',
                });
                $(cursor).removeClass('mil-accent');
            });

        $('.mil-drag').off('mouseover.milCursorDrag mouseleave.milCursorDrag');
        $('.mil-drag')
            .on('mouseover.milCursorDrag', function () {
                gsap.to($('.mil-ball .mil-icon-1'), .2, {
                    scale: '1',
                    ease: 'sine',
                });
            })
            .on('mouseleave.milCursorDrag', function () {
                gsap.to($('.mil-ball .mil-icon-1'), .2, {
                    scale: '0',
                    ease: 'sine',
                });
            });

        $('.mil-more').off('mouseover.milCursorMore mouseleave.milCursorMore');
        $('.mil-more')
            .on('mouseover.milCursorMore', function () {
                gsap.to($('.mil-ball .mil-more-text'), .2, {
                    scale: '1',
                    ease: 'sine',
                });
            })
            .on('mouseleave.milCursorMore', function () {
                gsap.to($('.mil-ball .mil-more-text'), .2, {
                    scale: '0',
                    ease: 'sine',
                });
            });

        $('.mil-choose').off('mouseover.milCursorChoose mouseleave.milCursorChoose');
        $('.mil-choose')
            .on('mouseover.milCursorChoose', function () {
                gsap.to($('.mil-ball .mil-choose-text'), .2, {
                    scale: '1',
                    ease: 'sine',
                });
            })
            .on('mouseleave.milCursorChoose', function () {
                gsap.to($('.mil-ball .mil-choose-text'), .2, {
                    scale: '0',
                    ease: 'sine',
                });
            });

        $('a:not(".mil-choose , .mil-more , .mil-drag , .mil-accent-cursor"), input , textarea, .mil-accordion-menu')
            .off('mouseover.milCursorGeneral mouseleave.milCursorGeneral');
        $('a:not(".mil-choose , .mil-more , .mil-drag , .mil-accent-cursor"), input , textarea, .mil-accordion-menu')
            .on('mouseover.milCursorGeneral', function () {
                gsap.to($(cursor), .2, {
                    scale: 0,
                    ease: 'sine',
                });
                gsap.to($('.mil-ball svg'), .2, {
                    scale: 0,
                });
            })
            .on('mouseleave.milCursorGeneral', function () {
                gsap.to($(cursor), .2, {
                    scale: 1,
                    ease: 'sine',
                });

                gsap.to($('.mil-ball svg'), .2, {
                    scale: 1,
                });
            });

        $('body').off('mousedown.milCursorBody mouseup.milCursorBody');
        $('body')
            .on('mousedown.milCursorBody', function () {
                gsap.to($(cursor), .2, {
                    scale: .1,
                    ease: 'sine',
                });
            })
            .on('mouseup.milCursorBody', function () {
                gsap.to($(cursor), .2, {
                    scale: 1,
                    ease: 'sine',
                });
            });
    }

    $('.mil-menu-btn').off('click.milMenuToggle').on('click.milMenuToggle', function () {
        $('.mil-menu-btn').toggleClass('mil-active');
        $('.mil-menu').toggleClass('mil-active');
        $('.mil-menu-frame').toggleClass('mil-active');
    });

    $('.mil-has-children a').off('click.milMenuChildren').on('click.milMenuChildren', function (event) {
        event.preventDefault();
        $('.mil-has-children ul').removeClass('mil-active');
        $('.mil-has-children a').removeClass('mil-active');
        $(this).toggleClass('mil-active');
        $(this).next().toggleClass('mil-active');
    });

    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    gsap.to('.mil-progress', {
        height: '100%',
        ease: 'sine',
        scrollTrigger: {
            scrub: 0.3
        }
    });

    const appearance = document.querySelectorAll(".mil-up");

    appearance.forEach((section) => {
        gsap.fromTo(section, {
            opacity: 0,
            y: 40,
            scale: .98,
            ease: 'sine',

        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: .4,
            scrollTrigger: {
                trigger: section,
                toggleActions: 'play none none reverse',
            }
        });
    });

    const scaleImage = document.querySelectorAll(".mil-scale");

    scaleImage.forEach((section) => {
        const value1 = $(section).data("value-1");
        const value2 = $(section).data("value-2");
        gsap.fromTo(section, {
            ease: 'sine',
            scale: value1,

        }, {
            scale: value2,
            scrollTrigger: {
                trigger: section,
                scrub: true,
                toggleActions: 'play none none reverse',
            }
        });
    });

    const parallaxImage = document.querySelectorAll(".mil-parallax");

    if ($(window).width() > 960) {
        parallaxImage.forEach((section) => {
            const value1 = $(section).data("value-1");
            const value2 = $(section).data("value-2");
            gsap.fromTo(section, {
                ease: 'sine',
                y: value1,

            }, {
                y: value2,
                scrollTrigger: {
                    trigger: section,
                    scrub: true,
                    toggleActions: 'play none none reverse',
                }
            });
        });
    }

    const rotate = document.querySelectorAll(".mil-rotate");

    rotate.forEach((section) => {
        const value = $(section).data("value");
        gsap.fromTo(section, {
            ease: 'sine',
            rotate: 0,

        }, {
            rotate: value,
            scrollTrigger: {
                trigger: section,
                scrub: true,
                toggleActions: 'play none none reverse',
            }
        });
    });

    $('[data-fancybox="gallery"]').fancybox({
        buttons: [
            "slideShow",
            "zoom",
            "fullScreen",
            "close"
        ],
        loop: false,
        protect: true
    });
    $.fancybox.defaults.hash = false;

    const reviewsMenu = ['<div class="mil-custom-dot mil-slide-1"></div>', '<div class="mil-custom-dot mil-slide-2"></div>', '<div class="mil-custom-dot mil-slide-3"></div>', '<div class="mil-custom-dot mil-slide-4"></div>', '<div class="mil-custom-dot mil-slide-5"></div>', '<div class="mil-custom-dot mil-slide-6"></div>', '<div class="mil-custom-dot mil-slide-7"></div>'];
    new Swiper('.mil-reviews-slider', {
        pagination: {
            el: '.mil-revi-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + (reviewsMenu[index]) + '</span>';
            },
        },
        speed: 800,
        effect: 'fade',
        parallax: true,
        navigation: {
            nextEl: '.mil-revi-next',
            prevEl: '.mil-revi-prev',
        },
    });

    new Swiper('.mil-infinite-show', {
        slidesPerView: 2,
        spaceBetween: 30,
        speed: 5000,
        autoplay: true,
        autoplay: {
            delay: 0,
        },
        loop: true,
        freeMode: true,
        breakpoints: {
            992: {
                slidesPerView: 4,
            },
        },
    });

    new Swiper('.mil-portfolio-slider', {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 800,
        parallax: true,
        mousewheel: {
            enable: true
        },
        navigation: {
            nextEl: '.mil-portfolio-next',
            prevEl: '.mil-portfolio-prev',
        },
        pagination: {
            el: '.swiper-portfolio-pagination',
            type: 'fraction',
        },
    });

    new Swiper('.mil-1-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 800,
        parallax: true,
        navigation: {
            nextEl: '.mil-portfolio-next',
            prevEl: '.mil-portfolio-prev',
        },
        pagination: {
            el: '.swiper-portfolio-pagination',
            type: 'fraction',
        },
    });

    new Swiper('.mil-2-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 800,
        parallax: true,
        navigation: {
            nextEl: '.mil-portfolio-next',
            prevEl: '.mil-portfolio-prev',
        },
        pagination: {
            el: '.swiper-portfolio-pagination',
            type: 'fraction',
        },
        breakpoints: {
            992: {
                slidesPerView: 2,
            },
        },
    });
}

// --- INICIO DEL BLOQUE SWUP ---

const options = {
    containers: ['#swupMain', '#swupMenu'],
};
const swup = new Swup(options);

document.addEventListener('DOMContentLoaded', initApp);
swup.on('contentReplaced', initApp);

// --- FIN DEL BLOQUE SWUP ---
