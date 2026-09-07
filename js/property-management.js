document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("managementForm");

    if (!form) return;

    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    if (!submitButton) return;

    submitButton.addEventListener("click", (event) => {

        event.preventDefault();

        const getValue = (id) => {
            const element = document.getElementById(id);

            if (!element) return "غير مذكور";

            if (element.type === "radio") {
                const checked = document.querySelector(
                    `input[name="${element.name}"]:checked`
                );

                return checked
                    ? (checked.value || "غير مذكور")
                    : "غير مذكور";
            }

            if (element.type === "checkbox") {
                return element.checked ? "نعم" : "لا";
            }

            return element.value?.trim() || "غير مذكور";
        };

        const getRadioValue = (name) => {
            const checked = document.querySelector(
                `input[name="${name}"]:checked`
            );

            return checked
                ? (checked.value || "غير مذكور")
                : "غير مذكور";
        };

        const getSelectText = (id) => {
            const select = document.getElementById(id);

            if (!select || select.selectedIndex < 0) {
                return "غير مذكور";
            }

            return select.options[select.selectedIndex].textContent.trim();
        };

        const name =
            getValue("managementName") !== "غير مذكور"
                ? getValue("managementName")
                : getValue("fullName");

        const phone =
            getValue("managementPhone") !== "غير مذكور"
                ? getValue("managementPhone")
                : getValue("phone");

        const email =
            getValue("managementEmail") !== "غير مذكور"
                ? getValue("managementEmail")
                : getValue("email");

        const propertyType =
            getSelectText("managementPropertyType") !== "غير مذكور"
                ? getSelectText("managementPropertyType")
                : getSelectText("propertyType");

        const location =
            getValue("managementLocation") !== "غير مذكور"
                ? getValue("managementLocation")
                : getValue("location");

        const units =
            getValue("managementUnits") !== "غير مذكور"
                ? getValue("managementUnits")
                : getValue("units");

        const currentIncome =
            getValue("currentIncome") !== "غير مذكور"
                ? getValue("currentIncome")
                : getValue("monthlyIncome");

        const occupancy =
            getValue("occupancy") !== "غير مذكور"
                ? getValue("occupancy")
                : getValue("occupancyRate");

        const vacantUnits =
            getValue("vacantUnits") !== "غير مذكور"
                ? getValue("vacantUnits")
                : getValue("vacant");

        const arrears =
            getRadioValue("arrears") !== "غير مذكور"
                ? getRadioValue("arrears")
                : getRadioValue("hasArrears");

        const contracts =
            getRadioValue("contracts") !== "غير مذكور"
                ? getRadioValue("contracts")
                : getRadioValue("documentedContracts");

        const services =
            getValue("requestedServices") !== "غير مذكور"
                ? getValue("requestedServices")
                : getValue("services");

        const notes =
            getValue("managementNotes") !== "غير مذكور"
                ? getValue("managementNotes")
                : getValue("notes");

        const message = `
طلب عرض إدارة عقار

الاسم: ${name}
رقم التواصل: ${phone}
البريد الإلكتروني: ${email}

نوع العقار: ${propertyType}
الموقع: ${location}
عدد الوحدات: ${units}

الدخل الحالي: ${currentIncome}
نسبة الإشغال: ${occupancy}
عدد الوحدات الشاغرة: ${vacantUnits}

هل توجد متأخرات؟ ${arrears}
هل توجد عقود موثقة؟ ${contracts}

الخدمات المطلوبة:
${services}

الملاحظات:
${notes}
        `.trim();

        const whatsappNumber = "96898999835";

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.location.href = whatsappURL;
    });

});
