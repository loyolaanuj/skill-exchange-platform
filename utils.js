// =============================================
// SHARED UTILITIES & HELPERS
// Used across all pages
// =============================================

// ---- Toast Notification System ----
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
  `;
  toast.addEventListener('click', () => removeToast(toast));
  container.appendChild(toast);

  setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
  toast.classList.add('hiding');
  toast.addEventListener('animationend', () => toast.remove());
}

// ---- Page Loader ----
function showLoader() {
  const existing = document.querySelector('.loader-overlay');
  if (existing) { existing.style.display = 'flex'; return; }
  const overlay = document.createElement('div');
  overlay.className = 'loader-overlay';
  overlay.innerHTML = `<div class="loader-spinner"></div>`;
  document.body.prepend(overlay);
}

function hideLoader() {
  const overlay = document.querySelector('.loader-overlay');
  if (overlay) {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 400);
  }
}

// ---- Get Initials from Name ----
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// ---- Format Firestore Timestamp ----
function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ---- Format Chat Time ----
function formatChatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ---- Parse Skill Input ----
function parseSkills(raw) {
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

// ---- Generate Chat ID for Two Users ----
function getChatId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

// ---- Debounce ----
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ---- Auth Guard: Redirect to Login if Not Authenticated ----
function requireAuth(callback) {
  showLoader();
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    hideLoader();
    callback(user);
  });
}

// ---- Redirect to Feed if Already Authenticated ----
function redirectIfAuth() {
  auth.onAuthStateChanged(user => {
    if (user) {
      window.location.href = 'feed.html';
    }
  });
}

// ---- Dark Mode Toggle ----
function initDarkMode() {
  const btn = document.getElementById('dark-toggle-btn');
  const isDark = localStorage.getItem('darkMode') === 'enabled';
  if (isDark) document.body.classList.add('dark-mode');
  
  btn?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : null);
  });
}

// ---- Render Navbar (shared) ----
async function renderNavbar(activeTab) {
  const navEl = document.getElementById('main-navbar');
  if (!navEl) return;

  const links = [
    { href: 'feed.html',          label: '🏠 Feed',          id: 'feed' },
    { href: 'dashboard.html',     label: '📊 Dashboard',     id: 'dashboard' },
    { href: 'browse.html',        label: '🔍 Browse',        id: 'browse' },
    { href: 'chat.html',          label: '💬 Chat',          id: 'chat' },
    { href: 'leaderboard.html',   label: '🏆 Leaderboard',  id: 'leaderboard' },
    { href: 'schedule.html',      label: '📅 Schedule',      id: 'schedule' },
    { href: 'notifications.html', label: '🔔 Notifications', id: 'notifications' },
    { href: 'profile.html',       label: '👤 Profile',       id: 'profile' },
  ];

  navEl.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <a href="feed.html" class="nav-logo">
          <div class="logo-icon">⚡</div>
          <span>SkillSwap</span>
        </a>
        <button class="burger-btn" id="burger-btn" aria-label="Menu">☰</button>
        <ul class="nav-links" id="nav-links">
          ${links.map(l => `
            <li><a href="${l.href}" class="${l.id === activeTab ? 'active' : ''}">${l.label}</a></li>
          `).join('')}
        </ul>
        <div class="nav-actions">
          <button class="dark-toggle" id="dark-toggle-btn">🌙</button>
          <div style="position:relative">
            <div class="nav-avatar" id="nav-avatar-btn" title="Notifications" style="cursor:pointer;position:relative">?</div>
            <div id="navbar-notif-dot" style="position:absolute;top:0;right:0;width:10px;height:10px;border-radius:50%;background:#ef4444;border:2px solid var(--bg-nav,#0f0f1a);display:none"></div>
            <div id="navbar-notif-dropdown" style="position:absolute;top:52px;right:0;min-width:280px;background:var(--bg-card-2);border:1px solid var(--border);border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.4);z-index:9999;overflow:hidden;display:none">
              <div style="padding:12px 16px;border-bottom:1px solid var(--border-light);font-size:0.85rem;font-weight:700">🔔 Notifications</div>
              <div id="navbar-notif-inner" style="max-height:280px;overflow-y:auto"></div>
              <div style="padding:10px 16px;border-top:1px solid var(--border-light);text-align:center">
                <a href="notifications.html" style="font-size:0.78rem;color:var(--primary-light)">View all →</a>
              </div>
            </div>
          </div>
          <button class="btn btn-sm btn-secondary" id="logout-btn">Sign Out</button>
        </div>
      </div>
    </nav>
  `;

  initDarkMode();

  const user = auth.currentUser;
  if (user) {
    const avatarEl = document.getElementById('nav-avatar-btn');
    const notifDropdown = document.getElementById('navbar-notif-dropdown');
    const notifDot = document.getElementById('navbar-notif-dot');
    const notifInner = document.getElementById('navbar-notif-inner');

    // Avatar logic
    try {
      const snap = await db.collection('users').doc(user.uid).get();
      const data = snap.data() || {};
      if (data.photoURL) {
        avatarEl.innerHTML = `<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      } else {
        avatarEl.textContent = getInitials(data.displayName || user.email);
      }
    } catch (e) { avatarEl.textContent = getInitials(user.email); }

    // Toggle notification dropdown
    avatarEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = notifDropdown.style.display === 'block';
      notifDropdown.style.display = isOpen ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => { notifDropdown.style.display = 'none'; });
    notifDropdown.addEventListener('click', (e) => e.stopPropagation());

    // Real-time pending request notifications
    db.collection('requests')
      .where('toUid', '==', user.uid)
      .where('status', '==', 'pending')
      .onSnapshot(snap => {
        notifDot.style.display = snap.empty ? 'none' : 'block';
        if (snap.empty) {
          notifInner.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.82rem">No new notifications</div>';
        } else {
          notifInner.innerHTML = snap.docs.map(doc => {
            const req = doc.data();
            return `<div style="padding:12px 16px;border-bottom:1px solid var(--border-light);font-size:0.82rem;display:flex;gap:10px;align-items:flex-start;cursor:pointer" onclick="window.location.href='notifications.html'">
              <span style="font-size:1.1rem">📨</span>
              <div>
                <div style="font-weight:600">New request from ${req.fromName || 'Someone'}</div>
                <div style="color:var(--text-muted);font-size:0.75rem;margin-top:2px">${req.skillOffered} ↔ ${req.skillWanted}</div>
              </div>
            </div>`;
          }).join('');
        }
      });
  }

  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await auth.signOut();
    window.location.href = 'login.html';
  });

  document.getElementById('burger-btn')?.addEventListener('click', () => {
    document.getElementById('nav-links')?.classList.toggle('open');
  });
}

// ---- Tag Chip Input System ----
function initTagInput(containerId, inputId, tags = [], type = 'offer') {
  const container = document.getElementById(containerId);
  const hiddenInput = document.getElementById(inputId);
  if (!container) return;

  let tagList = [...tags];

  function render() {
    const chips = container.querySelectorAll('.skill-tag');
    chips.forEach(c => c.remove());

    tagList.forEach((tag, i) => {
      const chip = document.createElement('span');
      chip.className = `skill-tag skill-tag-${type}`;
      chip.innerHTML = `${tag} <span class="remove-tag" data-index="${i}">×</span>`;
      chip.querySelector('.remove-tag').addEventListener('click', () => {
        tagList.splice(i, 1);
        render();
        updateHidden();
      });
      container.insertBefore(chip, container.querySelector('input'));
    });
  }

  function updateHidden() {
    if (hiddenInput) hiddenInput.value = tagList.join(',');
  }

  const input = container.querySelector('input');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
        e.preventDefault();
        const val = input.value.replace(',', '').trim();
        if (val && !tagList.includes(val)) {
          tagList.push(val);
          render();
          updateHidden();
        }
        input.value = '';
      } else if (e.key === 'Backspace' && !input.value && tagList.length) {
        tagList.pop();
        render();
        updateHidden();
      }
    });
  }

  render();
  updateHidden();

  return {
    getTags: () => [...tagList],
    setTags: (newTags) => { tagList = [...newTags]; render(); updateHidden(); }
  };
}

// ---- Compute Match Score Between Two User Skill Sets ----
function computeMatchScore(myOffered, myWanted, theirOffered, theirWanted) {
  const norm = s => s.toLowerCase().trim();
  const myOffNorm = myOffered.map(norm);
  const myWantNorm = myWanted.map(norm);
  const theirOffNorm = theirOffered.map(norm);
  const theirWantNorm = theirWanted.map(norm);

  // I can teach what they want
  const iTeachThem = myOffNorm.filter(s => theirWantNorm.includes(s)).length;
  // They can teach what I want
  const theyTeachMe = theirOffNorm.filter(s => myWantNorm.includes(s)).length;

  const total = (myOffNorm.length + theirWantNorm.length + myWantNorm.length + theirOffNorm.length) / 2;
  if (total === 0) return 0;
  return Math.round(((iTeachThem + theyTeachMe) / total) * 100);
}
