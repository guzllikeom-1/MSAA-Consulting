/* =========================================
        MSAA CONSULTING
        BUY PROPERTY
        WHATSAPP
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("buyPropertyForm");
    const button = document.querySelector(".buy-submit-btn");

    if (!form || !button) {
        return;
    }


    /* =====================================
            GET INPUT VALUE
    ====================================== */

    function getValue(id) {

        const element = document.getElementById(id);

        if (!element) {
            return "غير محدد";
        }

        const value = element.value.trim();

        return value !== "" ? value : "غير محدد";
    }


    /* =====================================
            GET RADIO VALUE
    ====================================== */

    function getRadioValue(name) {

        const selected = form.querySelector(
            'input[name="' + name + '"]:checked'
        );

        if (!selected) {
            return "غير محدد";
        }

        if (selected.value === "finance") {
            return "تمويل";
        }

        if (selected.value === "cash") {
            return "شراء نقدي";
        }

        if (selected.value === "yes") {
            return "نعم";
        }

        if (selected.value === "no") {
            return "لا";
        }

        return selected.value;
    }


    /* =====================================
            SEND TO WHATSAPP
    ====================================== */

    button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();


        const whatsappNumber = "96898999835";


        const message =
`طلب شراء عقار

━━━━━━━━━━━━━━━━

بيانات العميل:

الاسم: ${getValue("buyerName")}
رقم الهاتف: ${getValue("buyerPhone")}
البريد الإلكتروني: ${getValue("buyerEmail")}

تفاصيل طلب الشراء:

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

تم إرسال الطلب من موقع محمد الشيادي للاستشارات العقارية.`;


        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(message);


        window.location.href = whatsappURL;

    });

});
