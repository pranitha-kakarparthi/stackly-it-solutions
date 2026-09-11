/**
 * Stackly IT-Solutions Dedicated Workspace Dashboard Script
 * Manages session verification, dynamic time-of-day & timezone greeting,
 * role-based routing, real-time table searching, filter controls,
 * time-range pill toggling, and interactive action routing.
 */

// 1. Session Verification & Smart Gateway Routing
const session = window.StacklySession?.readSession();
const currentPath = window.location.pathname.replace(/\\/g, "/");
const isGatewayPage =
  currentPath.endsWith("/dashboard.html") ||
  currentPath.endsWith("dashboard.html");

if (!session) {
  // If not logged in, redirect to sign-in page
  window.location.replace("sign-in.html");
} else {
  const name = session.name || "there";
  const userRole = (session.role || "Admin").trim();
  const normalizedRole = userRole.toLowerCase();

  // If user hits the central dashboard.html gateway, immediately redirect to their dedicated dashboard
  if (isGatewayPage) {
    if (normalizedRole === "manager") {
      window.location.replace("dashboard-manager.html");
    } else if (normalizedRole === "employee") {
      window.location.replace("dashboard-employee.html");
    } else if (normalizedRole === "customer") {
      window.location.replace("dashboard-customer.html");
    } else {
      window.location.replace("dashboard-admin.html");
    }
  }

  // Update Header Profile Information
  const userNameEl = document.querySelector("#userName");
  const userRoleEl = document.querySelector("#userRole");
  const greetingNameEl = document.querySelector("#greetingName");
  const userAvatarEl = document.querySelector("#userAvatar");

  if (userNameEl) userNameEl.textContent = session.name || "Stackly Member";
  if (userRoleEl) userRoleEl.textContent = `${userRole} Access`;
  if (greetingNameEl) greetingNameEl.textContent = `${name}.`;
  if (userAvatarEl) {
    userAvatarEl.textContent = name.slice(0, 1).toUpperCase();
  }

  // 2. Dynamic Time-of-Day Greeting & Local Timezone Detection
  const updateTimeAndGreeting = () => {
    const now = new Date();
    const hours = now.getHours();
    let timeGreeting = "Good morning";

    if (hours >= 12 && hours < 17) {
      timeGreeting = "Good afternoon";
    } else if (hours >= 17 || hours < 5) {
      timeGreeting = "Good evening";
    }

    const greetingTimeEl = document.querySelector("#greetingTime");
    if (greetingTimeEl) greetingTimeEl.textContent = timeGreeting;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const timeFormatted = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const timeAndZoneEl = document.querySelector("#timeAndZone");
    if (timeAndZoneEl) {
      timeAndZoneEl.textContent = `${timeFormatted} \u2022 ${timeZone}`;
    }
  };

  updateTimeAndGreeting();

  // 3. Interactive Component: Real-Time Table Search Filter
  document.querySelectorAll(".table-search-input").forEach((input) => {
    input.addEventListener("input", () => {
      const query = input.value.toLowerCase().trim();
      const targetTableId = input.getAttribute("data-target-table");
      const table = targetTableId
        ? document.getElementById(targetTableId)
        : input
            .closest(".dashboard-full-panel")
            ?.querySelector(".dashboard-table");
      if (!table) return;

      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? "" : "none";
      });
    });
  });

  // 4. Interactive Component: Table Status Filter Dropdowns
  document.querySelectorAll(".table-status-filter").forEach((dropdown) => {
    dropdown.addEventListener("change", () => {
      const selected = dropdown.value.toLowerCase().trim();
      const targetTableId = dropdown.getAttribute("data-target-table");
      const table = targetTableId
        ? document.getElementById(targetTableId)
        : dropdown
            .closest(".dashboard-full-panel")
            ?.querySelector(".dashboard-table");
      if (!table) return;

      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        if (!selected || selected === "all") {
          row.style.display = "";
        } else {
          const rowText = row.textContent.toLowerCase();
          row.style.display = rowText.includes(selected) ? "" : "none";
        }
      });
    });
  });

  // 5. Interactive Component: Time-Range Pill Selector (1H, 24H, 7D, 30D)
  document.querySelectorAll(".time-range-pills").forEach((pillGroup) => {
    pillGroup.addEventListener("click", (e) => {
      const btn = e.target.closest(".time-pill-btn");
      if (!btn) return;

      pillGroup
        .querySelectorAll(".time-pill-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Optional visual feedback: slightly adjust percentage bars inside the same panel
      const panel = pillGroup.closest(".dashboard-full-panel");
      if (panel) {
        panel.querySelectorAll(".chart-item").forEach((item) => {
          const fill = item.querySelector(".chart-bar-fill");
          const span = item.querySelector(".chart-item-header span");
          if (fill && span && !span.dataset.base) {
            span.dataset.base = span.textContent;
          }
        });
      }
    });
  });

  // 6. Interactive Component: Interactive Toggle Switches
  document.querySelectorAll(".interactive-toggle input").forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const card = toggle.closest(".quick-control-card");
      if (card) {
        const label = card.querySelector("strong")?.textContent || "Feature";
        const statusSpan = card.querySelector("small");
        if (statusSpan) {
          statusSpan.textContent = toggle.checked
            ? "Enabled \u2022 Active telemetry"
            : "Disabled \u2022 In standby";
        }
      }
    });
  });

  // 7. Sign Out Action: Clears active session and returns to login
  document.querySelector("#signOut")?.addEventListener("click", () => {
    window.StacklySession?.clearSession();
    window.location.href = "sign-in.html";
  });

  // 8. Action Buttons Route to 404.html (preserving interactive controls & inputs)
  document
    .querySelector(".dashboard-main")
    ?.addEventListener("click", (event) => {
      const target = event.target.closest(
        "a.action-trigger, button.action-trigger"
      );
      if (target && target.id !== "signOut" && !target.closest(".brand")) {
        event.preventDefault();
        window.location.href = "../404.html";
      }
    });

  // 9. Initialize AOS Scroll Animations
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 700, once: true, offset: 40 });
  }
}
