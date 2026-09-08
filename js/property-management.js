document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("managementForm");

    if (!form) return;

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const getValue = (id) => {
            const element = document.getElementById(id);

            if (!element) return "غير مذكور";

            return element.value.trim() || "غير مذكور";
        };

        const getRadio = (name) => {
            const selected = form.querySelector(
                `input[name="${name}"]:checked`
            );

            if (!selected) return "غير مذكور";

            return selected.value === "yes"
                ? "نعم"
                : selected.value === "no"
                ? "لا"
                : selected.value;
        };

        const getServices = () => {

            const selected = form.querySelectorAll(
                'input[name="services"]:checked'
            );

            if (selected.length === 0) {
                return "غير مذكور";
            }

            const serviceNames = {
                "full-management": "إدارة كاملة",
                "rent-collection": "تحصيل الإيجارات",
                "marketing-renting": "تسويق وتأجير",
                "maintenance": "متابعة الصيانة",
                "contracts": "إعداد العقود",
                "reports": "تقارير دورية"
            };

            return Array.from(selected)
                .map(service => serviceNames[service.value] || service.value)
                .join("، ");
        };

        const name = getValue("managementName");
        const phone = getValue("managementPhone");
        const propertyType = getValue("managementPropertyType");
        const location = getValue("managementLocation");
        const units = getValue("managementUnits");
        const income = getValue("managementIncome");
        const occupancy = getValue("managementOccupancy");
        const vacantUnits = getValue("managementVacantUnits");

        const arrears = getRadio("arrears");
        const documentedContracts = getRadio("documentedContracts");

        const services = getServices();

        const notes = getValue("managementNotes");

        const message = `
طلب عرض إدارة عقار

الاسم: ${name}
رقم التواصل: ${phone}

نوع العقار: ${propertyType}
الموقع: ${location}
عدد الوحدات: ${units}

الدخل الحالي: ${income}
نسبة الإشغال: ${occupancy}%
عدد الوحدات الشاغرة: ${vacantUnits}

هل توجد متأخرات؟ ${arrears}
هل توجد عقود موثقة؟ ${documentedContracts}

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
