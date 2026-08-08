/**
 * IP Pulse — Advanced IP Geolocation & Intelligence Tracker
 * Main Client Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. DOM Element Selectors
  // ------------------------------------------------------------------------
  const ipInput = document.getElementById('ipInput');
  const searchForm = document.getElementById('searchForm');
  const clearInputBtn = document.getElementById('clearInputBtn');
  const myIpBtn = document.getElementById('myIpBtn');
  const themeToggle = document.getElementById('themeToggle');
  const recentSearchesWrapper = document.getElementById('recentSearches');
  const recentChipsContainer = document.getElementById('recentChips');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const errorToast = document.getElementById('errorToast');
  const errorMessage = document.getElementById('errorMessage');

  // Summary Banner
  const sumIp = document.getElementById('sumIp');
  const sumIpVersion = document.getElementById('sumIpVersion');
  const sumLocation = document.getElementById('sumLocation');
  const sumIsp = document.getElementById('sumIsp');
  const sumTimezone = document.getElementById('sumTimezone');
  const liveClock = document.getElementById('liveClock');

  // Security Card
  const riskScoreBadge = document.getElementById('riskScoreBadge');
  const secProxy = document.getElementById('secProxy');
  const secVpn = document.getElementById('secVpn');
  const secTor = document.getElementById('secTor');
  const secDatacenter = document.getElementById('secDatacenter');
  const secBot = document.getElementById('secBot');
  const secAbuse = document.getElementById('secAbuse');

  // Network Card
  const netIsp = document.getElementById('netIsp');
  const netOrg = document.getElementById('netOrg');
  const netAsn = document.getElementById('netAsn');
  const netAsName = document.getElementById('netAsName');
  const netAsDomain = document.getElementById('netAsDomain');
  const netConnType = document.getElementById('netConnType');

  // Geolocation Card
  const geoCity = document.getElementById('geoCity');
  const geoRegion = document.getElementById('geoRegion');
  const geoCountry = document.getElementById('geoCountry');
  const geoCountryCode = document.getElementById('geoCountryCode');
  const geoFlagImg = document.getElementById('geoFlagImg');
  const geoCapital = document.getElementById('geoCapital');
  const geoPostal = document.getElementById('geoPostal');
  const geoCoords = document.getElementById('geoCoords');
  const geoCallingCode = document.getElementById('geoCallingCode');
  const geoCurrency = document.getElementById('geoCurrency');
  const copyCoordsBtn = document.getElementById('copyCoordsBtn');

  // Map & Tools
  const mapOverlayLocation = document.getElementById('mapOverlayLocation');
  const mapStyleSelect = document.getElementById('mapStyleSelect');
  const recenterMapBtn = document.getElementById('recenterMapBtn');
  const copyAllJsonBtn = document.getElementById('copyAllJsonBtn');
  const copySummaryBtn = document.getElementById('copySummaryBtn');
  const downloadJsonBtn = document.getElementById('downloadJsonBtn');
  const downloadCsvBtn = document.getElementById('downloadCsvBtn');
  const toggleJsonBtn = document.getElementById('toggleJsonBtn');
  const jsonViewerContainer = document.getElementById('jsonViewerContainer');
  const rawJsonOutput = document.getElementById('rawJsonOutput');

  // ------------------------------------------------------------------------
  // 2. Application State Variables
  // ------------------------------------------------------------------------
  let currentIpData = null;
  let liveClockInterval = null;
  let leafletMap = null;
  let leafletMarker = null;
  let currentTileLayer = null;
  let currentCoordinates = [20, 0]; // Default world view

  // Map Tile Configurations
  const mapTiles = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const tileAttributions = {
    dark: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    streets: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP'
  };

  // ------------------------------------------------------------------------
  // 3. Theme Engine Init & Toggle
  // ------------------------------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem('ip_pulse_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-moon';
      themeToggle.title = 'Switch to Light Theme';
    } else {
      icon.className = 'fa-solid fa-sun';
      themeToggle.title = 'Switch to Dark Theme';
    }
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ip_pulse_theme', newTheme);
    updateThemeIcon(newTheme);
  });

  initTheme();

  // ------------------------------------------------------------------------
  // 4. Leaflet Map Initialization & Management
  // ------------------------------------------------------------------------
  function initMap() {
    if (leafletMap) return;

    leafletMap = L.map('map', {
      zoomControl: true,
      attributionControl: true
    }).setView(currentCoordinates, 3);

    // Default Tile Layer
    const selectedStyle = mapStyleSelect.value || 'dark';
    currentTileLayer = L.tileLayer(mapTiles[selectedStyle], {
      attribution: tileAttributions[selectedStyle],
      maxZoom: 18
    }).addTo(leafletMap);
  }

  function updateMapStyle(styleKey) {
    if (!leafletMap) return;

    if (currentTileLayer) {
      leafletMap.removeLayer(currentTileLayer);
    }

    const tileUrl = mapTiles[styleKey] || mapTiles.dark;
    const attribution = tileAttributions[styleKey] || tileAttributions.dark;

    currentTileLayer = L.tileLayer(tileUrl, {
      attribution: attribution,
      maxZoom: 18
    }).addTo(leafletMap);
  }

  function updateMapLocation(lat, lng, labelText = 'IP Location') {
    initMap();

    currentCoordinates = [lat, lng];

    // Create Custom Radar Marker Icon
    const customRadarIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="marker-pulse"></div>
        <div class="marker-pin"></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    if (leafletMarker) {
      leafletMarker.setLatLng([lat, lng]);
    } else {
      leafletMarker = L.marker([lat, lng], { icon: customRadarIcon }).addTo(leafletMap);
    }

    // Popup Info
    leafletMarker.bindPopup(`
      <div style="font-family: var(--font-main); text-align: center; color: #1e293b;">
        <strong style="font-size: 1rem;">${labelText}</strong><br/>
        <span style="font-size: 0.8rem; color: #64748b;">Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</span>
      </div>
    `).openPopup();

    leafletMap.flyTo([lat, lng], 11, {
      animate: true,
      duration: 1.5
    });

    mapOverlayLocation.textContent = labelText;
  }

  mapStyleSelect.addEventListener('change', (e) => {
    updateMapStyle(e.target.value);
  });

  recenterMapBtn.addEventListener('click', () => {
    if (leafletMap && currentCoordinates) {
      leafletMap.flyTo(currentCoordinates, 11, { animate: true, duration: 1 });
    }
  });

  // ------------------------------------------------------------------------
  // 5. Data Fetching & API Integration
  // ------------------------------------------------------------------------
  async function fetchIpDetails(query = '') {
    showLoadingState();
    hideError();

    const cleanQuery = query.trim();

    try {
      // Primary API: ipwho.is (HTTPS, CORS friendly, returns SVG flags, timezone, security)
      const primaryUrl = cleanQuery ? `https://ipwho.is/${encodeURIComponent(cleanQuery)}` : 'https://ipwho.is/';
      const response = await fetch(primaryUrl);
      const data = await response.json();

      if (data && data.success !== false) {
        currentIpData = parseIpwhoisData(data);
        renderIpDetails(currentIpData);
        saveSearchHistory(currentIpData.ip);
        return;
      }

      // If ipwho.is fails or returns success: false, fallback to ipapi.co
      console.warn('Primary provider returned invalid response, trying fallback...', data);
      await fetchFallbackIpDetails(cleanQuery);

    } catch (err) {
      console.warn('Primary provider error, attempting fallback provider:', err);
      try {
        await fetchFallbackIpDetails(cleanQuery);
      } catch (fallbackErr) {
        showError('Unable to resolve IP details. Please verify your network or search query.');
        resetLoadingState();
      }
    }
  }

  async function fetchFallbackIpDetails(query = '') {
    const fallbackUrl = query ? `https://ipapi.co/${encodeURIComponent(query)}/json/` : 'https://ipapi.co/json/';
    const response = await fetch(fallbackUrl);
    const data = await response.json();

    if (data && !data.error) {
      currentIpData = parseIpapiData(data);
      renderIpDetails(currentIpData);
      saveSearchHistory(currentIpData.ip);
    } else {
      throw new Error(data.reason || 'Fallback IP API failed');
    }
  }

  // ------------------------------------------------------------------------
  // 6. Data Parsers & Standardizers
  // ------------------------------------------------------------------------
  function parseIpwhoisData(d) {
    return {
      ip: d.ip || '--',
      type: d.type || (d.ip && d.ip.includes(':') ? 'IPv6' : 'IPv4'),
      continent: d.continent || '--',
      country: d.country || '--',
      countryCode: d.country_code || '--',
      region: d.region || '--',
      city: d.city || '--',
      latitude: d.latitude || 0,
      longitude: d.longitude || 0,
      postal: d.postal || 'N/A',
      callingCode: d.calling_code ? `+${d.calling_code}` : '--',
      capital: d.capital || '--',
      flagUrl: d.flag && d.flag.img ? d.flag.img : `https://flagcdn.com/w40/${(d.country_code || 'us').toLowerCase()}.png`,
      currency: d.currency ? `${d.currency.name || ''} (${d.currency.code || ''} ${d.currency.symbol || ''})` : '--',
      
      // Network
      isp: (d.connection && d.connection.isp) || d.isp || '--',
      org: (d.connection && d.connection.org) || d.org || '--',
      asn: (d.connection && d.connection.asn) ? `AS${d.connection.asn}` : '--',
      asName: (d.connection && d.connection.org) || '--',
      asDomain: (d.connection && d.connection.domain) || '--',
      connectionType: d.type || 'Standard',

      // Timezone
      timezoneId: (d.timezone && d.timezone.id) || 'UTC',
      timezoneOffset: (d.timezone && d.timezone.offset) ? formatGmtOffset(d.timezone.offset) : 'UTC+00:00',
      isDst: d.timezone ? d.timezone.is_dst : false,

      // Security
      security: {
        proxy: d.security ? Boolean(d.security.proxy) : false,
        vpn: d.security ? Boolean(d.security.vpn) : false,
        tor: d.security ? Boolean(d.security.tor) : false,
        datacenter: d.security ? Boolean(d.security.hosting) : false,
        bot: d.security ? Boolean(d.security.crawler) : false
      },

      raw: d
    };
  }

  function parseIpapiData(d) {
    const lat = d.latitude || 0;
    const lng = d.longitude || 0;
    return {
      ip: d.ip || '--',
      type: d.ip && d.ip.includes(':') ? 'IPv6' : 'IPv4',
      continent: d.continent_code || '--',
      country: d.country_name || '--',
      countryCode: d.country_code || '--',
      region: d.region || '--',
      city: d.city || '--',
      latitude: lat,
      longitude: lng,
      postal: d.postal || 'N/A',
      callingCode: d.country_calling_code || '--',
      capital: d.country_capital || '--',
      flagUrl: `https://flagcdn.com/w40/${(d.country_code || 'us').toLowerCase()}.png`,
      currency: d.currency || '--',

      // Network
      isp: d.org || d.asn || '--',
      org: d.org || '--',
      asn: d.asn || '--',
      asName: d.org || '--',
      asDomain: '--',
      connectionType: 'Standard',

      // Timezone
      timezoneId: d.timezone || 'UTC',
      timezoneOffset: d.utc_offset || 'UTC+00:00',
      isDst: false,

      // Security (Default Clean for basic tier)
      security: {
        proxy: false,
        vpn: false,
        tor: false,
        datacenter: d.org ? d.org.toLowerCase().includes('cloud') || d.org.toLowerCase().includes('amazon') || d.org.toLowerCase().includes('google') : false,
        bot: false
      },

      raw: d
    };
  }

  function formatGmtOffset(offsetInSeconds) {
    const hours = Math.floor(Math.abs(offsetInSeconds) / 3600);
    const minutes = Math.floor((Math.abs(offsetInSeconds) % 3600) / 60);
    const sign = offsetInSeconds >= 0 ? '+' : '-';
    const padH = String(hours).padStart(2, '0');
    const padM = String(minutes).padStart(2, '0');
    return `UTC${sign}${padH}:${padM}`;
  }

  // ------------------------------------------------------------------------
  // 7. UI Rendering & DOM Updates
  // ------------------------------------------------------------------------
  function renderIpDetails(data) {
    resetLoadingState();

    // Summary Banner
    sumIp.textContent = data.ip;
    sumIpVersion.textContent = data.type;
    sumLocation.textContent = `${data.city}, ${data.country}`;
    sumIsp.textContent = data.isp;
    sumTimezone.textContent = data.timezoneOffset;

    startLiveClock(data.timezoneId);

    // Security Card & Threat Rating Calculation
    const sec = data.security;
    secProxy.textContent = sec.proxy ? 'Detected' : 'False';
    secProxy.className = `sec-value ${sec.proxy ? 'text-error' : 'text-success'}`;

    secVpn.textContent = sec.vpn ? 'Detected' : 'False';
    secVpn.className = `sec-value ${sec.vpn ? 'text-error' : 'text-success'}`;

    secTor.textContent = sec.tor ? 'Detected' : 'False';
    secTor.className = `sec-value ${sec.tor ? 'text-error' : 'text-success'}`;

    secDatacenter.textContent = sec.datacenter ? 'Yes (Hosting)' : 'No (Residential/Cellular)';
    secDatacenter.className = `sec-value ${sec.datacenter ? 'text-warning' : 'text-main'}`;

    secBot.textContent = sec.bot ? 'Detected' : 'False';
    secBot.className = `sec-value ${sec.bot ? 'text-warning' : 'text-success'}`;

    // Risk Rating Calculation
    let threatCount = 0;
    if (sec.proxy) threatCount += 2;
    if (sec.vpn) threatCount += 1;
    if (sec.tor) threatCount += 3;
    if (sec.bot) threatCount += 1;

    if (threatCount >= 3) {
      riskScoreBadge.className = 'badge badge-error';
      riskScoreBadge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> High Risk / Anonymized';
      secAbuse.textContent = 'High Flagged';
      secAbuse.className = 'sec-value text-error';
    } else if (threatCount >= 1) {
      riskScoreBadge.className = 'badge badge-warning';
      riskScoreBadge.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Moderate Risk';
      secAbuse.textContent = 'Suspicious';
      secAbuse.className = 'sec-value text-warning';
    } else {
      riskScoreBadge.className = 'badge badge-success';
      riskScoreBadge.innerHTML = '<i class="fa-solid fa-check-double"></i> Clean / Low Risk';
      secAbuse.textContent = 'Clean Record';
      secAbuse.className = 'sec-value text-success';
    }

    // Network Card
    netIsp.textContent = data.isp;
    netOrg.textContent = data.org;
    netAsn.textContent = data.asn;
    netAsName.textContent = data.asName;
    netAsDomain.textContent = data.asDomain;
    netConnType.textContent = data.connectionType;

    // Geolocation Card
    geoCity.textContent = data.city;
    geoRegion.textContent = data.region;
    geoCountry.textContent = data.country;
    geoCountryCode.textContent = data.countryCode;

    if (data.flagUrl) {
      geoFlagImg.src = data.flagUrl;
      geoFlagImg.style.display = 'inline-block';
    } else {
      geoFlagImg.style.display = 'none';
    }

    geoCapital.textContent = data.capital;
    geoPostal.textContent = data.postal;
    geoCoords.textContent = `${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`;
    geoCallingCode.textContent = data.callingCode;
    geoCurrency.textContent = data.currency;

    // Map Location
    updateMapLocation(data.latitude, data.longitude, `${data.city}, ${data.country}`);

    // Raw JSON Viewer
    rawJsonOutput.textContent = JSON.stringify(data.raw, null, 2);
  }

  // ------------------------------------------------------------------------
  // 8. Live Local Clock Timer
  // ------------------------------------------------------------------------
  function startLiveClock(timeZoneId) {
    if (liveClockInterval) clearInterval(liveClockInterval);

    function updateTime() {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timeZoneId,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        liveClock.innerHTML = `<i class="fa-regular fa-clock"></i> ${formatter.format(now)}`;
      } catch (e) {
        liveClock.innerHTML = `<i class="fa-regular fa-clock"></i> --:--:--`;
      }
    }

    updateTime();
    liveClockInterval = setInterval(updateTime, 1000);
  }

  // ------------------------------------------------------------------------
  // 9. Loading Skeletons & Error Handling
  // ------------------------------------------------------------------------
  function showLoadingState() {
    sumIp.classList.add('skeleton-text');
    sumLocation.classList.add('skeleton-text');
    sumIsp.classList.add('skeleton-text');
    sumTimezone.classList.add('skeleton-text');
  }

  function resetLoadingState() {
    sumIp.classList.remove('skeleton-text');
    sumLocation.classList.remove('skeleton-text');
    sumIsp.classList.remove('skeleton-text');
    sumTimezone.classList.remove('skeleton-text');
  }

  function showError(msg) {
    errorMessage.textContent = msg;
    errorToast.style.display = 'flex';
  }

  function hideError() {
    errorToast.style.display = 'none';
  }

  // ------------------------------------------------------------------------
  // 10. Search History & LocalStorage
  // ------------------------------------------------------------------------
  function saveSearchHistory(ip) {
    if (!ip || ip === '--') return;
    let history = JSON.parse(localStorage.getItem('ip_pulse_history') || '[]');
    history = history.filter(item => item !== ip);
    history.unshift(ip);
    if (history.length > 5) history.pop();
    localStorage.setItem('ip_pulse_history', JSON.stringify(history));
    renderSearchHistory();
  }

  function renderSearchHistory() {
    const history = JSON.parse(localStorage.getItem('ip_pulse_history') || '[]');
    if (history.length === 0) {
      recentSearchesWrapper.style.display = 'none';
      return;
    }

    recentSearchesWrapper.style.display = 'flex';
    recentChipsContainer.innerHTML = '';

    history.forEach(ip => {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.textContent = ip;
      chip.addEventListener('click', () => {
        ipInput.value = ip;
        toggleClearButton();
        fetchIpDetails(ip);
      });
      recentChipsContainer.appendChild(chip);
    });
  }

  clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem('ip_pulse_history');
    renderSearchHistory();
  });

  // ------------------------------------------------------------------------
  // 11. Event Listeners & Interactive Handlers
  // ------------------------------------------------------------------------
  
  // Search Form Submit
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = ipInput.value;
    fetchIpDetails(query);
  });

  // Input Clear Button Toggle
  function toggleClearButton() {
    if (ipInput.value.trim().length > 0) {
      clearInputBtn.style.display = 'block';
    } else {
      clearInputBtn.style.display = 'none';
    }
  }

  ipInput.addEventListener('input', toggleClearButton);
  clearInputBtn.addEventListener('click', () => {
    ipInput.value = '';
    toggleClearButton();
    ipInput.focus();
  });

  // Sample Preset Chips Click Handler
  document.querySelectorAll('.sample-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const ip = chip.getAttribute('data-ip');
      ipInput.value = ip;
      toggleClearButton();
      fetchIpDetails(ip);
    });
  });

  // "My IP" Button Handler
  myIpBtn.addEventListener('click', () => {
    ipInput.value = '';
    toggleClearButton();
    fetchIpDetails('');
  });

  // Copy Coordinates Handler
  copyCoordsBtn.addEventListener('click', () => {
    if (currentIpData) {
      const text = `${currentIpData.latitude}, ${currentIpData.longitude}`;
      navigator.clipboard.writeText(text).then(() => {
        showCopyToast('Coordinates copied!');
      });
    }
  });

  // Copy JSON Handler
  copyAllJsonBtn.addEventListener('click', () => {
    if (currentIpData) {
      navigator.clipboard.writeText(JSON.stringify(currentIpData.raw, null, 2)).then(() => {
        showCopyToast('Full JSON copied to clipboard!');
      });
    }
  });

  // Copy Summary Text Report Handler
  copySummaryBtn.addEventListener('click', () => {
    if (!currentIpData) return;
    const report = `
=== IP PULSE REPORT ===
Target IP: ${currentIpData.ip} (${currentIpData.type})
Location: ${currentIpData.city}, ${currentIpData.region}, ${currentIpData.country} (${currentIpData.countryCode})
Coordinates: ${currentIpData.latitude}, ${currentIpData.longitude}
ISP: ${currentIpData.isp}
ASN: ${currentIpData.asn}
Timezone: ${currentIpData.timezoneOffset} (${currentIpData.timezoneId})
Proxy/VPN: ${currentIpData.security.proxy || currentIpData.security.vpn ? 'Yes' : 'No'}
=======================
`.trim();
    navigator.clipboard.writeText(report).then(() => {
      showCopyToast('Text summary report copied!');
    });
  });

  // Download JSON Export
  downloadJsonBtn.addEventListener('click', () => {
    if (!currentIpData) return;
    const blob = new Blob([JSON.stringify(currentIpData.raw, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-report-${currentIpData.ip}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Download CSV Export
  downloadCsvBtn.addEventListener('click', () => {
    if (!currentIpData) return;
    const headers = ['IP', 'Type', 'City', 'Region', 'Country', 'CountryCode', 'Latitude', 'Longitude', 'ISP', 'ASN', 'Timezone', 'Proxy', 'VPN'];
    const row = [
      `"${currentIpData.ip}"`,
      `"${currentIpData.type}"`,
      `"${currentIpData.city}"`,
      `"${currentIpData.region}"`,
      `"${currentIpData.country}"`,
      `"${currentIpData.countryCode}"`,
      currentIpData.latitude,
      currentIpData.longitude,
      `"${currentIpData.isp}"`,
      `"${currentIpData.asn}"`,
      `"${currentIpData.timezoneOffset}"`,
      currentIpData.security.proxy,
      currentIpData.security.vpn
    ];
    const csvContent = `${headers.join(',')}\n${row.join(',')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-report-${currentIpData.ip}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Raw JSON Drawer Toggle
  toggleJsonBtn.addEventListener('click', () => {
    if (jsonViewerContainer.style.display === 'none') {
      jsonViewerContainer.style.display = 'block';
      toggleJsonBtn.textContent = 'Collapse';
    } else {
      jsonViewerContainer.style.display = 'none';
      toggleJsonBtn.textContent = 'Expand';
    }
  });

  // Transient Toast Notification Helper
  function showCopyToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'alert alert-error';
    toast.style.background = 'rgba(16, 185, 129, 0.9)';
    toast.style.color = '#ffffff';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.zIndex = '9999';
    toast.style.margin = '0';
    toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
    toast.innerHTML = `<i class="fa-solid fa-check"></i> <span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2500);
  }

  // ------------------------------------------------------------------------
  // 12. Startup Initialization
  // ------------------------------------------------------------------------
  renderSearchHistory();
  initMap();
  
  // Auto-detect current public IP on first load
  fetchIpDetails('');

});
