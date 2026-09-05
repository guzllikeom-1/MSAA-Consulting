/* =========================================
        MSAA CONSULTING
        BUY PROPERTY FORM
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =====================================
                FORM
        ====================================== */

        const form =
            document.getElementById(
                "buyPropertyForm"
            );


        if(!form){

            return;

        }



        /* =====================================
                RADIO OPTIONS
        ====================================== */

        const radioInputs =
            form.querySelectorAll(
                'input[type="radio"]'
            );


        radioInputs.forEach(
            (radio) => {


                radio.addEventListener(
                    "change",
                    () => {


                        /*
                            الحالة المرئية للاختيار
                            تتم أساسًا عبر CSS :checked

                            هذا الجزء يجعل المتصفح
                            يحدث الحالة فورًا بشكل طبيعي
                        */

                        const groupName =
                            radio.name;


                        const sameGroup =
                            form.querySelectorAll(
                                `input[name="${groupName}"]`
                            );


                        sameGroup.forEach(
                            (item) => {

                                item.setAttribute(
                                    "aria-checked",
                                    item.checked
                                        ? "true"
                                        : "false"
                                );

                            }
                        );


                    }
                );


            }
        );



        /* =====================================
                SUBMIT
        ====================================== */

        form.addEventListener(
            "submit",
            (event) => {


                /*
                    مهم:

                    النموذج غير مربوط حاليًا
                    بقاعدة بيانات أو Backend.

                    لذلك نمنع الإرسال الحقيقي
                    حتى لا يظهر للمستخدم أن
                    الطلب تم إرساله وهو لم يُرسل.
                */

                event.preventDefault();


                /*
                    هنا سنضع لاحقًا:

                    fetch()

                    أو الربط مع Backend

                    أو خدمة استقبال النماذج.
                */


                console.log(
                    "Buy property form is ready for backend connection."
                );


            }
        );


    }
);