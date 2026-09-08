/* =========================================
        MSAA CONSULTING
        SELL PROPERTY + PROPERTY VALUATION
        WHATSAPP + FILE UPLOAD
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("sellPropertyForm");
    const button = document.querySelector(".sell-submit-btn");

    const declaration = document.getElementById("declaration");
    const declarationBox = document.querySelector(".form-declaration");

    if (!form || !button) return;


    /* =====================================
            تحديد نوع الصفحة
    ====================================== */

    const buttonText =
        button.querySelector("span")?.textContent.trim() || "";

    const isValuationPage =
        buttonText.includes("التقييم");


    /* =====================================
            FILE SELECTION
    ====================================== */

    const uploadBoxes =
        document.querySelectorAll(".upload-box");

    uploadBoxes.forEach((box) => {

        const input =
            box.querySelector('input[type="file"]');

        const text =
            box.querySelector("span");

        if (!input || !text) return;

        const originalText =
            text.textContent.trim();

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

                text.textContent =
                    input.files[0].name;

            }

            box.classList.add("file-selected");

        });

    });


    /* =====================================
            HELPERS
    ====================================== */

    function getValue(id) {

        const element =
            document.getElementById(id);

        if (!element) return "غير محدد";

        const value =
            element.value.trim();

        return value !== ""
            ? value
            : "غير محدد";
    }


    function getSelectText(id) {

        const element =
            document.getElementById(id);

        if (
            !element ||
            element.selectedIndex < 0
        ) {
            return "غير محدد";
        }

        const text =
            element.options[
                element.selectedIndex
            ].text.trim();

        return text !== "اختر"
            ? text
            : "غير محدد";
    }


    function getRadioValue(name) {

        const selected =
            form.querySelector(
                'input[name="' +
                name +
                '"]:checked'
            );

        if (!selected) {
            return "غير محدد";
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
            UPLOAD FILES
    ====================================== */

    async function uploadFiles() {

        const fileInputs =
            form.querySelectorAll(
                'input[type="file"]'
            );

        const formData =
            new FormData();

        fileInputs.forEach((input) => {

            if (
                !input.files ||
                input.files.length === 0
            ) {
                return;
            }

            Array.from(input.files).forEach(
                (file) => {

                    formData.append(
                        input.name,
                        file
                    );

                }
            );

        });


        const response =
            await fetch(
                "https://rfgrzpcyzbcjlsdbbddl.supabase.co/functions/v1/upload-property-files",
                {
                    method: "POST",
                    body: formData
                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                "حدث خطأ أثناء رفع الملفات"
            );

        }


        return result.files || [];

    }


    /* =====================================
            SEND REQUEST
    ====================================== */

    button.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();
            event.stopPropagation();


            /* التحقق من الإقرار */

            if (
                declaration &&
                !declaration.checked
            ) {

                if (declarationBox) {

                    declarationBox.classList.add(
                        "error"
                    );

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

                declarationBox.classList.remove(
                    "error"
                );

            }


            /* منع الضغط المتكرر */

            button.disabled = true;


            try {

                /* ==========================
                        رفع الملفات
                =========================== */

                const uploadedFiles =
                    await uploadFiles();


                /* ==========================
                        تجهيز المرفقات
                =========================== */

                let attachments =
                    "لا توجد مرفقات";


                if (
                    uploadedFiles.length > 0
                ) {

                    attachments =
                        uploadedFiles
                            .map((file) => {

                                return (
                                    `📄 ${file.label}: ${file.name}\n` +
                                    `🔗 فتح الملف: ${file.url}`
                                );

                            })
                            .join("\n\n");

                }


                /* ==========================
                        تحديد عنوان الطلب
                =========================== */

                const requestTitle =
                    isValuationPage
                        ? "طلب تقييم عقار"
                        : "طلب عرض عقار للبيع";


                /* ==========================
                        رسالة واتساب
                =========================== */

                const message =
`${requestTitle}

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

هل توجد رهونات أو التزامات؟ ${getRadioValue("mortgages")}

رابط الموقع:

${getValue("locationLink")}

المرفقات:

${attachments}

ملاحظات إضافية:

${getValue("notes")}

━━━━━━━━━━━━━━━━

تم إرسال الطلب من موقع محمد الشيادي للاستشارات العقارية.`;


                const whatsappNumber =
                    "96898999835";


                const whatsappURL =
                    "https://wa.me/" +
                    whatsappNumber +
                    "?text=" +
                    encodeURIComponent(
                        message
                    );


                /* فتح واتساب */

                window.location.href =
                    whatsappURL;


            } catch (error) {

                console.error(
                    "Request error:",
                    error
                );

                alert(
                    "حدث خطأ أثناء رفع الملفات. يرجى المحاولة مرة أخرى."
                );

                button.disabled = false;

            }

        }
    );


    /* =====================================
            REMOVE DECLARATION ERROR
    ====================================== */

    if (declaration) {

        declaration.addEventListener(
            "change",
            () => {

                if (
                    declaration.checked &&
                    declarationBox
                ) {

                    declarationBox.classList.remove(
                        "error"
                    );

                }

            }
        );

    }

});
