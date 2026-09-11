/**
 * Stackly IT-Solutions Workspace Dashboard Script
 * Manages session validation, dynamic time-of-day & timezone greeting,
 * role-based workspace view switching (Admin, Manager, Employee, Customer),
 * and 404 action routing.
 */

// 1. Session Verification
const session = window.StacklySession?.readSession();
if (!session) {
  window.location.replace("sign-in.html");
} else {
  const name = session.name || "there";
  const userRole = session.role || "Admin";

  // Update header profile
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

    // Detect user's resolved timezone and formatted local time
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

  // 3. Role-Based Dashboard View Switching
  const roleViews = {
    Admin: {
      viewId: "viewAdmin",
      tabId: "tabAdmin",
      eyebrow: "Administrator Infrastructure Telemetry",
      subtitle:
        "Global multi-cloud telemetry, server cluster nodes, security posture, and access control audit.",
    },
    Manager: {
      viewId: "viewManager",
      tabId: "tabManager",
      eyebrow: "IT Operations & Project Delivery Management",
      subtitle:
        "Sprint velocity, enterprise milestone progress, department budget burn, and SLA compliance.",
    },
    Employee: {
      viewId: "viewEmployee",
      tabId: "tabEmployee",
      eyebrow: "Engineering Workspace & Developer Environment",
      subtitle:
        "Assigned work items, active pull requests, CI/CD pipeline health, and cloud development resources.",
    },
    Customer: {
      viewId: "viewCustomer",
      tabId: "tabCustomer",
      eyebrow: "Enterprise Client Services & SLA Portal",
      subtitle:
        "Subscribed IT tiers, monthly API quota consumption, support ticket tracking, and TAM advisory.",
    },
  };

  const setRoleView = (targetRole) => {
    const roleKey =
      Object.keys(roleViews).find(
        (r) => r.toLowerCase() === (targetRole || "").toLowerCase()
      ) || "Admin";
    const config = roleViews[roleKey];

    // Toggle active role views
    document.querySelectorAll(".role-view-section").forEach((sec) => {
      sec.classList.remove("active");
    });
    const targetSection = document.getElementById(config.viewId);
    if (targetSection) targetSection.classList.add("active");

    // Toggle active role tab buttons
    document.querySelectorAll(".role-tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    const targetTab = document.getElementById(config.tabId);
    if (targetTab) targetTab.classList.add("active");

    // Update eyebrow & subtitle
    const eyebrowEl = document.querySelector("#dashboardEyebrow");
    const subtitleEl = document.querySelector("#dashboardSubtitle");
    if (eyebrowEl) eyebrowEl.textContent = config.eyebrow;
    if (subtitleEl) subtitleEl.textContent = config.subtitle;
  };

  // Initialize view with logged-in user's role
  setRoleView(userRole);

  // Allow switching roles dynamically using the role tabs
  document.querySelectorAll(".role-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedRole = btn.getAttribute("data-role");
      setRoleView(selectedRole);
    });
  });
}

// 4. Sign out clears the active session and returns to login
document.querySelector("#signOut")?.addEventListener("click", () => {
  window.StacklySession?.clearSession();
  window.location.href = "sign-in.html";
});

// 5. Interactive Action Triggers Route to 404 (except signout, brand, and role tabs)
document
  .querySelector(".dashboard-main")
  ?.addEventListener("click", (event) => {
    const target = event.target.closest("button, a, .action-trigger");
    if (
      target &&
      target.id !== "signOut" &&
      !target.closest(".brand") &&
      !target.classList.contains("role-tab-btn")
    ) {
      event.preventDefault();
      window.location.href = "../404.html";
    }
  });

// 6. Initialize AOS Animations if available
if (typeof AOS !== "undefined") {
  AOS.init({ duration: 700, once: true, offset: 40 });
}
