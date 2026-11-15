/* Fall 2026 midterm timetable for the published courses — from the official
   "f26_midtermexams_ug_withrooms" PDF (IUS, received 16.11.2026). Times are Sarajevo time (CET, UTC+1).
   Rooms: the numbers in brackets are seats or list positions as printed (e.g. Sports Hall 1–109 = the first 109
   students on the list). Used by the hub (exam section) and by every course page (top venue bar). */
window.STUDY_EXAMS = [
  { code: "CS105",   name: "Advanced Programming",            day: "Sunday",    date: "2026-11-15", from: "12:30", to: "14:00", students: 152,
    rooms: ["Sports Hall (list 1–109)", "B F2.16 (43 seats)"] },
  { code: "CS313",   name: "Theory of Computation",           day: "Monday",    date: "2026-11-16", from: "14:15", to: "15:45", students: 40,
    rooms: ["B F2.16"] },
  { code: "CS498",   name: "Special Topics in CS I (Generative Deep Learning)", day: "Monday", date: "2026-11-16", from: "17:45", to: "19:15", students: 46,
    rooms: ["Sports Hall (list 1–46)"] },
  { code: "IE408",   name: "Project Management",              day: "Wednesday", date: "2026-11-18", from: "10:45", to: "12:15", students: 158,
    rooms: ["Sports Hall (list 1–140)", "B F1.9 (20 seats)"] },
  { code: "MATH204", name: "Discrete Mathematics",            day: "Friday",    date: "2026-11-20", from: "16:00", to: "17:30", students: 236,
    rooms: ["Sports Hall (150)", "B F2.4 (30)", "B F2.5 (30)", "B F2.6 (30)"] }
];
(function () {
  function at(e, t) { return new Date(e.date + "T" + t + ":00+01:00"); }
  function status(e) {
    var now = new Date(), s = at(e, e.from), f = at(e, e.to);
    if (now > f) return { k: "done", t: "Finished" };
    if (now >= s) return { k: "now", t: "In progress now" };
    var d0 = new Date(now.toLocaleDateString("en-CA", { timeZone: "Europe/Sarajevo" }) + "T00:00:00+01:00");
    var days = Math.round((new Date(e.date + "T00:00:00+01:00") - d0) / 864e5);
    var h = Math.floor((s - now) / 36e5), m = Math.floor((s - now) / 6e4) % 60;
    if (days === 0) return { k: "today", t: "Today · starts in " + (h ? h + " h " : "") + m + " min" };
    if (days === 1) return { k: "soon", t: "Tomorrow" };
    return { k: "later", t: "In " + days + " days" };
  }
  function nice(e) { return e.day.slice(0, 3) + " " + e.date.slice(8, 10) + "." + e.date.slice(5, 7) + " · " + e.from + "–" + e.to; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  window.STUDY_EXAM_STATUS = status; window.STUDY_EXAM_NICE = nice;
  // course page: slim bar at the top with this course's venue
  var me = document.currentScript, code = me && me.dataset.course;
  if (code && code !== "HUB") {
    var e = window.STUDY_EXAMS.filter(function (x) { return x.code === code; })[0];
    if (!e) return;
    var st = status(e);
    if (st.k === "done") return;
    var bar = document.createElement("div");
    var col = { now: "#B5179E", today: "#D9480F", soon: "#D9480F", later: "#1F4E8C" }[st.k];
    bar.style.cssText = "position:sticky;top:0;z-index:70;background:" + col + ";color:#fff;font:600 13px/1.4 system-ui,sans-serif;" +
      "padding:8px 14px;padding-top:calc(8px + env(safe-area-inset-top,0px));display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;justify-content:center;text-align:center";
    bar.innerHTML = "<span>📍 <b>" + esc(e.code) + " midterm</b> · " + esc(nice(e)) + "</span><span>" + esc(e.rooms.join(" · ")) +
      "</span><span style='background:rgba(255,255,255,.2);border-radius:999px;padding:2px 10px'>" + esc(st.t) + "</span>";
    document.body.insertBefore(bar, document.body.firstChild);
  }
})();
