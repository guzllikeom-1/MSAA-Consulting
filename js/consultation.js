/* ==========================================
        CONSULTATION PAGE
========================================== */

document.addEventListener("DOMContentLoaded",()=>{


    const chooseBtn=
    document.getElementById("chooseAppointmentBtn");


    if(!chooseBtn) return;


    chooseBtn.addEventListener("click",()=>{


        /* ===============================
            Validate Required Choices
        =============================== */

        const consultation=

        document.querySelector(
        'input[name="consultation-type"]:checked');


        const duration=

        document.querySelector(
        'input[name="duration"]:checked');


        const meeting=

        document.querySelector(
        'input[name="meeting"]:checked');


        if(
            !consultation ||
            !duration ||
            !meeting
        ){

            alert(
`يرجى اختيار نوع الاستشارة ومدة الجلسة وطريقة الاجتماع أولاً.`
            );

            return;

        }


        /* ===============================
            Save Selection
        =============================== */

        const consultationData={

            consultation:
            consultation.value,

            duration:
            duration.value,

            meeting:
            meeting.value

        };


        localStorage.setItem(

            "consultationData",

            JSON.stringify(
                consultationData
            )

        );


        /* ===============================
            Next Step
        =============================== */

        window.location.href=
        "appointment.html";


    });


});