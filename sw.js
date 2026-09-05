self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  const title = data.title || "MSAA Consulting";

  const options = {
    body: data.body || "وصل حجز جديد إلى الموقع.",
    icon: "/images/logo.png",
    badge: "/images/logo.png",
    data: {
      url: data.url || "/pages/admin.html"
    },
    dir: "rtl",
    lang: "ar"
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const url = event.notification.data?.url || "/pages/admin.html";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(clientList => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      return clients.openWindow(url);
    })
  );
});