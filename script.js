// =====================================================
// SubnetPro v2.0 — IPv4 & IPv6 Subnet Calculator
// =====================================================

// ── COUNTER ───────────────────────────────────────────
let calcCount = parseInt(localStorage.getItem('subnetpro_count')) || 0;
document.getElementById('calc-count').textContent = calcCount;

function bumpCount() {
  calcCount++;
  localStorage.setItem('subnetpro_count', calcCount);
  document.getElementById('calc-count').textContent = calcCount;
}

// ── TAB SWITCHER ──────────────────────────────────────
function switchTab(t) {
  document.querySelectorAll('.proto-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + t).classList.add('active');
  document.getElementById('tab-' + t).classList.add('active');
}

// ── SLIDER SYNC ───────────────────────────────────────
function syncV4(val, from) {
  val = Math.max(0, Math.min(32, parseInt(val) || 0));
  if (from !== 'slider') document.getElementById('v4-slider').value = val;
  if (from !== 'num')    document.getElementById('v4-cidr-num').value = val;
}

function syncV6(val, from) {
  val = Math.max(0, Math.min(128, parseInt(val) || 0));
  if (from !== 'slider') document.getElementById('v6-slider').value = val;
  if (from !== 'num')    document.getElementById('v6-prefix-num').value = val;
}

// ── COPY TOAST ────────────────────────────────────────
function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('copyable') && e.target.textContent.trim()) {
    navigator.clipboard.writeText(e.target.textContent.trim())
      .then(showToast)
      .catch(() => {});
  }
});

// ── ERROR HELPERS ─────────────────────────────────────
function showErr(id, msg) {
  const el = document.getElementById(id);
  el.textContent = '⚠ ' + msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

function hideErr(id) {
  document.getElementById(id).style.display = 'none';
}

// ═══════════════════════════════════════════════════════
//  IPv4 LOGIC
// ═══════════════════════════════════════════════════════

function calcV4() {
  hideErr('v4-error');
  const ipStr = document.getElementById('v4-ip').value.trim();
  const cidr   = parseInt(document.getElementById('v4-cidr-num').value);

  if (!validIPv4(ipStr)) {
    showErr('v4-error', 'Invalid IPv4 address. Example: 192.168.1.0');
    return;
  }
  if (isNaN(cidr) || cidr < 0 || cidr > 32) {
    showErr('v4-error', 'CIDR prefix must be between 0 and 32.');
    return;
  }

  bumpCount();

  const ip    = ipStr.split('.').map(Number);
  const mask  = cidrToMaskParts(cidr);
  const net   = ip.map((o, i) => o & mask[i]);
  const wild  = mask.map(o => 255 - o);
  const bcast = net.map((o, i) => o | wild[i]);

  const first = [...net];
  const last  = [...bcast];
  if (cidr < 31) { first[3] += 1; last[3] -= 1; }

  const hostBits  = 32 - cidr;
  const totalAddr = Math.pow(2, hostBits);
  const usable    = cidr < 31 ? totalAddr - 2 : totalAddr;
  const pct       = ((usable / totalAddr) * 100).toFixed(1);

  const ipBin   = ip.map(o => o.toString(2).padStart(8,'0')).join(' . ');
  const maskBin = mask.map(o => o.toString(2).padStart(8,'0')).join(' . ');

  set('v4-ip-out',   ipStr);
  set('v4-network',  net.join('.'));
  set('v4-broadcast',bcast.join('.'));
  set('v4-mask',     mask.join('.'));
  set('v4-wildcard', wild.join('.'));
  set('v4-first',    first.join('.'));
  set('v4-last',     last.join('.'));
  set('v4-total',    fmtNum(totalAddr));
  set('v4-usable',   fmtNum(usable));
  set('v4-class',    ipv4Class(ip[0]));
  set('v4-type',     ipv4Type(ip));
  set('v4-cidr-full',`${net.join('.')}/${cidr}`);
  set('v4-hostbits', `${hostBits} bit${hostBits !== 1 ? 's' : ''}`);
  set('v4-ip-bin',   ipBin);
  set('v4-mask-bin', maskBin);
  set('v4-pct',      pct + '%');
  document.getElementById('v4-cidr-badge').textContent = `/${cidr}`;

  setTimeout(() => {
    document.getElementById('v4-bar').style.width = pct + '%';
  }, 80);

  const res = document.getElementById('v4-results');
  res.style.display = 'block';
  setTimeout(() => res.scrollIntoView({ behavior:'smooth', block:'nearest' }), 100);
}

function cidrToMaskParts(cidr) {
  const mask = [];
  for (let i = 0; i < 4; i++) {
    const n = Math.min(cidr, 8);
    mask.push(256 - Math.pow(2, 8 - n));
    cidr -= n;
  }
  return mask;
}

function validIPv4(ip) {
  const m = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  for (let i = 1; i <= 4; i++) if (parseInt(m[i]) > 255) return false;
  return true;
}

function ipv4Class(f) {
  if (f >= 1   && f <= 126) return 'Class A';
  if (f >= 128 && f <= 191) return 'Class B';
  if (f >= 192 && f <= 223) return 'Class C';
  if (f >= 224 && f <= 239) return 'Class D (Multicast)';
  if (f >= 240 && f <= 255) return 'Class E (Reserved)';
  return 'Unknown';
}

function ipv4Type(parts) {
  const [a, b] = parts;
  if (a === 10) return 'Private (RFC 1918)';
  if (a === 172 && b >= 16 && b <= 31) return 'Private (RFC 1918)';
  if (a === 192 && b === 168) return 'Private (RFC 1918)';
  if (a === 127) return 'Loopback';
  if (a === 169 && b === 254) return 'Link-Local (APIPA)';
  if (a === 100 && b >= 64 && b <= 127) return 'Shared Address Space';
  if (a === 0)   return 'Current Network';
  if (a === 255) return 'Limited Broadcast';
  return 'Public / Routable';
}

// ═══════════════════════════════════════════════════════
//  IPv6 LOGIC
// ═══════════════════════════════════════════════════════

function calcV6() {
  hideErr('v6-error');
  const ipStr  = document.getElementById('v6-ip').value.trim();
  const prefix = parseInt(document.getElementById('v6-prefix-num').value);

  if (!validIPv6(ipStr)) {
    showErr('v6-error', 'Invalid IPv6 address. Example: 2001:db8::1');
    return;
  }
  if (isNaN(prefix) || prefix < 0 || prefix > 128) {
    showErr('v6-error', 'Prefix length must be between 0 and 128.');
    return;
  }

  bumpCount();

  const expanded = expandIPv6(ipStr);
  if (!expanded) { showErr('v6-error', 'Could not parse IPv6 address.'); return; }

  const groups = expanded.split(':').map(g => parseInt(g, 16));

  // Build prefix mask as 8 × 16-bit groups
  const maskGroups = buildIPv6Mask(prefix);

  // Network prefix = groups AND mask
  const netGroups   = groups.map((g, i) => g & maskGroups[i]);
  const firstGroups = [...netGroups];
  const lastGroups  = netGroups.map((g, i) => g | (~maskGroups[i] & 0xffff));

  const hostBits = 128 - prefix;

  // Total addresses
  let totalStr;
  if (hostBits >= 64) {
    totalStr = '2^' + hostBits + ' (≈ ' + approxPow2(hostBits) + ')';
  } else if (hostBits === 0) {
    totalStr = '1';
  } else {
    totalStr = fmtNum(Math.pow(2, hostBits));
  }

  // Binary (first 64 / last 64 bits)
  const allBits = groups.map(g => g.toString(2).padStart(16,'0')).join('');
  const binHi = allBits.slice(0, 64).match(/.{1,8}/g).join(' ');
  const binLo = allBits.slice(64).match(/.{1,8}/g).join(' ');

  // Prefix mask display
  const maskDisplay = maskGroups.map(g => g.toString(16).padStart(4,'0')).join(':');

  // CIDR full
  const netDisplay  = compressIPv6(netGroups.map(g => g.toString(16).padStart(4,'0')).join(':'));
  const firstDisp   = compressIPv6(firstGroups.map(g => g.toString(16).padStart(4,'0')).join(':'));
  const lastDisp    = compressIPv6(lastGroups.map(g => g.toString(16).padStart(4,'0')).join(':'));
  const expandedDisp = expanded;
  const [addrType, scope] = ipv6Type(groups);

  set('v6-input-out', ipStr);
  set('v6-full',      expandedDisp);
  set('v6-network',   netDisplay + `/${prefix}`);
  set('v6-mask',      maskDisplay);
  set('v6-first',     firstDisp);
  set('v6-last',      lastDisp);
  set('v6-total',     totalStr);
  set('v6-pfx-len',   `/${prefix}`);
  set('v6-type',      addrType);
  set('v6-scope',     scope);
  set('v6-cidr-full', netDisplay + `/${prefix}`);
  set('v6-hostbits',  `${hostBits} bit${hostBits !== 1 ? 's' : ''}`);
  set('v6-bin-hi',    binHi);
  set('v6-bin-lo',    binLo);
  document.getElementById('v6-prefix-badge').textContent = `/${prefix}`;

  const res = document.getElementById('v6-results');
  res.style.display = 'block';
  setTimeout(() => res.scrollIntoView({ behavior:'smooth', block:'nearest' }), 100);
}

function validIPv6(addr) {
  // Allow :: notation and regular full addresses
  addr = addr.trim();
  if (!addr) return false;
  // Basic structural check
  if (addr.indexOf(':::') !== -1) return false;
  const dblColon = (addr.match(/::/g) || []).length;
  if (dblColon > 1) return false;
  return expandIPv6(addr) !== null;
}

function expandIPv6(addr) {
  try {
    addr = addr.trim().toLowerCase();
    if (addr.indexOf('::') !== -1) {
      const halves = addr.split('::');
      const left   = halves[0] ? halves[0].split(':') : [];
      const right  = halves[1] ? halves[1].split(':') : [];
      const missing = 8 - left.length - right.length;
      if (missing < 0) return null;
      const mid = Array(missing).fill('0000');
      const full = [...left, ...mid, ...right];
      if (full.length !== 8) return null;
      return full.map(g => g.padStart(4,'0')).join(':');
    } else {
      const parts = addr.split(':');
      if (parts.length !== 8) return null;
      return parts.map(g => g.padStart(4,'0')).join(':');
    }
  } catch {
    return null;
  }
}

function compressIPv6(addr) {
  // Remove leading zeros from each group
  let compressed = addr.split(':').map(g => parseInt(g, 16).toString(16)).join(':');
  // Replace longest run of consecutive 0 groups with ::
  const runs = [];
  let cur = null;
  const groups = compressed.split(':');
  groups.forEach((g, i) => {
    if (g === '0') {
      if (cur === null) cur = { start: i, len: 1 };
      else cur.len++;
    } else {
      if (cur) { runs.push(cur); cur = null; }
    }
  });
  if (cur) runs.push(cur);
  if (runs.length === 0) return compressed;
  const best = runs.reduce((a, b) => b.len > a.len ? b : a);
  if (best.len < 2) return compressed;
  const before = groups.slice(0, best.start).map(g => parseInt(g,16).toString(16)).join(':');
  const after  = groups.slice(best.start + best.len).map(g => parseInt(g,16).toString(16)).join(':');
  if (!before && !after) return '::';
  if (!before) return '::' + after;
  if (!after)  return before + '::';
  return before + '::' + after;
}

function buildIPv6Mask(prefix) {
  const mask = [];
  let rem = prefix;
  for (let i = 0; i < 8; i++) {
    const bits = Math.min(rem, 16);
    if (bits === 0) {
      mask.push(0);
    } else if (bits === 16) {
      mask.push(0xffff);
    } else {
      mask.push(0xffff & (0xffff << (16 - bits)));
    }
    rem -= bits;
    if (rem < 0) rem = 0;
  }
  return mask;
}

function ipv6Type(groups) {
  const g0 = groups[0];
  // Loopback ::1
  if (groups.every((g, i) => i < 7 ? g === 0 : g === 1)) return ['Loopback', 'Host'];
  // All zeros — unspecified
  if (groups.every(g => g === 0)) return ['Unspecified', 'N/A'];
  // Link-local fe80::/10
  if ((g0 & 0xffc0) === 0xfe80) return ['Link-Local Unicast', 'Link'];
  // Site-local fec0::/10 (deprecated)
  if ((g0 & 0xffc0) === 0xfec0) return ['Site-Local Unicast (deprecated)', 'Site'];
  // Multicast ff::/8
  if ((g0 & 0xff00) === 0xff00) {
    const scope = (g0 & 0x00f0) >> 4;
    const scopeNames = { 1:'Interface', 2:'Link', 4:'Admin', 5:'Site', 8:'Organization', 14:'Global' };
    return ['Multicast', scopeNames[scope] || 'Unknown'];
  }
  // IPv4-mapped ::ffff:x.x.x.x
  if (groups[0]===0 && groups[1]===0 && groups[2]===0 && groups[3]===0 && groups[4]===0 && groups[5]===0xffff)
    return ['IPv4-Mapped', 'Global'];
  // Global unicast 2000::/3
  if ((g0 & 0xe000) === 0x2000) return ['Global Unicast', 'Global'];
  // Documentation 2001:db8::/32
  if (g0 === 0x2001 && groups[1] === 0x0db8) return ['Documentation (RFC 3849)', 'N/A'];
  return ['Global Unicast', 'Global'];
}

function approxPow2(n) {
  // Returns human-readable approximation
  const exp10 = Math.floor(n * Math.log10(2));
  return '10^' + exp10;
}

// ── UTILITIES ─────────────────────────────────────────
function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function fmtNum(n) {
  if (n >= 1e18) return (n / 1e18).toFixed(2) + ' quintillion';
  if (n >= 1e15) return (n / 1e15).toFixed(2) + ' quadrillion';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + ' trillion';
  if (n >= 1e9)  return (n / 1e9).toFixed(2) + ' billion';
  if (n >= 1e6)  return (n / 1e6).toFixed(2) + ' million';
  return n.toLocaleString();
}

// ── ENTER KEY SUPPORT ─────────────────────────────────
document.getElementById('v4-ip').addEventListener('keydown', e => { if (e.key === 'Enter') calcV4(); });
document.getElementById('v4-cidr-num').addEventListener('keydown', e => { if (e.key === 'Enter') calcV4(); });
document.getElementById('v6-ip').addEventListener('keydown', e => { if (e.key === 'Enter') calcV6(); });
document.getElementById('v6-prefix-num').addEventListener('keydown', e => { if (e.key === 'Enter') calcV6(); });

// ── CLAMP NUMBER INPUTS ───────────────────────────────
document.getElementById('v4-cidr-num').addEventListener('input', function() {
  const v = parseInt(this.value);
  if (v > 32) this.value = 32;
  if (v < 0)  this.value = 0;
});
document.getElementById('v6-prefix-num').addEventListener('input', function() {
  const v = parseInt(this.value);
  if (v > 128) this.value = 128;
  if (v < 0)   this.value = 0;
});

// ── AUTO-RUN ON LOAD ──────────────────────────────────
window.addEventListener('load', () => {
  calcV4();
});
