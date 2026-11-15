/* Live visitors + page-view logging for the public study pack (Supabase project ius-study-pack).
   Usage: <script src="../live.js" data-course="CS105"></script>  (hub: data-course="HUB")
   - Presence: every open page joins the Realtime channel "study-pack-live"; the badge shows how many are online.
   - Page views: one call to the rate-limited RPC log_view per page load (the server hashes the IP; no raw IPs).
   Only the public anon key is here; tables are closed to it and every function is rate-limited server-side. */
(function () {
  var SB_URL = "https://nkztuwugfppthefuvtdh.supabase.co", SB_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5renR1d3VnZnBwdGhlZnV2dGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ3NDAzMjEsImV4cCI6MjExMDMxNjMyMX0.Ox5MReU5jrsRbgRnK4c2WDvDhSbIjJQCUoKKg9wxTTY";
  var me = document.currentScript, COURSE = (me && me.dataset.course) || "HUB";
  window.STUDY_LIVE = { total: 0, byCourse: {}, listeners: [] };
  function badge() {
    var b = document.getElementById("liveBadge");
    if (!b) {
      b = document.createElement("div"); b.id = "liveBadge"; b.setAttribute("aria-live", "polite");
      b.style.cssText = "position:fixed;bottom:calc(58px + env(safe-area-inset-bottom,0px));left:14px;z-index:60;" +
        "background:rgba(16,22,29,.86);color:#fff;font:600 12px system-ui,sans-serif;padding:5px 10px;border-radius:999px;" +
        "display:flex;gap:6px;align-items:center;pointer-events:none";
      if (!document.getElementById("liveInline")) document.body.appendChild(b);
    }
    return document.getElementById("liveInline") || b;
  }
  function show() {
    var L = window.STUDY_LIVE, n = L.total, here = L.byCourse[COURSE] || 0, el = badge();
    el.innerHTML = '<span style="width:8px;height:8px;border-radius:50%;background:#2ecc71;display:inline-block"></span>' +
      (COURSE === "HUB" ? n + (n === 1 ? " person" : " people") + " studying now"
                        : here + " in " + COURSE + " · " + n + " online");
    L.listeners.forEach(function (f) { try { f(L); } catch (e) {} });
  }
  function start() {
    if (!window.supabase || !window.supabase.createClient) return;
    var sb = window.supabase.createClient(SB_URL, SB_ANON, { auth: { persistSession: false } });
    var page = (location.pathname.split("/").slice(-2).join("/") || "/").replace(/[^A-Za-z0-9/#._-]/g, "").slice(0, 60);
    sb.rpc("log_view", { p_course: COURSE, p_page: page }).then(function () {}, function () {});
    var key = Math.random().toString(36).slice(2);
    var ch = sb.channel("study-pack-live", { config: { presence: { key: key } } });
    ch.on("presence", { event: "sync" }, function () {
      var st = ch.presenceState(), by = {}, total = 0;
      Object.keys(st).forEach(function (k) { var m = st[k][0] || {}; total++; by[m.course] = (by[m.course] || 0) + 1; });
      window.STUDY_LIVE.total = total; window.STUDY_LIVE.byCourse = by; show();
    }).subscribe(function (status) { if (status === "SUBSCRIBED") ch.track({ course: COURSE }); });
    window.STUDY_LIVE.client = sb;
  }
  var s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/dist/umd/supabase.js";
  s.onload = start; document.head.appendChild(s);
})();
