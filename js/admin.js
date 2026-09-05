(function () {
const SUPABASE_URL = "https://rfgrzpcyzbcjlsdbbddl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ubjm3pVBz4Zmddmy5TCUrQ_hV28N4FG";

// السعر الحالي للجلسة كما هو في نظام الحجز.
const CONSULTATION_PRICE_OMR = 45;

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const loginBtn = document.getElementById("loginBtn");
const appointmentsList = document.getElementById("appointmentsList");
const dashboardMessage = document.getElementById("dashboardMessage");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");
const searchInput = document.getElementById("searchInput");
const toast = document.getElementById("toast");
const realtimeStatus = document.getElementById("realtimeStatus");
const enableNotificationsBtn =
  document.getElementById("enableNotificationsBtn");

const VAPID_PUBLIC_KEY =
  "BF6Zwmp2u1SYsvwBYOdPYkdkFrhhwtwWDPYpKEOvftoaaAfDIy7KRaf8wnCpbzsvktMKP2j6fhEn7_1VrA1ENHg";


let appointments = [];
let currentFilter = "all";
let realtimeChannel = null;
let toastTimer = null;

const statusLabels = {
  "payment-receipt-submitted": "بانتظار مراجعة الدفع",
  confirmed: "مؤكد",
  rejected: "مرفوض",
  completed: "مكتمل",
  cancelled: "ملغي"
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusClass(status) {
  if (status === "payment-receipt-submitted") return "pending";
  return ["confirmed", "rejected", "completed", "cancelled"].includes(status)
    ? status
    : "";
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("ar-OM", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("ar-OM", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getLocalDateKey(dateValue = new Date()) {
  const d = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");
}

function getAppointmentDateKey(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return getLocalDateKey(d);
}

function getReceiptPath(value) {
  if (!value) return null;
  if (!value.startsWith("http")) return value;

  const marker = "/payment-receipts/";
  const index = value.indexOf(marker);

  return index >= 0
    ? decodeURIComponent(value.slice(index + marker.length).split("?")[0])
    : null;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

async function openReceipt(pathValue) {
  const path = getReceiptPath(pathValue);

  if (!path) {
    alert("لا يوجد مسار صالح للإيصال.");
    return;
  }

  const { data, error } = await supabase
    .storage
    .from("payment-receipts")
    .createSignedUrl(path, 300);

  if (error) {
    console.error("Receipt error:", error);
    alert("تعذر فتح الإيصال.");
    return;
  }

  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}

async function updateStatus(id, status) {
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Update status error:", error);
    alert("تعذر تحديث حالة الحجز.");
    return;
  }

  const item = appointments.find(a => String(a.id) === String(id));

  if (item) {
    item.status = status;
  }

  showToast(`تم تحديث حالة الحجز إلى: ${statusLabels[status] || status}`);
  render();
}

function getClientValue(a, keys) {
  for (const key of keys) {
    if (a && a[key] !== undefined && a[key] !== null && String(a[key]).trim() !== "") {
      return a[key];
    }
  }
  return "";
}

function clientDetails(a) {
  const name = getClientValue(a, ["client_name", "customer_name", "name", "full_name"]);
  const phone = getClientValue(a, ["client_phone", "customer_phone", "phone", "mobile"]);
  const email = getClientValue(a, ["client_email", "customer_email", "email"]);

  if (!name && !phone && !email) {
    return `
      <div class="detail client-detail">
        <small>بيانات العميل</small>
        <strong>سيتم إظهارها بعد إضافة بيانات العميل للحجز</strong>
      </div>
    `;
  }

  return `
    ${name ? `<div class="detail client-detail"><small>اسم العميل</small><strong>${escapeHtml(name)}</strong></div>` : ""}
    ${phone ? `<div class="detail client-detail"><small>رقم الهاتف</small><strong>${escapeHtml(phone)}</strong></div>` : ""}
    ${email ? `<div class="detail client-detail"><small>البريد الإلكتروني</small><strong>${escapeHtml(email)}</strong></div>` : ""}
  `;
}

function getAmount(a) {
  const raw = getClientValue(a, ["amount", "price", "payment_amount", "total_amount"]);
  const value = Number(raw);

  if (Number.isFinite(value) && value >= 0) return value;

  return statusIsConfirmed(a.status) ? CONSULTATION_PRICE_OMR : 0;
}

function statusIsConfirmed(status) {
  return status === "confirmed" || status === "completed";
}

function renderStats() {
  const todayKey = getLocalDateKey();

  const todayCount = appointments.filter(a => {
    const candidate = a.date || a.created_at;
    return getAppointmentDateKey(candidate) === todayKey;
  }).length;

  const confirmedCount = appointments.filter(
    a => a.status === "confirmed"
  ).length;

  const rejectedCount = appointments.filter(
    a => a.status === "rejected"
  ).length;

  const pendingCount = appointments.filter(
    a => a.status === "payment-receipt-submitted"
  ).length;

  const revenue = appointments
    .filter(a => statusIsConfirmed(a.status))
    .reduce((sum, a) => sum + getAmount(a), 0);

  document.getElementById("totalCount").textContent = appointments.length;
  document.getElementById("todayCount").textContent = todayCount;
  document.getElementById("pendingCount").textContent = pendingCount;
  document.getElementById("confirmedCount").textContent = confirmedCount;
  document.getElementById("rejectedCount").textContent = rejectedCount;
  document.getElementById("revenueCount").textContent =
    `${revenue.toFixed(3)} ر.ع`;
}

function matchesSearch(a) {
  const q = searchInput.value.trim().toLowerCase();

  if (!q) return true;

  const values = [
    a.consultation,
    a.duration,
    a.meeting,
    a.date,
    a.period,
    a.time,
    a.status,
    getClientValue(a, ["client_name", "customer_name", "name", "full_name"]),
    getClientValue(a, ["client_phone", "customer_phone", "phone", "mobile"]),
    getClientValue(a, ["client_email", "customer_email", "email"])
  ];

  return values.some(value =>
    String(value ?? "").toLowerCase().includes(q)
  );
}

function quickButton(label, className, id, status) {
  return `
    <button
      type="button"
      class="quick-btn ${className}"
      data-quick-id="${escapeHtml(id)}"
      data-quick-status="${escapeHtml(status)}"
    >
      ${label}
    </button>
  `;
}

function render() {
  renderStats();

  const filtered = appointments
    .filter(a => currentFilter === "all" || a.status === currentFilter)
    .filter(matchesSearch);

  if (!filtered.length) {
    appointmentsList.innerHTML =
      '<div class="empty">لا توجد حجوزات مطابقة حاليًا.</div>';
    return;
  }

  appointmentsList.innerHTML = filtered.map(a => {
    const status = a.status || "payment-receipt-submitted";

    return `
      <article class="appointment-card" data-appointment-id="${escapeHtml(a.id)}">

        <div class="card-top">
          <div>
            <div class="card-title-row">
              <h3>${escapeHtml(a.consultation || "استشارة")}</h3>
              <span class="status-badge ${statusClass(status)}">
                ${escapeHtml(statusLabels[status] || status)}
              </span>
            </div>

            <div class="card-id">ID: ${escapeHtml(a.id)}</div>
          </div>

          <div class="card-id">
            أُنشئ: ${escapeHtml(formatDateTime(a.created_at))}
          </div>
        </div>

        <div class="details-grid">

          ${clientDetails(a)}

          <div class="detail">
            <small>التاريخ</small>
            <strong>${escapeHtml(formatDate(a.date))}</strong>
          </div>

          <div class="detail">
            <small>الوقت</small>
            <strong>${escapeHtml(a.time || "—")}</strong>
          </div>

          <div class="detail">
            <small>الفترة</small>
            <strong>${escapeHtml(a.period || "—")}</strong>
          </div>

          <div class="detail">
            <small>المدة</small>
            <strong>${escapeHtml(a.duration || "—")}</strong>
          </div>

          <div class="detail">
            <small>طريقة الاجتماع</small>
            <strong>${escapeHtml(a.meeting || "—")}</strong>
          </div>

          <div class="detail">
            <small>قيمة الحجز</small>
            <strong>${getAmount(a) ? `${getAmount(a).toFixed(3)} ر.ع` : "—"}</strong>
          </div>

        </div>

        <div class="actions">

          ${
            a.receipt_url
              ? `<button type="button" class="receipt-btn" data-receipt="${escapeHtml(a.receipt_url)}">عرض الإيصال</button>`
              : `<span class="card-id">لا يوجد إيصال</span>`
          }

          ${
            status !== "confirmed"
              ? quickButton("تأكيد الحجز", "quick-confirm", a.id, "confirmed")
              : ""
          }

          ${
            status !== "rejected"
              ? quickButton("رفض", "quick-reject", a.id, "rejected")
              : ""
          }

          ${
            status !== "completed"
              ? quickButton("مكتمل", "quick-complete", a.id, "completed")
              : ""
          }

          ${
            status !== "cancelled"
              ? quickButton("إلغاء", "quick-cancel", a.id, "cancelled")
              : ""
          }

          <select
            class="status-select"
            data-status-id="${escapeHtml(a.id)}"
            aria-label="تغيير حالة الحجز"
          >
            ${Object.entries(statusLabels)
              .map(([value, label]) =>
                `<option value="${value}" ${value === status ? "selected" : ""}>${label}</option>`
              )
              .join("")}
          </select>

        </div>
      </article>
    `;
  }).join("");

  appointmentsList.querySelectorAll("[data-receipt]").forEach(btn => {
    btn.addEventListener("click", () => openReceipt(btn.dataset.receipt));
  });

  appointmentsList.querySelectorAll("[data-status-id]").forEach(select => {
    select.addEventListener("change", () =>
      updateStatus(select.dataset.statusId, select.value)
    );
  });

  appointmentsList.querySelectorAll("[data-quick-id]").forEach(btn => {
    btn.addEventListener("click", () =>
      updateStatus(btn.dataset.quickId, btn.dataset.quickStatus)
    );
  });
}

async function loadAppointments(showLoading = true) {
  if (showLoading) {
    dashboardMessage.textContent = "جاري تحميل الحجوزات...";
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Appointments error:", error);
    dashboardMessage.textContent =
      "تعذر تحميل الحجوزات. تأكدي من سياسات RLS.";
    return;
  }

  appointments = data || [];
  dashboardMessage.textContent = "";
  render();
}

function setRealtimeConnected(connected) {
  if (connected) {
    realtimeStatus.innerHTML = "<i></i> متصل";
    realtimeStatus.classList.add("connected");
  } else {
    realtimeStatus.innerHTML = "<i></i> التحديث المباشر غير متصل";
    realtimeStatus.classList.remove("connected");
  }
}

async function startRealtime() {
  if (realtimeChannel) {
    await supabase.removeChannel(realtimeChannel);
  }

  realtimeChannel = supabase
    .channel("admin-appointments-live")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "appointments"
      },
      payload => {
        const exists = appointments.some(
          a => String(a.id) === String(payload.new.id)
        );

        if (!exists) {
          appointments.unshift(payload.new);
          render();
          showToast("🔔 وصل حجز جديد!");
          const card = document.querySelector(
            `[data-appointment-id="${CSS.escape(String(payload.new.id))}"]`
          );
          if (card) card.classList.add("new-booking");
        }
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "appointments"
      },
      payload => {
        const index = appointments.findIndex(
          a => String(a.id) === String(payload.new.id)
        );

        if (index >= 0) {
          appointments[index] = payload.new;
          render();
        }
      }
    )
    .subscribe(status => {
      setRealtimeConnected(status === "SUBSCRIBED");
    });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map(char => char.charCodeAt(0))
  );
}

async function enablePushNotifications() {
  try {
    if (!("serviceWorker" in navigator)) {
      alert("هذا المتصفح لا يدعم إشعارات الجهاز.");
      return;
    }

    if (!("PushManager" in window)) {
      alert("إشعارات الجهاز غير مدعومة في هذا المتصفح.");
      return;
    }

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("يجب تسجيل الدخول أولًا.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("لم يتم السماح بإشعارات الجهاز.");
      return;
    }

    const registration =
      await navigator.serviceWorker.register("../sw.js");

    let subscription =
      await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
    }

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          user_id: user.id,
          endpoint: subscription.endpoint,
          subscription: subscription.toJSON(),
          user_agent: navigator.userAgent,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: "endpoint"
        }
      );

    if (error) {
      console.error("Push subscription error:", error);
      alert("تعذر حفظ إعدادات الإشعارات.");
      return;
    }

    enableNotificationsBtn.textContent =
      "🔔 الإشعارات مفعّلة";

    enableNotificationsBtn.disabled = true;

    showToast("🔔 تم تفعيل إشعارات الجهاز بنجاح!");

  } catch (error) {
    console.error("Push notification error:", error);
    alert("حدث خطأ أثناء تفعيل الإشعارات.");
  }
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault();

  loginError.textContent = "";
  loginBtn.disabled = true;
  loginBtn.textContent = "جاري تسجيل الدخول...";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("Login error:", error);
    loginError.textContent =
      "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    loginBtn.disabled = false;
    loginBtn.textContent = "تسجيل الدخول";
    return;
  }

  loginView.hidden = true;
  dashboardView.hidden = false;

  await loadAppointments();
  await startRealtime();

  loginBtn.disabled = false;
  loginBtn.textContent = "تسجيل الدخول";
});

logoutBtn.addEventListener("click", async () => {
  if (realtimeChannel) {
    await supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }

  await supabase.auth.signOut();

  dashboardView.hidden = true;
  loginView.hidden = false;
  loginForm.reset();
  setRealtimeConnected(false);
});

refreshBtn.addEventListener("click", () => loadAppointments());

enableNotificationsBtn.addEventListener(
  "click",
  enablePushNotifications
);

searchInput.addEventListener("input", render);

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".filter")
      .forEach(b => b.classList.remove("active"));

    button.classList.add("active");
    currentFilter = button.dataset.filter;
    render();
  });
});

supabase.auth.onAuthStateChange(async (_event, session) => {
  if (!session) {
    dashboardView.hidden = true;
    loginView.hidden = false;
    return;
  }

  loginView.hidden = true;
  dashboardView.hidden = false;

  if (!appointments.length) {
    await loadAppointments();
  }

  if (!realtimeChannel) {
    await startRealtime();
  }
});

async function checkSession() {
  const { data } = await supabase.auth.getSession();

  if (data.session) {
    loginView.hidden = true;
    dashboardView.hidden = false;
    await loadAppointments();
    await startRealtime();
  }
}

setRealtimeConnected(false);
checkSession();
})();