/* =========================================
        MSAA CONSULTING
        PROPERTY MANAGEMENT FORM
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =====================================
                FORM
        ====================================== */

        const form =
            document.getElementById(
                "managementForm"
            );


        if(!form){

            return;

        }



        /* =====================================
                RADIO BUTTONS
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
                SERVICES CHECKBOXES
        ====================================== */

        const serviceInputs =
            form.querySelectorAll(
                '.management-service-card input[type="checkbox"]'
            );


        serviceInputs.forEach(
            (checkbox) => {


                checkbox.addEventListener(
                    "change",
                    () => {


                        checkbox.setAttribute(

                            "aria-checked",

                            checkbox.checked
                                ? "true"
                                : "false"

                        );


                    }
                );


            }
        );



        /* =====================================
                OCCUPANCY VALIDATION
        ====================================== */

        const occupancyInput =
            document.getElementById(
                "managementOccupancy"
            );


        if(occupancyInput){


            occupancyInput.addEventListener(
                "input",
                () => {


                    let value =
                        Number(
                            occupancyInput.value
                        );


                    if(value > 100){

                        occupancyInput.value =
                            100;

                    }


                    if(value < 0){

                        occupancyInput.value =
                            0;

                    }


                }
            );


        }



        /* =====================================
                VACANT UNITS CHECK
        ====================================== */

        const totalUnitsInput =
            document.getElementById(
                "managementUnits"
            );


        const vacantUnitsInput =
            document.getElementById(
                "managementVacantUnits"
            );


        if(
            totalUnitsInput &&
            vacantUnitsInput
        ){


            vacantUnitsInput.addEventListener(
                "input",
                () => {


                    const totalUnits =
                        Number(
                            totalUnitsInput.value
                        );


                    const vacantUnits =
                        Number(
                            vacantUnitsInput.value
                        );


                    if(
                        totalUnits >= 0 &&
                        vacantUnits > totalUnits &&
                        totalUnitsInput.value !== ""
                    ){

                        vacantUnitsInput.value =
                            totalUnits;

                    }


                }
            );


        }



        /* =====================================
                SUBMIT
        ====================================== */

        form.addEventListener(
            "submit",
            (event) => {


                /*
                    النموذج غير مربوط حاليًا
                    بقاعدة بيانات أو Backend.

                    لذلك نمنع الإرسال الحقيقي
                    حتى لا نعطي المستخدم انطباعًا
                    بأن الطلب تم استلامه فعليًا.
                */

                event.preventDefault();


                console.log(
                    "Property management form is ready for backend connection."
                );


            }
        );


    }
);