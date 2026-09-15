/**
 * Stackly IT-Solutions Dedicated Workspace Dashboard Script
 * Manages session verification, dynamic time-of-day & timezone greeting,
 * role-based routing, collapsible sidebar state, screen switching,
 * real-time table searching, filter controls, live terminal, and interactive actions.
 */

// 1. Session Verification & Smart Gateway Routing
const getRoleDefaults = (path) => {
  if (path.includes("dashboard-manager")) {
    return {
      name: "Marcus Vance",
      email: "marcus.manager@stackly.com",
      role: "Manager",
    };
  } else if (path.includes("dashboard-employee")) {
    return {
      name: "Elena Rostova",
      email: "elena.dev@stackly.com",
      role: "Employee",
    };
  } else if (path.includes("dashboard-customer")) {
    return {
      name: "David K.",
      email: "david@meridian-cloud.com",
      role: "Customer",
    };
  }
  return {
    name: "Alex Mercer",
    email: "alex.admin@stackly.com",
    role: "Admin",
  };
};

let session = window.StacklySession?.readSession();
const currentPath = window.location.pathname.replace(/\\/g, "/");
const isGatewayPage =
  currentPath.endsWith("/dashboard.html") ||
  currentPath.endsWith("dashboard.html");

if (!session) {
  if (isGatewayPage) {
    window.location.replace("dashboard-admin.html");
  } else {
    session = getRoleDefaults(currentPath);
    window.StacklySession?.saveSession(session);
  }
}

if (session) {
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

    const navGreetingTimeEl = document.querySelector("#navGreetingTime");
    const navGreetingNameEl = document.querySelector("#navGreetingName");
    if (navGreetingTimeEl) navGreetingTimeEl.textContent = timeGreeting;
    if (navGreetingNameEl) navGreetingNameEl.textContent = name;

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
            .closest(".dashboard-full-panel, .dashboard-screen")
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
            .closest(".dashboard-full-panel, .dashboard-screen")
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

      // Visual feedback: slightly adjust percentage bars inside the same panel
      const panel = pillGroup.closest(
        ".dashboard-full-panel, .dashboard-screen"
      );
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
      const card = toggle.closest(".quick-control-card, .metric-card, article");
      if (card) {
        const label = card.querySelector("strong")?.textContent || "Feature";
        const statusSpan = card.querySelector("small, .toggle-status-text");
        if (statusSpan) {
          statusSpan.textContent = toggle.checked
            ? "Enabled \u2022 Active telemetry"
            : "Disabled \u2022 In standby";
        }
      }
      if (window.showDashboardToast) {
        window.showDashboardToast(
          toggle.checked
            ? "Configuration enabled and synchronized across edge nodes"
            : "Service switched to standby mode",
          toggle.checked ? "fa-circle-check" : "fa-circle-pause"
        );
      }
    });
  });

  // 7. Collapsible Sidebar Controller & Screen Switching
  const sidebar = document.querySelector("#dashboardSidebar");
  const sidebarBackdrop = document.querySelector("#sidebarBackdrop");
  const sidebarToggleBtn = document.querySelector("#sidebarToggleBtn");
  const appShell = document.querySelector(".dashboard-app-shell");

  const updateToggleTooltips = (isCollapsed) => {
    if (!sidebarToggleBtn) return;
    sidebarToggleBtn.removeAttribute("title");
    const icon = sidebarToggleBtn.querySelector("i");
    if (window.innerWidth < 992) {
      const isOpen = sidebar?.classList.contains("mobile-open");
      sidebarToggleBtn.setAttribute(
        "data-tooltip",
        isOpen ? "Close Navigation" : "Open Navigation"
      );
      sidebarToggleBtn.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
      if (icon) {
        icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
      }
    } else {
      sidebarToggleBtn.setAttribute(
        "data-tooltip",
        isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"
      );
      sidebarToggleBtn.setAttribute(
        "aria-label",
        isCollapsed ? "Expand sidebar" : "Collapse sidebar"
      );
      if (icon) {
        icon.className = "fa-solid fa-bars";
      }
    }
  };

  // Restore Desktop Collapsed State Preference
  const savedCollapsed =
    localStorage.getItem("stackly_sidebar_collapsed") === "true";
  if (savedCollapsed && sidebar && window.innerWidth >= 992) {
    sidebar.classList.add("collapsed");
    appShell?.classList.add("sidebar-collapsed");
  }

  updateToggleTooltips(
    sidebar?.classList.contains("collapsed") ||
      (window.innerWidth < 992 && !sidebar?.classList.contains("mobile-open"))
  );

  // Toggle Collapse on Desktop and Mobile
  const toggleSidebar = () => {
    if (!sidebar) return;
    if (window.innerWidth < 992) {
      const isOpen = sidebar.classList.toggle("mobile-open");
      sidebarBackdrop?.classList.toggle("active", isOpen);
      document.body.classList.toggle("nav-open", isOpen);
      document.documentElement.classList.toggle("nav-open", isOpen);
      updateToggleTooltips(!isOpen);
    } else {
      const isCollapsed = sidebar.classList.toggle("collapsed");
      appShell?.classList.toggle("sidebar-collapsed", isCollapsed);
      localStorage.setItem("stackly_sidebar_collapsed", String(isCollapsed));
      updateToggleTooltips(isCollapsed);
    }
  };

  const closeMobileDrawer = () => {
    if (!sidebar) return;
    sidebar.classList.remove("mobile-open");
    sidebarBackdrop?.classList.remove("active");
    document.body.classList.remove("nav-open");
    document.documentElement.classList.remove("nav-open");
    updateToggleTooltips(true);
  };

  sidebarToggleBtn?.addEventListener("click", toggleSidebar);
  sidebarBackdrop?.addEventListener("click", closeMobileDrawer);

  // Lock touch scrolling outside of sidebar on mobile devices
  document.addEventListener(
    "touchmove",
    (e) => {
      if (sidebar?.classList.contains("mobile-open")) {
        if (!sidebar.contains(e.target)) {
          e.preventDefault();
        }
      }
    },
    { passive: false }
  );

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) {
      closeMobileDrawer();
      updateToggleTooltips(sidebar?.classList.contains("collapsed"));
    } else {
      updateToggleTooltips(!sidebar?.classList.contains("mobile-open"));
    }
  });

  // Screen Switching Logic (Sidebar Items with data-screen attribute)
  const sidebarItems = document.querySelectorAll(".sidebar-item[data-screen]");
  const screens = document.querySelectorAll(".dashboard-screen");

  // Tooltip Support: Ensure every sidebar item has a data-tooltip
  sidebarItems.forEach((item) => {
    if (!item.getAttribute("data-tooltip")) {
      const label = item.querySelector(".item-label")?.textContent.trim();
      if (label) item.setAttribute("data-tooltip", label);
    }
  });

  const activateScreen = (screenId) => {
    const targetScreen = document.getElementById(screenId);
    if (!targetScreen) return;

    // Update active sidebar item
    sidebarItems.forEach((item) => {
      const matches = item.getAttribute("data-screen") === screenId;
      item.classList.toggle("active", matches);
    });

    // Update active screen panel
    screens.forEach((screen) => {
      const isActive = screen.id === screenId;
      screen.classList.toggle("active", isActive);
      if (isActive) {
        screen.querySelectorAll("[data-aos]").forEach((el) => {
          el.classList.add("aos-animate");
        });
      }
    });

    // Close mobile drawer if opened
    closeMobileDrawer();

    // Smooth scroll main area to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Update URL hash without jumping
    history.replaceState(null, "", `#${screenId.replace(/^screen-/, "")}`);
  };

  sidebarItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const screenId = item.getAttribute("data-screen");
      if (screenId) activateScreen(screenId);
    });
  });

  // Handle Initial Hash on Load
  const initialHash = window.location.hash.replace("#", "");
  if (initialHash) {
    const matchingScreenId = `screen-${initialHash}`;
    if (document.getElementById(matchingScreenId)) {
      activateScreen(matchingScreenId);
    }
  }

  // Ensure initial active screen has all elements visible
  document
    .querySelectorAll(".dashboard-screen.active [data-aos]")
    .forEach((el) => {
      el.classList.add("aos-animate");
    });

  // 8. In-App Interactive Toast Notifications
  const toastContainer = document.createElement("div");
  toastContainer.className = "dashboard-toast";
  toastContainer.id = "dashboardToast";
  toastContainer.setAttribute("role", "status");
  toastContainer.setAttribute("aria-live", "polite");
  toastContainer.setAttribute("title", "Click to dismiss");
  toastContainer.addEventListener("click", () => {
    toastContainer.classList.remove("show");
    clearTimeout(toastTimer);
  });
  document.body.appendChild(toastContainer);

  let toastTimer = null;
  function showToast(message, icon = "fa-circle-check") {
    toastContainer.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--cyan); font-size: 16px;"></i><span>${message}</span>`;
    toastContainer.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastContainer.classList.remove("show");
    }, 3400);
  }
  window.showDashboardToast = showToast;

  // 9. Interactive Live Terminal Emulator (Employee Dashboard)
  const terminalForm = document.querySelector("#terminalInputForm");
  const terminalInput = document.querySelector("#terminalInput");
  const terminalOutput = document.querySelector("#terminalOutput");

  if (terminalForm && terminalInput && terminalOutput) {
    terminalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const command = terminalInput.value.trim().toLowerCase();
      if (!command) return;

      terminalInput.value = "";

      const echoLine = document.createElement("div");
      echoLine.innerHTML = `<span class="term-prompt">engineer@stackly:~$</span> <strong>${command}</strong>`;
      terminalOutput.appendChild(echoLine);

      const responseLine = document.createElement("div");
      responseLine.className = "term-dim";

      switch (command) {
        case "help":
          responseLine.innerHTML = `Available commands: &bull; <strong>status</strong> (Cluster health) &bull; <strong>pods</strong> (List active worker pods) &bull; <strong>restart</strong> (Restart worker) &bull; <strong>deploy</strong> (Trigger build) &bull; <strong>clear</strong> (Clear screen)`;
          break;
        case "status":
          responseLine.innerHTML = `<span style="color: var(--mint);">[HEALTHY]</span> All 3 worker nodes active &bull; Latency 14ms &bull; Memory 58%`;
          break;
        case "pods":
          responseLine.innerHTML = `Running pods: <br>&bull; auth-api-pod-88fa (Running, 0 restarts, 42m)<br>&bull; client-ingress-pod-11b (Running, 0 restarts, 6h)<br>&bull; redis-cache-worker-04 (Running, 0 restarts, 18h)`;
          break;
        case "restart":
          responseLine.innerHTML = `<span style="color: var(--cyan);">[INFO]</span> Rolling restart initiated for auth-api-pod... Success (0s downtime).`;
          showToast("Pod restart executed successfully", "fa-arrows-rotate");
          break;
        case "deploy":
          responseLine.innerHTML = `<span style="color: var(--mint);">[DEPLOY]</span> Triggering CI/CD staging pipeline build #1842...`;
          showToast("CI/CD deployment queued", "fa-rocket");
          break;
        case "clear":
          terminalOutput.innerHTML = "";
          return;
        default:
          responseLine.innerHTML = `command not found: "${command}". Type <strong>help</strong> for available commands.`;
          break;
      }

      terminalOutput.appendChild(responseLine);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    });
  }

  // 10. Interactive Manager Approvals (Manager Dashboard)
  document.querySelectorAll(".approval-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const action = btn.getAttribute("data-action");
      const statusBadge = row?.querySelector(".status-badge");
      if (statusBadge) {
        if (action === "approve") {
          statusBadge.className = "status-badge live";
          statusBadge.textContent = "Approved";
          showToast(
            "Change request approved and sent to staging",
            "fa-circle-check"
          );
        } else {
          statusBadge.className = "status-badge";
          statusBadge.style.background = "rgba(239, 68, 68, 0.15)";
          statusBadge.style.color = "#f87171";
          statusBadge.textContent = "Rejected";
          showToast("Change request rejected", "fa-circle-xmark");
        }
      }
      btn.parentElement.innerHTML = `<span style="color: var(--muted); font-size: 11px;">Processed</span>`;
    });
  });

  // 11. Interactive Support Ticket Creation Modal (Customer Dashboard)
  const openTicketModalBtn = document.querySelector("#openNewTicketModal");
  const ticketModalBackdrop = document.querySelector("#newTicketModalBackdrop");
  const closeTicketModalBtn = document.querySelector("#closeTicketModal");
  const newTicketForm = document.querySelector("#newTicketForm");

  if (openTicketModalBtn && ticketModalBackdrop) {
    openTicketModalBtn.addEventListener("click", () => {
      ticketModalBackdrop.classList.add("open");
    });

    closeTicketModalBtn?.addEventListener("click", () => {
      ticketModalBackdrop.classList.remove("open");
    });

    ticketModalBackdrop.addEventListener("click", (e) => {
      if (e.target === ticketModalBackdrop) {
        ticketModalBackdrop.classList.remove("open");
      }
    });

    newTicketForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const subject = document.querySelector("#ticketSubject")?.value.trim();
      const priority =
        document.querySelector("#ticketPriority")?.value || "Normal";
      const table = document.querySelector("#customerTicketsTable tbody");

      if (subject && table) {
        const randomId = "STK-" + Math.floor(1000 + Math.random() * 9000);
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td><strong>${randomId}</strong></td>
          <td>${subject}</td>
          <td><span class="status-badge live">Open / Triage</span></td>
          <td><span style="color: ${priority === "Critical" ? "#f87171" : "var(--mint)"}">${priority}</span></td>
          <td>Just now</td>
          <td><button class="button button-small button-ghost action-trigger" type="button">View</button></td>
        `;
        table.prepend(newRow);
        showToast(`Ticket #${randomId} submitted successfully!`, "fa-ticket");
        newTicketForm.reset();
        ticketModalBackdrop.classList.remove("open");
      }
    });
  }

  // 12. Sign Out Action: Clears active session and returns to login
  document.querySelector("#signOut")?.addEventListener("click", () => {
    window.StacklySession?.clearSession();
    window.location.href = "sign-in.html";
  });

  // 13. Action Buttons Route to 404.html (preserving interactive controls & inputs)
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

  // 14. Initialize AOS Scroll Animations
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 700, once: true, offset: 40 });
  }
}
