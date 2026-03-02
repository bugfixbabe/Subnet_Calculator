# Subnet — IPv4 & IPv6 Subnet Calculator

A professional, fully-featured subnet calculator with a warm **brown & beige** design theme. Supports both IPv4 (32-bit) and IPv6 (128-bit) address families in a clean, responsive interface built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies.

---

## Features

### Design & Interface
- **Brown & Beige Color Theme** — warm, rich tones with `Playfair Display` serif headings and `Source Code Pro` monospace output
- **Fully Responsive** — works perfectly on desktop, tablet, and mobile
- **Smooth Animations** — card reveals, slide-in transitions, and hover effects
- **Click-to-Copy** — click any result value to instantly copy it to your clipboard
- **Copy Toast Notification** — subtle feedback confirmation when a value is copied
- **Calculation Counter** — tracks how many calculations you have run, saved via localStorage

### IPv4 Calculator
- Enter any valid IPv4 address with CIDR notation (0–32)
- Interactive slider + number input, both stay in sync
- **Results include:**
  - Network address
  - Broadcast address
  - Subnet mask (dotted decimal)
  - Wildcard mask
  - First and last usable host addresses
  - Total address count and usable host count
  - Host utilization progress bar
  - Full binary representation of IP and mask
  - IP class (A / B / C / D / E)
  - Network type (Private, Public, Loopback, Link-Local, etc.)
  - CIDR notation and host bit count

### IPv6 Calculator
- Accepts full or compressed IPv6 addresses (e.g. `2001:db8::1`)
- Prefix length slider from 0 to 128
- **Results include:**
  - Expanded (full 128-bit) address
  - Network prefix
  - Prefix mask
  - First and last addresses in the subnet
  - Total address count (human-readable for large values)
  - Binary representation (first 64 bits and last 64 bits)
  - Address type classification (Global Unicast, Link-Local, Multicast, Loopback, etc.)
  - Scope (Global, Link, Site, Interface, etc.)
  - CIDR notation and host bit count

---

## Getting Started

### Run Locally
1. Download or clone all four files into the same folder:
   ```
   index.html
   styles.css
   script.js
   README.md
   ```
2. Open `index.html` in any modern browser
3. No build step, no server, no dependencies needed

### Deploy to GitHub Pages
1. Create a new GitHub repository (e.g. `subnet-calculator`)
2. Upload all three files (`index.html`, `styles.css`, `script.js`)
3. Go to **Settings → Pages**
4. Set source to `main` branch, root folder
5. Your site will be live at `https://your-username.github.io/subnet-calculator/`

---

## How to Use

### IPv4
1. Click the **IPv4** tab (active by default)
2. Type an IPv4 address into the IP field (e.g. `192.168.1.0`)
3. Drag the CIDR slider or type a prefix length (0–32)
4. Click **Calculate Network** or press Enter
5. Results appear in four cards below

### IPv6
1. Click the **IPv6** tab
2. Type a valid IPv6 address (e.g. `2001:db8::` or `fe80::1`)
3. Set the prefix length using the slider or number field (0–128)
4. Click **Calculate Network** or press Enter
5. Results appear in four cards below

**Tip:** Click on any result value to copy it to your clipboard.

---

## Example Inputs

### IPv4 Examples
| Address | CIDR | Description |
|---------|------|-------------|
| `192.168.1.0` | `/24` | Standard home/office network — 254 usable hosts |
| `10.0.0.0` | `/8` | Large private Class A — 16+ million hosts |
| `172.16.0.0` | `/12` | RFC 1918 private Class B range |
| `192.168.10.0` | `/26` | Small subnet — 62 usable hosts |
| `10.10.0.0` | `/30` | Point-to-point link — 2 usable hosts |

### IPv6 Examples
| Address | Prefix | Description |
|---------|--------|-------------|
| `2001:db8::` | `/32` | Documentation address (RFC 3849) |
| `fe80::1` | `/64` | Link-local address |
| `2001:db8:abcd::` | `/48` | Typical ISP allocation |
| `::1` | `/128` | Loopback address |
| `ff02::1` | `/128` | All-nodes multicast |

---

## File Structure

```
subnet-calculator/
├── index.html    ← Full page structure, both IPv4 and IPv6 panels
├── styles.css    ← Brown & beige theme, layout, responsive styles
├── script.js     ← All calculation logic for IPv4 and IPv6
└── README.md     ← This file
```

---

## Technology Stack

- **HTML5** — semantic markup, accessible form elements
- **CSS3** — custom properties, CSS Grid, Flexbox, keyframe animations
- **JavaScript (ES6+)** — pure vanilla JS, no libraries or frameworks
- **Google Fonts** — Playfair Display, Source Code Pro, Lato
- **localStorage** — persists calculation counter across sessions
- **Clipboard API** — click-to-copy on all result values

---

## Customization

### Change Accent Color
Open `styles.css` and edit the root variables:
```css
:root {
  --brown-700: #5c3317;  /* button background */
  --brown-600: #7a4520;  /* hover state */
  --amber:     #c97d2a;  /* progress bar */
}
```
---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome / Edge (latest) | ✅ Full |
| Firefox (latest) | ✅ Full |
| Safari (latest) | ✅ Full |
| iOS Safari | ✅ Full |
| Chrome Mobile | ✅ Full |

The Clipboard API (used for click-to-copy) requires either a secure context (HTTPS) or localhost. Everything else works on plain HTTP as well.

---

## Troubleshooting

**Copy not working?**
The Clipboard API needs HTTPS or localhost. If you open the file directly via `file://`, copy may not work in some browsers. Serve it locally with a simple HTTP server or deploy to GitHub Pages.

**Slider and number input out of sync?**
Both inputs call `syncV4()` or `syncV6()` on every change, so they should always stay in sync. If you notice a discrepancy, refresh the page.

**IPv6 address not recognized?**
Make sure you are using valid colon-hex notation. Compressed forms like `::1`, `fe80::`, and `2001:db8::abcd` are all supported. Mixed IPv4/IPv6 notation (e.g. `::ffff:192.168.1.1`) is recognized as IPv4-Mapped.

---

## Planned Additions

- [ ] VLSM (Variable Length Subnet Masking) tool
- [ ] Subnet split / divide calculator
- [ ] Calculation history panel
- [ ] Export results to PDF or CSV
- [ ] IPv6 address type reference guide
- [ ] Offline support via Service Worker

---

## Author

**[Sukaina Seerat]**
- Cisco NetAcad Network Basics Certified
- GitHub: [https://github.com/bugfixbabe]
- LinkedIn: [Your LinkedIn URL]

---

## License

Open source — free to use, modify, and share for personal and commercial projects.
