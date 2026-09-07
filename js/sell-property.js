/* =========================================
        MSAA CONSULTING
        SELL PROPERTY FORM
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
            FILE UPLOADS
    ====================================== */

    const uploadBoxes = document.querySelectorAll(".upload-box");

    uploadBoxes.forEach((box) => {

        const input = box.querySelector('input[type="file"]');
        const text = box.querySelector("span");

        if (!input || !text) return;

        const originalText = text.textContent.trim();

        input.addEventListener("change", () => {

            if (!input.files || input.files.length === 0) {

                text.textContent = originalText;
                box.classList.remove("file-selected");
                return;

            }

            if (input.multiple) {

                const count = input.files.length;

                if (count === 1) {
                    text.textContent = "تم اختيار صورة واحدة";
                } else if (count === 2) {
                    text.textContent = "تم اختيار صورتين";
                } else if (count >= 3 && count <= 10) {
                    text.textContent = `تم اختيار ${count} صور`;
                } else {
                    text.textContent = `تم اختيار ${count} صورة`;
                }

            } else {

                text.textContent = input.files[0].name;

            }

            box.classList.add("file-selected");

        });

    });


    /* =====================================
            FORM
    ====================================== */

    const form = document.getElementById("sellPropertyForm");
    const button = document.querySelector(".sell-submit-btn");

    const declaration = document.getElementById("declaration");
    const declarationBox = document.querySelector(".form-declaration");

    if (!form || !button) return;


    /* =====================================
            HELPERS
    ====================================== */

    function getValue(id) {

        const element = document.getElementById(id);

        if (!element) return "غير محدد";

        const value = element.value.trim();

        return value !== "" ? value : "غير محدد";
    }


    function getSelectText(id) {

        const element = document.getElementById(id);

        if (!element || element.selectedIndex < 0) {
            return "غير محدد";
        }

        const text = element.options[element.selectedIndex].text.trim();

        return text !== "اختر" ? text : "غير محدد";
    }


    function getRadioValue(name) {

        const selected = form.querySelector(
            'input[name="' + name + '"]:checked'
        );

        if (!selected) return "غير محدد";

        if (selected.value === "yes") return "نعم";
        if (selected.value === "no") return "لا";

        return selected.value;
    }


    function getFileNames(name) {

        const input = form.querySelector(
            'input[name="' + name + '"]'
        );

        if (!input || !input.files || input.files.length === 0) {
            return "لم يتم إرفاق ملف";
        }

        return Array.from(input.files)
            .map(file => file.name)
            .join("، ");
    }


    /* =====================================
            SEND TO WHATSAPP
    ====================================== */

    button.addEventListener("click", (event) => {

        event.preventDefault();
        event.stopPropagation();


        /* التحقق من الإقرار */

        if (declaration && !declaration.checked) {

            if (declarationBox) {
                declarationBox.classList.add("error");
            }

            declaration.focus();

            if (declarationBox) {

                declarationBox.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

            return;
        }


        if (declarationBox) {
            declarationBox.classList.remove("error");
        }


        /* =================================
                WHATSAPP MESSAGE
        ================================= */

        const whatsappNumber = "96898999835";


        const message =
`طلب عرض عقار للبيع

━━━━━━━━━━━━━━━━

بيانات مقدم الطلب:

الاسم الكامل: ${getValue("fullName")}
رقم الهاتف: ${getValue("phone")}
البريد الإلكتروني: ${getValue("email")}
صفة مقدم الطلب: ${getSelectText("applicantType")}

تفاصيل العقار:

نوع العقار: ${getSelectText("propertyType")}
المحافظة: ${getValue("governorate")}
الولاية: ${getValue("wilayat")}
الموقع: ${getValue("location")}
رابط الموقع: ${getValue("locationLink")}

السعر والمساحات:

السعر المطلوب: ${getValue("askingPrice")}
مساحة الأرض: ${getValue("landArea")}
مساحة البناء: ${getValue("buildingArea")}
عمر العقار: ${getValue("propertyAge")}
عدد الوحدات: ${getValue("units")}

الدخل والإيجار:

الدخل الشهري: ${getValue("monthlyIncome")}
نسبة الإشغال: ${getValue("occupancy")}%
هل توجد عقود إيجار؟ ${getRadioValue("rentalContracts")}

الوضع المالي:

هل توجد رهون أو تمويلات على العقار؟ ${getRadioValue("mortgages")}

المستندات والمرفقات:

مستند الملكية: ${getFileNames("ownership")}
الكروكي: ${getFileNames("krooki")}
صور العقار: ${getFileNames("propertyImages")}

ملاحظات إضافية:

${getValue("notes")}

━━━━━━━━━━━━━━━━

تم إرسال الطلب من موقع محمد الشيادي للاستشارات العقارية.`;


        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(message);


        window.location.href = whatsappURL;

    });


    /* =====================================
            REMOVE DECLARATION ERROR
    ====================================== */

    if (declaration) {

        declaration.addEventListener("change", () => {

            if (declaration.checked && declarationBox) {

                declarationBox.classList.remove("error");

            }

        });

    }

});
