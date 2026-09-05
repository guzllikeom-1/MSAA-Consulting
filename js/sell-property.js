/* =========================================
        MSAA CONSULTING
        SELL PROPERTY FORM
========================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================
            FILE UPLOADS
    ====================================== */

    const uploadBoxes =
        document.querySelectorAll(".upload-box");


    uploadBoxes.forEach((box) => {

        const input =
            box.querySelector('input[type="file"]');

        const text =
            box.querySelector("span");


        if(!input || !text){
            return;
        }


        /* حفظ النص الأصلي */

        const originalText =
            text.textContent.trim();


        input.addEventListener("change", () => {


            /* إذا لم يتم اختيار ملف */

            if(!input.files || input.files.length === 0){

                text.textContent =
                    originalText;

                box.classList.remove(
                    "file-selected"
                );

                return;

            }


            /* =================================
                    MULTIPLE IMAGES
            ================================== */

            if(input.multiple){

                const count =
                    input.files.length;


                if(count === 1){

                    text.textContent =
                        "تم اختيار صورة واحدة";

                }

                else if(count === 2){

                    text.textContent =
                        "تم اختيار صورتين";

                }

                else if(count >= 3 && count <= 10){

                    text.textContent =
                        `تم اختيار ${count} صور`;

                }

                else{

                    text.textContent =
                        `تم اختيار ${count} صورة`;

                }

            }


            /* =================================
                    SINGLE FILE
            ================================== */

            else{

                text.textContent =
                    input.files[0].name;

            }


            box.classList.add(
                "file-selected"
            );

        });

    });



    /* =====================================
            DECLARATION VALIDATION
    ====================================== */

    const form =
        document.getElementById(
            "sellPropertyForm"
        );


    const declaration =
        document.getElementById(
            "declaration"
        );


    const declarationBox =
        document.querySelector(
            ".form-declaration"
        );


    if(form && declaration){


        form.addEventListener(
            "submit",
            (event) => {


                /*
                    نمنع الإرسال الحقيقي مؤقتًا
                    حتى يتم ربط النموذج
                    بقاعدة البيانات / Backend
                */

                event.preventDefault();


                /* التحقق من الإقرار */

                if(!declaration.checked){


                    if(declarationBox){

                        declarationBox.classList.add(
                            "error"
                        );

                    }


                    declaration.focus();


                    if(declarationBox){

                        declarationBox.scrollIntoView({

                            behavior:"smooth",

                            block:"center"

                        });

                    }


                    return;

                }


                /* إزالة حالة الخطأ */

                if(declarationBox){

                    declarationBox.classList.remove(
                        "error"
                    );

                }


                /*
                    النموذج جاهز هنا للإرسال
                    بعد ربط Backend لاحقًا
                */

                console.log(
                    "Sell property form validated successfully."
                );


            }
        );


        /* إزالة الخطأ فور تحديد الإقرار */

        declaration.addEventListener(
            "change",
            () => {


                if(
                    declaration.checked &&
                    declarationBox
                ){

                    declarationBox.classList.remove(
                        "error"
                    );

                }


            }
        );

    }


});