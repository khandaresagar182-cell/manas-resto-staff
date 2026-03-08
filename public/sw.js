const CACHE_NAME = "manas-resto-v1";

// App shell files to cache for offline use
const STATIC_ASSETS = [
    "/",
    "/manifest.json",
    "/logo.png",
];

// ── Install: cache static assets ─────────────────────────────
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// ── Activate: clear old caches ────────────────────────────────
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_NAME)
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

// ── Fetch: Network-first with cache fallback ──────────────────
self.addEventListener("fetch", (event) => {
    // Skip non-GET and browser-extension requests
    if (event.request.method !== "GET") return;
    if (!event.request.url.startsWith("http")) return;

    // For navigation requests (HTML pages) — network first, cache fallback
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match("/") || caches.match(event.request))
        );
        return;
    }

    // For static assets — cache first, network fallback
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            return fetch(event.request).then((response) => {
                // Cache successful responses for Next.js chunks and assets
                if (
                    response.ok &&
                    (event.request.url.includes("/_next/") ||
                        event.request.url.includes("/logo") ||
                        event.request.url.includes("/manifest"))
                ) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            });
        })
    );
});

// ── Push notifications ────────────────────────────────────────
self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "Manas Resto";
    const options = {
        body: data.body || "You have a new notification",
        icon: "/logo.png",
        badge: "/logo.png",
        tag: data.tag || "manas-notif",
        data: { url: data.url || "/" },
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// ── Notification click ────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window" }).then((windowClients) => {
            for (const client of windowClients) {
                if (client.url === "/" && "focus" in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow("/");
        })
    );
});
