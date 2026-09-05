const SUPABASE_URL = "https://rfgrzpcyzbcjlsdbbddl.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_ubjm3pVBz4Zmddmy5TCUrQ_hV28N4FG";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =====================================================
                    APPOINTMENT PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const calendarGrid =
        document.getElementById("calendarGrid");

    const timeGrid =
        document.getElementById("timeGrid");

    const summaryContent =
        document.getElementById("summaryContent");

    const confirmBtn =
        document.getElementById("confirmAppointment");

    const periodButtons =
        document.querySelectorAll(".period-btn");


    /* =====================================================
                    CHECK ELEMENTS
    ===================================================== */

    if (
        !calendarGrid ||
        !timeGrid ||
        !summaryContent ||
        !confirmBtn
    ) {

        console.error(
            "Appointment elements not found."
        );

        return;
    }


    /* =====================================================
                    SELECTED DATA
    ===================================================== */

    let selectedDate = null;
    let selectedPeriod = null;
    let selectedTime = null;


    /* =====================================================
                    AVAILABLE TIMES
    ===================================================== */

    const morningTimes = [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30"
    ];


    const eveningTimes = [
        "04:00",
        "04:30",
        "05:00",
        "05:30",
        "06:00",
        "06:30"
    ];


    /* =====================================================
                    ARABIC DAYS
    ===================================================== */

    const dayNames = [
        "الأحد",
        "الإثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
        "السبت"
    ];


    /* =====================================================
                    CONSULTATION DATA
    ===================================================== */

    let consultationData = {};

    const savedData =
        localStorage.getItem("consultationData");


    if (savedData) {

        try {

            consultationData =
                JSON.parse(savedData);

        } catch (error) {

            console.error(
                "Error reading consultationData:",
                error
            );

        }

    }


    /* =====================================================
                    GENERATE CALENDAR
    ===================================================== */

    generateCalendar();


    function generateCalendar() {

        calendarGrid.innerHTML = "";

        const today = new Date();


        for (let i = 0; i < 14; i++) {

            const date = new Date();

            date.setHours(
                12,
                0,
                0,
                0
            );

            date.setDate(
                today.getDate() + i
            );


            const card =
                document.createElement("div");


            card.className =
                "calendar-day";


            card.dataset.date =
                date.toISOString();


            card.innerHTML = `

                <span class="day-name">
                    ${dayNames[date.getDay()]}
                </span>

                <span class="day-number">
                    ${date.getDate()}
                </span>

            `;


            card.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".calendar-day")
                        .forEach(day => {

                            day.classList.remove(
                                "active"
                            );

                        });


                    card.classList.add("active");


                    selectedDate = date;


                    updateSummary();

                }
            );


            calendarGrid.appendChild(card);

        }

    }


    /* =====================================================
                    PERIOD SELECTION
    ===================================================== */

    periodButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                periodButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                selectedPeriod =
                    button.dataset.period;


                selectedTime = null;


                generateTimes();


                updateSummary();

            }
        );

    });


    /* =====================================================
                    GENERATE TIMES
    ===================================================== */

    function generateTimes() {

        timeGrid.innerHTML = "";


        let times = [];


        if (
            selectedPeriod === "صباح"
        ) {

            times = morningTimes;

        } else {

            times = eveningTimes;

        }


        times.forEach(time => {

            const btn =
                document.createElement(
                    "button"
                );


            btn.type = "button";


            btn.className =
                "time-btn";


            btn.textContent =
                time;


            btn.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".time-btn")
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    btn.classList.add(
                        "active"
                    );


                    selectedTime = time;


                    updateSummary();

                }
            );


            timeGrid.appendChild(btn);

        });

    }


    /* =====================================================
                    UPDATE SUMMARY
    ===================================================== */

    function updateSummary() {

        summaryContent.innerHTML = `

            <p>
                <strong>
                    نوع الاستشارة:
                </strong>

                ${consultationData.consultation || "-"}
            </p>


            <p>
                <strong>
                    المدة:
                </strong>

                ${consultationData.duration || "-"}
            </p>


            <p>
                <strong>
                    طريقة الاجتماع:
                </strong>

                ${consultationData.meeting || "-"}
            </p>


            <hr>


            <p>
                <strong>
                    اليوم:
                </strong>

                ${
                    selectedDate
                    ? selectedDate.toLocaleDateString(
                        "ar-OM"
                    )
                    : "-"
                }
            </p>


            <p>
                <strong>
                    الفترة:
                </strong>

                ${selectedPeriod || "-"}
            </p>


            <p>
                <strong>
                    الوقت:
                </strong>

                ${selectedTime || "-"}
            </p>

        `;

    }


    updateSummary();


    /* =====================================================
                    CONFIRM APPOINTMENT
    ===================================================== */

    confirmBtn.addEventListener(
        "click",
        () => {


            /* =================================================
                        VALIDATE
            ================================================= */

            if (!selectedDate) {

                alert(
                    "يرجى اختيار اليوم."
                );

                return;

            }


            if (!selectedPeriod) {

                alert(
                    "يرجى اختيار الفترة."
                );

                return;

            }


            if (!selectedTime) {

                alert(
                    "يرجى اختيار الوقت."
                );

                return;

            }

// =====================================
// بيانات العميل
// =====================================

const clientNameInput =
    document.getElementById("clientName");

const clientPhoneInput =
    document.getElementById("clientPhone");

const clientEmailInput =
    document.getElementById("clientEmail");


if (
    !clientNameInput ||
    !clientNameInput.value.trim()
) {
    alert("يرجى إدخال الاسم الكامل.");
    return;
}


if (
    !clientPhoneInput ||
    !clientPhoneInput.value.trim()
) {
    alert("يرجى إدخال رقم الهاتف.");
    return;
}


if (
    !clientEmailInput ||
    !clientEmailInput.value.trim()
) {
    alert("يرجى إدخال البريد الإلكتروني.");
    return;
}

            /* =================================================
                        APPOINTMENT DATA
            ================================================= */

            const appointmentData = {

                consultation:
                    consultationData.consultation || "",

                duration:
                    consultationData.duration || "",

                meeting:
                    consultationData.meeting || "",

                date:
                    selectedDate.toISOString(),

                period:
                    selectedPeriod,

                time:
                    selectedTime,

client_name:
        clientNameInput.value.trim(),

    client_phone:
        clientPhoneInput.value.trim(),

    client_email:
        clientEmailInput.value.trim(),

                status:
                    "waiting-payment"

            };


            /* =================================================
                        LOCAL STORAGE BACKUP
            ================================================= */

            localStorage.setItem(
                "appointmentData",
                JSON.stringify(
                    appointmentData
                )
            );


            /* =================================================
                        GET MODAL
            ================================================= */

            const modal =
                document.getElementById(
                    "appointmentModal"
                );


            const result =
                document.getElementById(
                    "appointmentResult"
                );


            if (!modal || !result) {

                alert(
                    "لم يتم العثور على نافذة تأكيد الموعد."
                );

                console.error(
                    "appointmentModal or appointmentResult not found."
                );

                return;

            }


            /* =================================================
                        PAYMENT SCREEN
            ================================================= */

            result.innerHTML = `

                <div class="payment-section">


                    <div class="payment-icon">

                        <i class="fa-solid fa-credit-card"></i>

                    </div>


                    <h2>
                        تفاصيل الدفع وتأكيد الحجز
                    </h2>


                    <p class="payment-intro">

                        عزيزي العميل، لإتمام وتأكيد حجزك
                        يرجى تحويل مبلغ الاستشارة عبر التحويل السريع.

                    </p>


                    <div class="payment-box">


                        <div class="payment-row">

                            <span>
                                مبلغ الاستشارة
                            </span>

                            <strong>
                                45 ر.ع
                            </strong>

                        </div>


                        <div class="payment-transfer">

                            <div>

                                <span>
                                    التحويل السريع إلى الرقم
                                </span>


                                <strong
                                    class="payment-number"
                                    dir="ltr"
                                >
                                    98999835
                                </strong>

                            </div>


                            <button
                                type="button"
                                class="copy-payment-btn"
                                id="copyPaymentNumber"
                            >
                                نسخ الرقم
                            </button>

                        </div>


                        <div class="payment-name">

                            <span>
                                اسم المستفيد
                            </span>


                            <strong>
                                محمد سيف
                            </strong>

                        </div>


                        <div class="payment-note">

                            <i class="fa-solid fa-circle-info"></i>


                            <span>
                                بعد التحويل يرجى إرفاق صورة واضحة من الإيصال.
                            </span>

                        </div>

                    </div>


                    <!-- RECEIPT -->

                    <div class="receipt-section">


                        <h3>

                            إيصال التحويل

                            <span>
                                (مطلوب)
                            </span>

                        </h3>


                        <label
                            for="receiptUpload"
                            class="receipt-upload"
                        >

                            <i class="fa-solid fa-cloud-arrow-up"></i>


                            <strong>
                                اضغط لإرفاق صورة الإيصال
                            </strong>


                            <small>
                                PNG / JPG / JPEG
                            </small>

                        </label>


                        <input
                            type="file"
                            id="receiptUpload"
                            accept="image/png,image/jpeg,image/jpg"
                            hidden
                        >


                        <p
                            id="receiptName"
                            class="receipt-name"
                        ></p>

                    </div>


                    <!-- APPOINTMENT SUMMARY -->

                    <div class="payment-appointment-summary">


                        <h3>
                            تفاصيل الموعد
                        </h3>


                        <p>

                            <strong>
                                نوع الاستشارة:
                            </strong>

                            <span>
                                ${appointmentData.consultation}
                            </span>

                        </p>


                        <p>

                            <strong>
                                المدة:
                            </strong>

                            <span>
                                ${appointmentData.duration}
                            </span>

                        </p>


                        <p>

                            <strong>
                                طريقة الاجتماع:
                            </strong>

                            <span>
                                ${appointmentData.meeting}
                            </span>

                        </p>


                        <p>

                            <strong>
                                اليوم:
                            </strong>

                            <span>
                                ${selectedDate.toLocaleDateString("ar-OM")}
                            </span>

                        </p>


                        <p>

                            <strong>
                                الفترة:
                            </strong>

                            <span>
                                ${selectedPeriod}
                            </span>

                        </p>


                        <p>

                            <strong>
                                الوقت:
                            </strong>

                            <span>
                                ${selectedTime}
                            </span>

                        </p>

                    </div>


                    <!-- SEND BOOKING -->

                    <button
                        type="button"
                        class="send-booking-btn"
                        id="sendBookingBtn"
                    >

                        <i class="fa-solid fa-paper-plane"></i>

                        إرسال طلب الحجز

                    </button>


                    <p class="payment-warning">

                        لن يتم اعتماد الحجز حتى تتم مراجعة
                        الإيصال وتأكيد الدفع.

                    </p>


                </div>

            `;


            /* =================================================
                        SHOW MODAL
            ================================================= */

            modal.classList.add(
                "show"
            );


            /* =================================================
                        COPY PAYMENT NUMBER
            ================================================= */

            const copyBtn =
                document.getElementById(
                    "copyPaymentNumber"
                );


            if (copyBtn) {

                copyBtn.addEventListener(
                    "click",
                    () => {

                        const number =
                            "98999835";


                        navigator.clipboard
                            .writeText(number)
                            .then(() => {

                                copyBtn.textContent =
                                    "تم النسخ ✓";


                                setTimeout(
                                    () => {

                                        copyBtn.textContent =
                                            "نسخ الرقم";

                                    },
                                    2000
                                );

                            })
                            .catch(() => {

                                alert(
                                    "تعذر نسخ الرقم، يرجى نسخه يدويًا: 98999835"
                                );

                            });

                    }
                );

            }


            /* =================================================
                        RECEIPT UPLOAD
            ================================================= */

            const receiptUpload =
                document.getElementById(
                    "receiptUpload"
                );


            const receiptName =
                document.getElementById(
                    "receiptName"
                );


            if (receiptUpload) {

                receiptUpload.addEventListener(
                    "change",
                    () => {

                        if (
                            receiptUpload.files &&
                            receiptUpload.files.length > 0
                        ) {

                            const file =
                                receiptUpload.files[0];


                            if (receiptName) {

                                receiptName.textContent =
                                    "تم اختيار: " +
                                    file.name;

                            }

                        }

                    }
                );

            }


            /* =================================================
                    SEND BOOKING TO SUPABASE
            ================================================= */

            const sendBookingBtn =
                document.getElementById(
                    "sendBookingBtn"
                );


            if (sendBookingBtn) {

                sendBookingBtn.addEventListener(
                    "click",
                    async () => {


                        /* =====================================
                                CHECK RECEIPT
                        ===================================== */

                        if (
                            !receiptUpload ||
                            !receiptUpload.files ||
                            !receiptUpload.files.length
                        ) {

                            alert(
                                "يرجى إرفاق صورة إيصال التحويل أولاً."
                            );

                            return;

                        }


                        const file =
                            receiptUpload.files[0];


                        /* =====================================
                                CHECK FILE TYPE
                        ===================================== */

                        const allowedTypes = [
                            "image/png",
                            "image/jpeg",
                            "image/jpg"
                        ];


                        if (
                            !allowedTypes.includes(
                                file.type
                            )
                        ) {

                            alert(
                                "يرجى اختيار صورة بصيغة PNG أو JPG أو JPEG."
                            );

                            return;

                        }


                        /* =====================================
                                CHECK FILE SIZE
                        ===================================== */

                        const maxSize =
                            5 * 1024 * 1024;


                        if (
                            file.size > maxSize
                        ) {

                            alert(
                                "حجم الإيصال يجب أن يكون أقل من 5 MB."
                            );

                            return;

                        }


                        /* =====================================
                                DISABLE BUTTON
                        ===================================== */

                        sendBookingBtn.disabled =
                            true;


                        sendBookingBtn.innerHTML =
                            '<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال الطلب...';


                        try {


/* =================================
        SEND TO EDGE FUNCTION
================================= */

const formData = new FormData();

/* بيانات الحجز */

formData.append(
    "consultation",
    appointmentData.consultation || ""
);

formData.append(
    "duration",
    appointmentData.duration || ""
);

formData.append(
    "meeting",
    appointmentData.meeting || ""
);

formData.append(
    "date",
    appointmentData.date || ""
);

formData.append(
    "period",
    appointmentData.period || ""
);

formData.append(
    "time",
    appointmentData.time || ""
);

formData.append(
    "clientName",
    appointmentData.client_name || ""
);

formData.append(
    "clientPhone",
    appointmentData.client_phone || ""
);

formData.append(
    "clientEmail",
    appointmentData.client_email || ""
);

/* إيصال الدفع */

formData.append(
    "receipt",
    file,
    file.name
);


/* =================================
        CALL EDGE FUNCTION
================================= */

const functionUrl =
    `${SUPABASE_URL}/functions/v1/submit-appointment`;


const functionResponse =
    await fetch(
        functionUrl,
        {
            method: "POST",

            headers: {
                "apikey":
                    SUPABASE_ANON_KEY,

                "Authorization":
                    `Bearer ${SUPABASE_ANON_KEY}`
            },

            body: formData
        }
    );


/* =================================
        READ RESPONSE
================================= */

let functionData = null;

try {

    functionData =
        await functionResponse.json();

} catch {

    throw new Error(
        "تعذر قراءة استجابة النظام."
    );

}


/* =================================
        EDGE FUNCTION ERROR
================================= */

if (
    !functionResponse.ok ||
    !functionData ||
    !functionData.success
) {

    console.error(
        "Edge Function error:",
        functionData
    );

    throw new Error(
        functionData?.message ||
        "تعذر إرسال طلب الحجز."
    );

}


/* =================================
        SUCCESS DATA
================================= */

const savedAppointment = {
    id:
        functionData.appointmentId,

    receipt_path:
        functionData.receiptPath
};


/* =================================
        LOCAL BACKUP
================================= */

appointmentData.status =
    "payment-receipt-submitted";


appointmentData.receipt_url =
    functionData.receiptPath;


appointmentData.supabase_id =
    functionData.appointmentId;


localStorage.setItem(
    "appointmentData",
    JSON.stringify(
        appointmentData
    )
);




                            /* =================================
                                    SUCCESS
                            ================================= */

                            result.innerHTML = `

                                <div class="booking-success">


                                    <div class="success-icon">

                                        <i class="fa-solid fa-check"></i>

                                    </div>


                                    <h2>
                                        تم إرسال طلب الحجز
                                    </h2>


                                    <p>

                                        تم استلام طلبك وإيصال التحويل بنجاح،
                                        وتم حفظ الحجز في النظام.
                                        سيتم مراجعة الدفع والتواصل معك
                                        لتأكيد الموعد.

                                    </p>


                                    <div class="success-summary">


                                        <p>

                                            <strong>
                                                نوع الاستشارة:
                                            </strong>

                                            <span>
                                                ${appointmentData.consultation}
                                            </span>

                                        </p>


                                        <p>

                                            <strong>
                                                اليوم:
                                            </strong>

                                            <span>
                                                ${selectedDate.toLocaleDateString("ar-OM")}
                                            </span>

                                        </p>


                                        <p>

                                            <strong>
                                                الوقت:
                                            </strong>

                                            <span>
                                                ${selectedTime}
                                            </span>

                                        </p>


                                    </div>


                                    <button
                                        type="button"
                                        class="back-home-btn"
                                        onclick="window.location.href='../index.html'"
                                    >

                                        العودة للرئيسية

                                    </button>


                                </div>

                            `;


                            console.log(
                                "Appointment saved successfully:",
                                savedAppointment
                            );


                        } catch (error) {


                            console.error(
                                "Booking error:",
                                error
                            );


                            alert(
                                error.message ||
                                "حدث خطأ أثناء إرسال الحجز. يرجى المحاولة مرة أخرى."
                            );


                            /* =========================
                                    ENABLE BUTTON
                            ========================= */

                            sendBookingBtn.disabled =
                                false;


                            sendBookingBtn.innerHTML = `

                                <i class="fa-solid fa-paper-plane"></i>

                                إرسال طلب الحجز

                            `;

                        }

                    }
                );

            }

        }

    );

});




