// =========================================
// MSAA CONSULTING
/* =========================================
        SCROLL REVEAL ANIMATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-right, .reveal-left"
    );


    const revealObserver = new IntersectionObserver(

        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.15
        }

    );


    revealElements.forEach(function (element) {

        revealObserver.observe(element);

    });

});
/* =========================================
        EXPERIENCE COUNTERS
========================================= */

const counters = document.querySelectorAll(".counter");

const startCounter = (counter) => {

    // يمنع تشغيل العداد أكثر من مرة
    if (counter.dataset.counted === "true") {
        return;
    }

    counter.dataset.counted = "true";

    const target = Number(counter.dataset.target);

    const duration = 1800;

    const startTime = performance.now();


    function updateCounter(currentTime) {

        const elapsed = currentTime - startTime;

        const progress = Math.min(
            elapsed / duration,
            1
        );


        /*
            حركة ناعمة:
            تبدأ أسرع قليلًا ثم تهدأ
            عند الوصول للرقم النهائي
        */

        const easeOut = 1 - Math.pow(
            1 - progress,
            3
        );


        const currentNumber = Math.floor(
            easeOut * target
        );


        counter.textContent =
            currentNumber.toLocaleString("en-US");


        if (progress < 1) {

            requestAnimationFrame(
                updateCounter
            );

        }

        else {

            /*
                نتأكد أن الرقم النهائي
                يظهر بالضبط
            */

            counter.textContent =
                target.toLocaleString("en-US");

        }

    }


    requestAnimationFrame(
        updateCounter
    );

};



/* =========================================
        OBSERVE EXPERIENCE SECTION
========================================= */

const experienceSection =
    document.querySelector(
        "#experience-stats"
    );


if (experienceSection && counters.length) {

    const counterObserver =
        new IntersectionObserver(

            (entries, observer) => {

                entries.forEach(
                    (entry) => {

                        /*
                            يبدأ العد عندما يظهر
                            جزء كافٍ من القسم
                        */

                        if (entry.isIntersecting) {

                            counters.forEach(
                                (counter) => {

                                    startCounter(
                                        counter
                                    );

                                }
                            );


                            /*
                                إيقاف المراقبة بعد
                                التشغيل لأول مرة
                            */

                            observer.unobserve(
                                experienceSection
                            );

                        }

                    }
                );

            },

            {

                threshold: 0.30

            }

        );


    counterObserver.observe(
        experienceSection
    );

}
/* =========================================
        SERVICES ACCORDION
========================================= */

const serviceCards =
    document.querySelectorAll(
        ".service-card"
    );


serviceCards.forEach((card) => {

    const toggle =
        card.querySelector(
            ".service-toggle"
        );


    if (!toggle) {
        return;
    }


    toggle.addEventListener(
        "click",
        function () {

            const isOpen =
                card.classList.contains(
                    "active"
                );


            /*
                إغلاق البطاقة الحالية
                إذا كانت مفتوحة
            */

            if (isOpen) {

                card.classList.remove(
                    "active"
                );

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                return;

            }


            /*
                إغلاق أي بطاقة أخرى مفتوحة

                هذا يجعل التصميم مرتبًا:
                بطاقة واحدة فقط مفتوحة
                في نفس الوقت
            */

            serviceCards.forEach(
                (otherCard) => {

                    otherCard.classList.remove(
                        "active"
                    );

                    const otherToggle =
                        otherCard.querySelector(
                            ".service-toggle"
                        );

                    if (otherToggle) {

                        otherToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );


            /*
                فتح البطاقة التي ضغطنا عليها
            */

            card.classList.add(
                "active"
            );

            toggle.setAttribute(
                "aria-expanded",
                "true"
            );

        }
    );

});
/* =========================================
        WORK PROCESS TIMELINE
========================================= */

const processSection =
    document.querySelector(".work-process");

const processProgress =
    document.querySelector(".process-line-progress");


if(processSection && processProgress){

    const processObserver =
        new IntersectionObserver(

            (entries, observer) => {

                entries.forEach(entry => {

                    if(entry.isIntersecting){

                        processProgress.style.height =
                            "100%";

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {

                threshold: 0.18

            }

        );


    processObserver.observe(
        processSection
    );

}
/* =========================================
        REAL ESTATE ROI CALCULATOR
========================================= */

const calculateROIButton =
    document.getElementById("calculateROI");


if(calculateROIButton){

    calculateROIButton.addEventListener(
        "click",
        calculateRealEstateROI
    );

}


function calculateRealEstateROI(){

    /* =====================================
            GET INPUT VALUES
    ====================================== */

    const purchasePrice =
        getROIValue("purchasePrice");

    const monthlyIncome =
        getROIValue("monthlyIncome");

    let occupancyRate =
        getROIValue("occupancyRate");

    const annualExpenses =
        getROIValue("annualExpenses");

    const maintenanceCost =
        getROIValue("maintenanceCost");

    const developmentCost =
        getROIValue("developmentCost");


    /* =====================================
            VALIDATION
    ====================================== */

    if(purchasePrice <= 0){

        alert(
            "يرجى إدخال سعر شراء صحيح."
        );

        return;

    }


    if(monthlyIncome < 0){

        return;

    }


    /*
        إذا تُركت نسبة الإشغال فارغة
        نعتبرها 100%
    */

    if(
        document
        .getElementById("occupancyRate")
        .value === ""
    ){

        occupancyRate = 100;

    }


    occupancyRate =
        Math.min(
            Math.max(
                occupancyRate,
                0
            ),
            100
        );


    /* =====================================
            CALCULATIONS
    ====================================== */


    /* الدخل السنوي الإجمالي */

    const grossAnnualIncome =
        monthlyIncome * 12;


    /* الدخل الفعلي حسب نسبة الإشغال */

    const effectiveIncome =
        grossAnnualIncome *
        (occupancyRate / 100);


    /* إجمالي المصروفات */

    const totalAnnualExpenses =
        annualExpenses +
        maintenanceCost;


    /* صافي الدخل التشغيلي */

    const netOperatingIncome =
        effectiveIncome -
        totalAnnualExpenses;


    /*
        إجمالي الاستثمار

        سعر الشراء
        +
        تكلفة التطوير
    */

    const totalInvestment =
        purchasePrice +
        developmentCost;


    /* العائد الإجمالي */

    const grossYield =

        purchasePrice > 0

        ?

        (
            grossAnnualIncome /
            purchasePrice
        ) * 100

        :

        0;


    /* العائد الصافي */

    const netYield =

        totalInvestment > 0

        ?

        (
            netOperatingIncome /
            totalInvestment
        ) * 100

        :

        0;


    /* فترة استرداد رأس المال */

    const paybackPeriod =

        netOperatingIncome > 0

        ?

        totalInvestment /
        netOperatingIncome

        :

        0;


    /* =====================================
            DISPLAY RESULTS
    ====================================== */

    updateROIText(

        "grossAnnualIncome",

        formatOMR(
            grossAnnualIncome
        )

    );


    updateROIText(

        "effectiveIncome",

        formatOMR(
            effectiveIncome
        )

    );


    updateROIText(

        "netOperatingIncome",

        formatOMR(
            netOperatingIncome
        )

    );


    updateROIText(

        "grossYield",

        formatPercentage(
            grossYield
        )

    );


    updateROIText(

        "netYield",

        formatPercentage(
            netYield
        )

    );


    updateROIText(

        "netYieldSmall",

        formatPercentage(
            netYield
        )

    );


    updateROIText(

        "paybackPeriod",

        netOperatingIncome > 0

        ?

        paybackPeriod.toFixed(1) +
        " سنة"

        :

        "غير متاح"

    );

}


/* =========================================
        GET NUMBER
========================================= */

function getROIValue(id){

    const element =
        document.getElementById(id);

    if(!element){

        return 0;

    }

    const value =
        parseFloat(
            element.value
        );

    return isNaN(value)
        ? 0
        : value;

}


/* =========================================
        UPDATE RESULT
========================================= */

function updateROIText(
    id,
    value
){

    const element =
        document.getElementById(id);

    if(element){

        element.textContent =
            value;

    }

}


/* =========================================
        FORMAT OMR
========================================= */

function formatOMR(value){

    return new Intl.NumberFormat(
        "ar-OM",
        {

            minimumFractionDigits:0,

            maximumFractionDigits:3

        }

    ).format(value)
    +
    " ر.ع";

}


/* =========================================
        FORMAT PERCENTAGE
========================================= */

function formatPercentage(value){

    return value.toFixed(2)
        +
        "%";

}
/* =========================================
        FAQ ACCORDION
========================================= */

const faqItems = document.querySelectorAll(".faq-item");


faqItems.forEach((item) => {

    const question =
        item.querySelector(".faq-question");


    question.addEventListener("click", () => {

        const isOpen =
            item.classList.contains("active");


        /* إغلاق جميع الأسئلة */

        faqItems.forEach((faq) => {

            faq.classList.remove("active");

            const faqButton =
                faq.querySelector(".faq-question");

            faqButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });


        /* فتح السؤال المضغوط إذا كان مغلقًا */

        if(!isOpen){

            item.classList.add("active");

            question.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });

});
/* =========================================================
   ABOUT PAGE ANIMATIONS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const aboutIntro =
        document.querySelector(".about-page-intro");

    const aboutVisual =
        document.querySelector(".about-page-visual");

    const personWrap =
        document.querySelector(".about-page-person-wrap");


    /* =====================================================
       HERO ENTRANCE
       محمد من اليسار + النص من اليمين
    ===================================================== */

    if (aboutIntro && aboutVisual) {

        const heroObserver =
            new IntersectionObserver(

                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        /* النص يدخل من اليمين */

                        aboutIntro.classList.add(
                            "about-enter"
                        );


                        /* محمد يدخل من اليسار */

                        aboutVisual.classList.add(
                            "about-enter"
                        );


                        /*
                           بعد انتهاء الدخول
                           يبدأ Floating
                        */

                        if (personWrap) {

                            setTimeout(function () {

                                personWrap.classList.add(
                                    "float-active"
                                );

                            }, 1200);

                        }


                        /*
                           الحركة تعمل مرة واحدة فقط
                        */

                        observer.unobserve(
                            entry.target
                        );

                    });

                },

                {
                    threshold:0.15
                }

            );


        const aboutHero =
            document.querySelector(
                ".about-page-hero"
            );


        if (aboutHero) {

            heroObserver.observe(
                aboutHero
            );

        }

    }


    /* =====================================================
       OTHER SECTIONS REVEAL
    ===================================================== */

    const revealElements = [

        document.querySelector(
            ".about-story-content"
        ),

        ...document.querySelectorAll(
            ".about-need-item"
        ),

        ...document.querySelectorAll(
            ".about-direction-card"
        ),

        ...document.querySelectorAll(
            ".about-value-card"
        )

    ].filter(Boolean);


    revealElements.forEach(function (element) {

        element.classList.add(
            "about-reveal"
        );

    });


    const revealObserver =
        new IntersectionObserver(

            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        "about-visible"
                    );


                    /*
                       كل عنصر يتحرك مرة واحدة فقط
                    */

                    observer.unobserve(
                        entry.target
                    );

                });

            },

            {
                threshold:0.15,

                rootMargin:
                    "0px 0px -40px 0px"
            }

        );


    revealElements.forEach(function (element) {

        revealObserver.observe(
            element
        );

    });


    /* =====================================================
       VALUES — STAGGER
    ===================================================== */

    const valueCards =
        document.querySelectorAll(
            ".about-value-card"
        );


    valueCards.forEach(function (card, index) {

        card.style.transitionDelay =
            (index * 80) + "ms";

    });


    /* =====================================================
       STORY ITEMS — STAGGER
    ===================================================== */

    const needItems =
        document.querySelectorAll(
            ".about-need-item"
        );


    needItems.forEach(function (item, index) {

        item.style.transitionDelay =
            (index * 90) + "ms";

    });

});
/* =========================================
        SERVICES PAGE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".service-card");

    cards.forEach((card,index)=>{

        card.style.opacity="0";
        card.style.transform="translateY(60px)";

        setTimeout(()=>{

            card.style.transition=
            "all .8s cubic-bezier(.2,.8,.2,1)";

            card.style.opacity="1";
            card.style.transform="translateY(0)";

        },index*120);

    });

});
document.querySelectorAll(".service-card").forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-10px)";
        card.style.boxShadow="0 25px 60px rgba(0,0,0,.12)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="";
        card.style.boxShadow="";

    });

});
/* =========================================
        CONTACT PAGE
========================================= */

document.addEventListener("DOMContentLoaded",()=>{

    const info=document.querySelector(".contact-info");
    const form=document.querySelector(".contact-form-card");

    if(info){

        info.animate([

            {
                opacity:0,
                transform:"translateX(80px)"
            },

            {
                opacity:1,
                transform:"translateX(0)"
            }

        ],{

            duration:900,
            easing:"ease-out",
            fill:"forwards"

        });

    }

    if(form){

        form.animate([

            {
                opacity:0,
                transform:"translateX(-80px)"
            },

            {
                opacity:1,
                transform:"translateX(0)"
            }

        ],{

            duration:900,
            delay:200,
            easing:"ease-out",
            fill:"forwards"

        });

    }

});
document.querySelectorAll(".form-group input,.form-group textarea").forEach(input=>{

    input.addEventListener("focus",()=>{

        input.parentElement.classList.add("focus");

    });

    input.addEventListener("blur",()=>{

        input.parentElement.classList.remove("focus");

    });

})
