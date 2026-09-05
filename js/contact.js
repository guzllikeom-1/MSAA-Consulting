/* =====================================================
                    CONTACT PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const summary =
        document.getElementById("requestSummary");

    const form =
        document.getElementById("contactForm");
	
const toast =
document.getElementById("toast");

const toastText =
document.getElementById("toastText");
		
	/* ===========================================
        Success Modal
=========================================== */

const successModal =
    document.getElementById("successModal");

const modalSummary =
    document.getElementById("modalSummary");

const sendWhatsapp =
    document.getElementById("sendWhatsapp");
	
const closeModal =
document.getElementById("closeModal");

    /* ===========================================
            Load Data
    =========================================== */

    const consultationData =
        JSON.parse(
            localStorage.getItem("consultationData")
        ) || {};

    const appointmentData =
        JSON.parse(
            localStorage.getItem("appointmentData")
        ) || {};

    /* ===========================================
            Summary
    =========================================== */

    summary.innerHTML = `

        <p>
        <strong>نوع الاستشارة:</strong>
        ${consultationData.consultation || "-"}
        </p>

        <p>
        <strong>المدة:</strong>
        ${consultationData.duration || "-"}
        </p>

        <p>
        <strong>طريقة الاجتماع:</strong>
        ${consultationData.meeting || "-"}
        </p>

        <hr>

        <p>
        <strong>اليوم:</strong>
        ${appointmentData.date
            ? new Date(
                appointmentData.date
              ).toLocaleDateString("ar-OM")
            : "-"}
        </p>

        <p>
        <strong>الفترة:</strong>
        ${appointmentData.period || "-"}
        </p>

        <p>
        <strong>الوقت:</strong>
        ${appointmentData.time || "-"}
        </p>

    `;

    /* ===========================================
            Submit
    =========================================== */

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const fullName =
            document.getElementById("fullName").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const city =
            document.getElementById("city").value.trim();

        const notes =
            document.getElementById("notes").value.trim();

        const agree =
            document.getElementById("agree").checked;

        if (!fullName) {

            alert("يرجى إدخال الاسم الكامل.");

            return;

        }

        if (!phone) {

            alert("يرجى إدخال رقم الهاتف.");

            return;

        }

        if (!agree) {

            alert("يرجى الموافقة على سياسة التواصل.");

            return;

        }

        /* =======================================
        WhatsApp Message
======================================= */

const message = `

📩 طلب استشارة عقارية جديد

━━━━━━━━━━━━━━━━━━

👤 بيانات العميل

• الاسم: ${fullName}

• الهاتف: ${phone}

• البريد الإلكتروني:
${email || "غير مذكور"}

• المدينة:
${city || "غير مذكورة"}

━━━━━━━━━━━━━━━━━━

🏢 تفاصيل الاستشارة

• نوع الاستشارة:
${consultationData.consultation || "-"}

• مدة الجلسة:
${consultationData.duration || "-"}

• طريقة الاجتماع:
${consultationData.meeting || "-"}

━━━━━━━━━━━━━━━━━━

📅 الموعد

• اليوم:
${appointmentData.date || "-"}

• الفترة:
${appointmentData.period || "-"}

• الوقت:
${appointmentData.time || "-"}

━━━━━━━━━━━━━━━━━━

📝 ملاحظات العميل

${notes || "لا توجد ملاحظات"}

`;

const encodedMessage =
    encodeURIComponent(message);

/* =======================================
        WhatsApp Number
======================================= */



const whatsappNumber = "96895691806";

/* =======================================
        Show Success Modal
======================================= */

modalSummary.innerHTML = `

<p><strong>نوع الاستشارة:</strong>
${consultationData.consultation}</p>

<p><strong>الموعد:</strong>
${appointmentData.date}</p>

<p><strong>الوقت:</strong>
${appointmentData.time}</p>

<p><strong>طريقة الاجتماع:</strong>
${consultationData.meeting}</p>

`;

successModal.classList.add("show");


/* =======================================
        WhatsApp Button
======================================= */

sendWhatsapp.onclick = () => {

    window.open(

    `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,

    "_blank"

    );
	
	successModal.classList.remove("show");

successModal.classList.remove("show");

toastText.textContent =
"تم فتح واتساب. شكراً لك، سيتم التواصل معك قريبًا.";

toast.classList.add("show");

setTimeout(()=>{

    toast.classList.remove("show");

},3000);

    localStorage.removeItem("consultationData");

    localStorage.removeItem("appointmentData");

    form.reset();

};

    });

});
/* ===========================================
        Close Modal
=========================================== */

closeModal.onclick = () => {

    successModal.classList.remove("show");

};


successModal.addEventListener("click",(e)=>{

    if(e.target===successModal){

        successModal.classList.remove("show");

    }

});
