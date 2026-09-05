/*=========================================
        SERVICES PAGE
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*=====================================
            REVEAL ELEMENTS
    =====================================*/

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    /*=====================================
            INTERSECTION OBSERVER
    =====================================*/

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("active");

                observer.unobserve(entry.target);

            });

        },

        {
            root: null,

            threshold: 0.15,

            rootMargin: "0px 0px -60px 0px"
        }

    );

    revealElements.forEach((element) => {

        observer.observe(element);

    });

    /*=====================================
            STAGGER EFFECT
    =====================================*/

    revealElements.forEach((element, index) => {

        element.style.transitionDelay =
            `${index * 80}ms`;

    });

});
/*=========================================
        PARALLAX & SCROLL EFFECTS
=========================================*/

const heroSection = document.querySelector(".services-hero");
const heroContent = document.querySelector(".services-hero .container");
const serviceNumbers = document.querySelectorAll(".service-number");

let ticking = false;

/*=========================================
        UPDATE SCROLL EFFECTS
=========================================*/

function updateScrollEffects() {

    const scrollY = window.scrollY;

    /*=====================================
            HERO PARALLAX
    =====================================*/

    if (heroSection) {

        heroSection.style.backgroundPosition =
            `center ${scrollY * 0.25}px`;

    }

    if (heroContent) {

        heroContent.style.transform =
            `translateY(${scrollY * 0.18}px)`;

    }

    /*=====================================
            SERVICE NUMBERS
    =====================================*/

    serviceNumbers.forEach((number) => {

        const card = number.closest(".service-card");

        if (!card) return;

        const rect = card.getBoundingClientRect();

        const windowHeight = window.innerHeight;

        if (rect.bottom > 0 && rect.top < windowHeight) {

            const offset =
                (windowHeight - rect.top) * 0.04;

            number.style.transform =
                `translateY(${offset}px)`;

        }

    });

    ticking = false;

}

/*=========================================
        REQUEST ANIMATION FRAME
=========================================*/

function onScroll() {

    if (!ticking) {

        window.requestAnimationFrame(updateScrollEffects);

        ticking = true;

    }

}

window.addEventListener("scroll", onScroll, {

    passive: true

});

/*=========================================
        INITIAL RUN
=========================================*/

updateScrollEffects();

/*=========================================
        RIPPLE EFFECT
=========================================*/

const buttons = document.querySelectorAll(
    ".primary-btn, .secondary-btn"
);

buttons.forEach((button) => {

    button.addEventListener("click", function (event) {

        const ripple =
            document.createElement("span");

        const rect =
            this.getBoundingClientRect();

        const size =
            Math.max(rect.width, rect.height);

        ripple.className = "ripple";

        ripple.style.width =
            `${size}px`;

        ripple.style.height =
            `${size}px`;

        ripple.style.left =
            `${event.clientX - rect.left - size / 2}px`;

        ripple.style.top =
            `${event.clientY - rect.top - size / 2}px`;

        this.appendChild(ripple);

        ripple.addEventListener("animationend", () => {

            ripple.remove();

        });

    });

});

/*=========================================
        CARD HOVER EFFECT
=========================================*/

const serviceCards =
    document.querySelectorAll(".service-card");

serviceCards.forEach((card) => {

    card.addEventListener("mouseenter", () => {

        card.style.transform =
            "translateY(-12px)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});

/*=========================================
        ICON ANIMATION
=========================================*/

const serviceIcons =
    document.querySelectorAll(".service-icon");

serviceIcons.forEach((icon) => {

    icon.addEventListener("mouseenter", () => {

        icon.animate(

            [

                {
                    transform:
                    "translateY(0) rotate(0deg)"
                },

                {
                    transform:
                    "translateY(-8px) rotate(-8deg)"
                },

                {
                    transform:
                    "translateY(0) rotate(0deg)"
                }

            ],

            {

                duration:500,

                easing:"ease-out"

            }

        );

    });

});

/*=========================================
        MAGNETIC BUTTON
=========================================*/

buttons.forEach((button) => {

    button.addEventListener("mousemove", (event) => {

        const rect =
            button.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        const moveX =
            (x - rect.width / 2) * 0.08;

        const moveY =
            (y - rect.height / 2) * 0.08;

        button.style.transform =
            `translate(${moveX}px, ${moveY}px)`;

    });

    button.addEventListener("mouseleave", () => {

        button.style.transform = "";

    });

});

/*=========================================
        CARD GLOW
=========================================*/

serviceCards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

        const rect =
            card.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);

        card.style.setProperty("--mouse-y", `${y}px`);

    });

});

/*=========================================
        ACCESSIBILITY
=========================================*/

const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)");

if (reduceMotion.matches) {

    document.querySelectorAll(

        ".reveal, .reveal-left, .reveal-right, .reveal-scale"

    ).forEach((element) => {

        element.classList.add("active");

    });

}

/*=========================================
        IMAGE LAZY EFFECT
=========================================*/

const lazyElements = document.querySelectorAll(

    ".service-card, .services-cta"

);

const lazyObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("loaded");

            lazyObserver.unobserve(entry.target);

        });

    },

    {

        threshold:0.15

    }

);

lazyElements.forEach((element) => {

    lazyObserver.observe(element);

});

/*=========================================
        DEBOUNCE
=========================================*/

function debounce(callback, delay = 150){

    let timeout;

    return (...args) => {

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/*=========================================
        WINDOW RESIZE
=========================================*/

window.addEventListener(

    "resize",

    debounce(() => {

        updateScrollEffects();

    }),

    {

        passive:true

    }

);

/*=========================================
        KEYBOARD ACCESSIBILITY
=========================================*/

buttons.forEach((button) => {

    button.addEventListener("keyup",(event)=>{

        if(

            event.key === "Enter" ||

            event.key === " "

        ){

            button.click();

        }

    });

});

/*=========================================
        REMOVE FOCUS AFTER CLICK
=========================================*/

buttons.forEach((button)=>{

    button.addEventListener("mouseup",()=>{

        button.blur();

    });

});

/*=========================================
        PAGE READY
=========================================*/

document.body.classList.add("services-ready");

console.log(

    "Services Page Loaded Successfully"

);
/*=========================================
        SERVICES ACCORDION
=========================================*/

const accordionCards = document.querySelectorAll(".service-card");

accordionCards.forEach((card) => {

    const toggle = card.querySelector(".service-toggle");

    if (!toggle) return;

    toggle.addEventListener("click", () => {

        card.classList.toggle("accordion-active");

    });

});