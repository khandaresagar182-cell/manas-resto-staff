// ── Manas Resto PWA — Lifetime Service Worker ─────────────────────────────
//  Strategy:
//    • Navigation (HTML)  → Network-first, cache fallback (always gets latest)
//    • Next.js chunks/_next → Cache-first (content-hashed, safe forever)
//    • Images / manifest   → Stale-while-revalidate (serve fast, refresh bg)
//  Cache never expires on its own – entries survive until the app is updated.
// ──────────────────────────────────────────────────────────────────────────

const CACHE_NAME = "manas-resto-v3";
const STATIC_ASSETS = ["/", "/manifest.json", "/logo.png"];

// ── Install ───────────────────────────────────────────────────
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())          // activate immediately
    );
});

// ── Activate ──────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((k) => k !== CACHE_NAME)
                        .map((k) => caches.delete(k))
                )
            )
            .then(() => self.clients.claim())        // take control immediately
    );
});

// ── Helpers ───────────────────────────────────────────────────
function isNextChunk(url) {
    return url.includes("/_next/static/");
}

function isImage(url) {
    return /\.(png|jpg|jpeg|gif|svg|webp|ico)(\?.*)?$/.test(url);
}

function isNavigate(request) {
    return request.mode === "navigate";
}

// ── Fetch ─────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;
    const url = event.request.url;
    if (!url.startsWith("http")) return;

    // 1. Next.js content-hashed bundles → Cache-first (never stale)
    if (isNextChunk(url)) {
        event.respondWith(
            caches.match(event.request).then(
                (cached) =>
                    cached ||
                    fetch(event.request).then((res) => {
                        if (res.ok) {
                            const clone = res.clone();
                            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
                        }
                        return res;
                    })
            )
        );
        return;
    }

    // 2. Images & manifest → Stale-while-revalidate (instant + refreshes bg)
    if (isImage(url) || url.includes("/manifest")) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) =>
                cache.match(event.request).then((cached) => {
                    const network = fetch(event.request).then((res) => {
                        if (res.ok) cache.put(event.request, res.clone());
                        return res;
                    });
                    return cached || network;
                })
            )
        );
        return;
    }

    // 3. Navigation (HTML pages) → Network-first, fallback to cached shell
    if (isNavigate(event.request)) {
        event.respondWith(
            fetch(event.request)
                .then((res) => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
                    return res;
                })
                .catch(() => caches.match("/").then((c) => c || caches.match(event.request)))
        );
        return;
    }

    // 4. Everything else → Network with cache fallback
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});

// ── Push notifications ────────────────────────────────────────
self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};
    event.waitUntil(
        self.registration.showNotification(data.title || "Manas Resto", {
            body: data.body || "You have a new notification",
            icon: "/logo.png",
            badge: "/logo.png",
            tag: data.tag || "manas-notif",
            data: { url: data.url || "/" },
        })
    );
});

// ── Notification click ────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window" }).then((list) => {
            for (const c of list) {
                if ("focus" in c) return c.focus();
            }
            if (clients.openWindow) return clients.openWindow("/");
        })
    );
});
