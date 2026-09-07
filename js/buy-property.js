/* =========================================
        MSAA CONSULTING
        BUY PROPERTY FORM
        WHATSAPP
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("buyPropertyForm");

    if (!form) {
        return;
    }


    /* =====================================
            RADIO OPTIONS
    ====================================== */

    const radioInputs = form.querySelectorAll(
        'input[type="radio"]'
    );

    radioInputs.forEach((radio) => {

        radio.addEventListener("change", () => {

            const groupName = radio.name;

            const sameGroup = form.querySelectorAll(
                `input[name="${groupName}"]`
            );

            sameGroup.forEach((item) => {

                item.setAttribute(
                    "aria-checked",
                    item.checked ? "true" : "false"
                );

            });

        });

    });


    /* =====================================
            GET VALUE
    ====================================== */

    function getValue(id) {

        const element = document.getElementById(id);

        if (!element || !element.value.trim()) {
            return "غير محدد";
        }

        return element.value.trim();

    }


    /* =====================================
            GET RADIO VALUE
    ====================================== */

    function getRadioValue(name) {

        const selected = form.querySelector(
            `input[name="${name}"]:checked`
        );

        if (!selected) {
            return "غير محدد";
        }

        const values = {

            finance: "تمويل",
            cash: "شراء نقدي",

            yes: "نعم",
            no: "لا"

        };

        return values[selected.value] || selected.value;

    }


    /* =====================================
            WHATSAPP SUBMIT
    ====================================== */

    form.addEventListener("submit", (event) => {

        event.preventDefault();


        const whatsappNumber = "96898999835";


        const message = `
طلب شراء عقار
━━━━━━━━━━━━━━━━

بيانات العميل

الاسم: ${getValue("buyerName")}
رقم الهاتف: ${getValue("buyerPhone")}
البريد الإلكتروني: ${getValue("buyerEmail")}

تفاصيل الطلب

الميزانية: ${getValue("budget")}
نوع العقار: ${getValue("buyPropertyType")}
الموقع المطلوب: ${getValue("requiredLocation")}
الحد الأدنى للدخل: ${getValue("minimumIncome")}
العائد المستهدف: ${getValue("targetReturn")}

طريقة الشراء: ${getRadioValue("purchaseMethod")}
المدة المتوقعة للشراء: ${getValue("purchasePeriod")}

هل يرغب في عقار مؤجر؟ ${getRadioValue("rentedProperty")}
هل يقبل عقارًا يحتاج إلى تطوير؟ ${getRadioValue("needsDevelopment")}

تفاصيل إضافية:
${getValue("additionalDetails")}

━━━━━━━━━━━━━━━━
تم إرسال الطلب من موقع محمد الشيادي للاستشارات العقارية.
        `.trim();


        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


        window.location.href = whatsappURL;

    });

});
