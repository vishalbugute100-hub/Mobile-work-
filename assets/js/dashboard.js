(function () {
  "use strict";

  var WEIGHTS = {
    id: 20,
    license: 30,
    reference: 15,
    rating: 15,
    jobs: 20
  };

  var LABELS = {
    id: "Government ID",
    license: "Trade License / Certification",
    reference: "Employer Reference",
    rating: "Imported Platform Rating",
    jobs: "Completed Jobs Count"
  };

  var credentials = [];
  var nextId = 1;

  var fullNameEl = document.getElementById("fullName");
  var tradeEl = document.getElementById("trade");
  var credListEl = document.getElementById("credList");
  var credTypeEl = document.getElementById("credType");
  var credValueEl = document.getElementById("credValue");
  var addCredBtn = document.getElementById("addCredBtn");
  var scoreBigEl = document.getElementById("scoreBig");
  var scoreMetaEl = document.getElementById("scoreMeta");
  var generateBtn = document.getElementById("generateBtn");
  var linkArea = document.getElementById("linkArea");
  var shareLinkEl = document.getElementById("shareLink");
  var copyBtn = document.getElementById("copyBtn");

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderCredentials() {
    credListEl.innerHTML = "";
    credentials.forEach(function (cred) {
      var row = document.createElement("div");
      row.className = "cred-row";

      var typeSpan = document.createElement("div");
      typeSpan.textContent = LABELS[cred.type];

      var valueSpan = document.createElement("div");
      valueSpan.textContent = cred.value;
      valueSpan.style.color = "var(--ink-dim)";
      valueSpan.style.fontSize = "13px";

      var statusSpan = document.createElement("div");
      statusSpan.className = "cred-status " + (cred.verified ? "verified" : "pending");

      if (cred.verified) {
        statusSpan.textContent = "✓ Verified";
      } else if (cred.verifying) {
        statusSpan.textContent = "Checking…";
      } else {
        var verifyBtn = document.createElement("button");
        verifyBtn.className = "btn btn-ghost btn-sm";
        verifyBtn.textContent = "Verify";
        verifyBtn.addEventListener("click", function () { verifyCredential(cred.id); });
        statusSpan.appendChild(verifyBtn);
      }

      var removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", function () { removeCredential(cred.id); });

      row.appendChild(typeSpan);
      row.appendChild(valueSpan);
      row.appendChild(statusSpan);
      row.appendChild(removeBtn);
      credListEl.appendChild(row);
    });
    updateScore();
  }

  function addCredential() {
    var type = credTypeEl.value;
    var value = credValueEl.value.trim();
    if (!value) {
      credValueEl.focus();
      return;
    }
    credentials.push({ id: nextId++, type: type, value: value, verified: false, verifying: false });
    credValueEl.value = "";
    renderCredentials();
  }

  function verifyCredential(id) {
    var cred = credentials.find(function (c) { return c.id === id; });
    if (!cred) return;
    cred.verifying = true;
    renderCredentials();
    // Simulated verification check (in production this calls real ID / license / employer APIs)
    setTimeout(function () {
      cred.verifying = false;
      cred.verified = true;
      renderCredentials();
    }, 700);
  }

  function removeCredential(id) {
    credentials = credentials.filter(function (c) { return c.id !== id; });
    renderCredentials();
  }

  function computeScore() {
    var score = 0;
    credentials.forEach(function (c) {
      if (c.verified) score += WEIGHTS[c.type] || 0;
    });
    return Math.min(100, score);
  }

  function updateScore() {
    var score = computeScore();
    scoreBigEl.textContent = score;
    var verifiedCount = credentials.filter(function (c) { return c.verified; }).length;
    if (score === 0) {
      scoreMetaEl.textContent = "Add and verify credentials to build your score.";
    } else {
      scoreMetaEl.textContent = verifiedCount + " verified credential" + (verifiedCount === 1 ? "" : "s") + " · score updates live";
    }
    generateBtn.disabled = score === 0 || !fullNameEl.value.trim();
  }

  function base64UrlEncode(str) {
    var b64 = btoa(unescape(encodeURIComponent(str)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function generatePassport() {
    var payload = {
      name: fullNameEl.value.trim() || "Unnamed Worker",
      trade: tradeEl.value,
      score: computeScore(),
      credentials: credentials
        .filter(function (c) { return c.verified; })
        .map(function (c) { return { type: c.type, label: LABELS[c.type], value: c.value }; }),
      generatedAt: new Date().toISOString()
    };
    var encoded = base64UrlEncode(JSON.stringify(payload));
    var url = location.origin + location.pathname.replace(/dashboard\.html$/, "passport.html") + "#data=" + encoded;
    shareLinkEl.value = url;
    linkArea.style.display = "block";
    linkArea.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  addCredBtn.addEventListener("click", addCredential);
  fullNameEl.addEventListener("input", updateScore);
  generateBtn.addEventListener("click", generatePassport);
  copyBtn.addEventListener("click", function () {
    shareLinkEl.select();
    try {
      document.execCommand("copy");
      copyBtn.textContent = "Copied!";
      setTimeout(function () { copyBtn.textContent = "Copy"; }, 1400);
    } catch (e) {
      navigator.clipboard && navigator.clipboard.writeText(shareLinkEl.value);
    }
  });

  renderCredentials();
})();
