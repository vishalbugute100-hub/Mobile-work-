(function () {
  "use strict";

  var root = document.getElementById("root");

  function base64UrlDecode(str) {
    var b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    return decodeURIComponent(escape(atob(b64)));
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderEmpty() {
    root.innerHTML =
      '<div class="passport-card">' +
      '<p class="empty-note">No Passport data found in this link.</p>' +
      '<a class="btn btn-primary" href="dashboard.html">Build your Passport</a>' +
      "</div>";
  }

  function scoreColor(score) {
    if (score >= 80) return "#14b8a6";
    if (score >= 50) return "#f5b942";
    return "#ef4444";
  }

  function render(data) {
    var color = scoreColor(data.score);
    var credsHtml = (data.credentials || [])
      .map(function (c) {
        return (
          '<div class="cred-item"><span class="check">✓</span><div><strong>' +
          escapeHtml(c.label) +
          "</strong><div style=\"color:var(--ink-dim);font-size:13px\">" +
          escapeHtml(c.value) +
          "</div></div></div>"
        );
      })
      .join("");

    root.innerHTML =
      '<div class="passport-card">' +
      '<div class="avatar-lg"></div>' +
      "<h2>" + escapeHtml(data.name) + "</h2>" +
      '<div class="role">' + escapeHtml(data.trade) + "</div>" +
      '<div class="score-ring-lg" style="background: conic-gradient(' +
      color + " 0 " + data.score + "%, rgba(255,255,255,0.08) " + data.score + "% 100%)\">" +
      '<span><b style="color:' + color + '">' + data.score + "</b><small>TRUST SCORE</small></span>" +
      "</div>" +
      '<div class="cred-grid">' +
      (credsHtml || '<p class="empty-note">No verified credentials yet.</p>') +
      "</div>" +
      '<p style="color:var(--ink-dim);font-size:12.5px;">Verified via Passport · generated ' +
      new Date(data.generatedAt).toLocaleDateString() +
      "</p>" +
      '<a class="btn btn-ghost btn-sm" href="dashboard.html">Build your own Passport</a>' +
      "</div>";
  }

  function init() {
    var hash = location.hash || "";
    var match = hash.match(/data=([^&]+)/);
    if (!match) {
      renderEmpty();
      return;
    }
    try {
      var json = base64UrlDecode(match[1]);
      var data = JSON.parse(json);
      if (!data || typeof data.score !== "number") throw new Error("bad payload");
      render(data);
    } catch (e) {
      renderEmpty();
    }
  }

  init();
})();
