# 🌐 IP Pulse — Advanced IP Geolocation & Intelligence Tracker

**IP Pulse** is a modern web-based **IP Geolocation & Network Intelligence Tool** that allows users to analyze an IPv4/IPv6 address or domain and retrieve useful information such as location, ISP, ASN, timezone, connection details, and security indicators.

The application also provides an interactive map to visualize the approximate geographical location of the target IP.

🔗 **Live Demo:** https://codewithrohiit.github.io/DETECTED-SERVER-/

---

## 🚀 Features

### 🔍 IP & Domain Lookup
- Search for IPv4 addresses
- Search for IPv6 addresses
- Search using domain names
- Detect your current public IP using **My IP**
- Quick sample IP addresses for testing
- Recent search history

### 📍 Geolocation Intelligence
Provides approximate geographical information including:

- 🌍 Country
- 🏙️ City
- 🗺️ Region / State
- 📮 Postal Code
- 📌 Latitude & Longitude
- 🏛️ Capital City
- ☎️ Calling Code
- 💰 Currency
- 🕐 Timezone
- ⏱️ Local time

### 🌐 Network & ASN Information

The application displays:

- ISP Name
- Organization
- Autonomous System Number (ASN)
- AS Name
- AS Domain
- Connection Type

### 🛡️ Security & Threat Analysis

IP Pulse can display available security-related indicators such as:

- Proxy Detection
- VPN Detection
- Tor Exit Node Detection
- Datacenter / Hosting Detection
- Crawler / Bot Detection
- Abuse / Blacklist Status
- Overall Risk Status

> ⚠️ Security and geolocation information depends on the external IP intelligence API and should not be treated as definitive.

### 🗺️ Interactive Map

The project uses **Leaflet.js** to display the approximate IP location on an interactive map.

Available map styles:

- 🌑 Dark Theme
- 🛣️ Street View
- 🛰️ Satellite Imagery

Users can also recenter the map on the detected location.

### 📊 Data Export

Users can:

- Copy complete JSON data
- Copy a text report
- Export results as JSON
- Export results as CSV
- View the raw API response

### 🎨 Modern UI

- Responsive design
- Dark / Light theme
- Glassmorphism-style interface
- Animated UI elements
- Live timezone clock
- Responsive layout for different screen sizes

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling & responsive UI |
| JavaScript | Application logic |
| Leaflet.js | Interactive maps |
| Font Awesome | Icons |
| Google Fonts | Typography |
| IP Geolocation API | IP intelligence & geolocation |

---

## 📂 Project Structure

```text
DETECTED-SERVER-/
│
├── index.html      # Main application interface
├── style.css       # UI styling and responsive design
├── app.js          # Application logic and API integration
└── README.md       # Project documentation
```

---

## ⚙️ How It Works

```text
User enters IP / Domain
          ↓
      JavaScript
          ↓
IP Geolocation / Intelligence API
          ↓
    Process API Response
          ↓
 ┌────────┼─────────┐
 ↓        ↓         ↓
Location Network  Security
 ↓        ↓         ↓
       Interactive Map
          ↓
      Results Display
```

---

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/codewithrohiit/DETECTED-SERVER-.git
```

### 2. Open the project

```bash
cd DETECTED-SERVER-
```

### 3. Run the application

You can simply open:

```text
index.html
```

in your browser.

For a better development environment, use **VS Code + Live Server**.

---

## 🌎 GitHub Pages

This project is deployed using GitHub Pages.

**Live Website:**

https://codewithrohiit.github.io/DETECTED-SERVER-/

---

## 🔐 Privacy & Accuracy

IP geolocation provides an **approximate location**, not the exact physical location of a person.

The accuracy of the displayed information depends on:

- IP address allocation
- ISP databases
- Geolocation databases
- External API data
- VPN / Proxy usage

This project should therefore **not be used to identify or track a person's exact physical location**.

---

## ⚠️ Disclaimer
