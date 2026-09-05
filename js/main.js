
document.addEventListener("DOMContentLoaded", function () {

    const governorateSelect =
        document.getElementById("property-governorate");

    const stateSelect =
        document.getElementById("property-state");


    /* =========================================
            ولايات سلطنة عُمان
    ========================================= */

    const wilayas = {

        "مسقط": [
            "مسقط",
            "مطرح",
            "بوشر",
            "السيب",
            "العامرات",
            "قريات"
        ],

        "ظفار": [
            "صلالة",
            "طاقة",
            "مرباط",
            "ثمريت",
            "مقشن",
            "سدح",
            "شليم وجزر الحلانيات",
            "رخيوت",
            "ضلكوت",
            "المزيونة"
        ],

        "شمال الباطنة": [
            "صحار",
            "شناص",
            "لوى",
            "صحم",
            "الخابورة",
            "السويق"
        ],

        "جنوب الباطنة": [
            "الرستاق",
            "العوابي",
            "نخل",
            "وادي المعاول",
            "المصنعة",
            "بركاء"
        ],

        "شمال الشرقية": [
            "إبراء",
            "المضيبي",
            "بدية",
            "القابل",
            "وادي بني خالد",
            "دماء والطائيين"
        ],

        "جنوب الشرقية": [
            "صور",
            "جعلان بني بو علي",
            "جعلان بني بو حسن",
            "الكامل والوافي",
            "مصيرة"
        ],

        "الداخلية": [
            "نزوى",
            "بهلاء",
            "منح",
            "الحمراء",
            "أدم",
            "إزكي",
            "سمائل",
            "بدبد"
        ],

        "الوسطى": [
            "هيماء",
            "محوت",
            "الدقم",
            "الجازر"
        ],

        "البريمي": [
            "البريمي",
            "محضة",
            "السنينة"
        ],

        "مسندم": [
            "خصب",
            "بخاء",
            "دبا",
            "مدحاء"
        ],

        "الظاهرة": [
            "عبري",
            "ينقل",
            "ضنك"
        ]

    };


    /* =========================================
            عند اختيار المحافظة
    ========================================= */

    governorateSelect.addEventListener("change", function () {

        const selectedGovernorate =
            this.value || this.options[this.selectedIndex].textContent.trim();


        /* تفريغ الولايات القديمة */

        stateSelect.innerHTML = `
            <option value="">
                اختر الولاية
            </option>
        `;


        /* إذا لم يتم اختيار محافظة */

        if (!selectedGovernorate || !wilayas[selectedGovernorate]) {
            return;
        }


        /* إضافة ولايات المحافظة */

        wilayas[selectedGovernorate].forEach(function (wilaya) {

            const option =
                document.createElement("option");

            option.value = wilaya;

            option.textContent = wilaya;

            stateSelect.appendChild(option);

        });

    });

});

