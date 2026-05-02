import { useEffect, useMemo, useState } from "react";

function readJson(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function saveSession(session) {
  localStorage.setItem("logiconnect_session", JSON.stringify(session));
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem("logiconnect_session") || "null");
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem("logiconnect_session");
}

function getViewerStorageKey() {
  return `logiconnect_pdf_viewer_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function openStoredFile(fileData, fileName = "document") {
  if (!fileData) {
    alert("No document found to view.");
    return;
  }

  try {
    const viewerKey = getViewerStorageKey();
    const safeName = fileName || "document.pdf";
    const fileType = fileData?.type || (String(fileData).startsWith("data:") ? String(fileData).slice(5, String(fileData).indexOf(";")) : "application/pdf");

    if (typeof Blob !== "undefined" && fileData instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem(viewerKey, JSON.stringify({ fileName: safeName, fileType, fileData: reader.result }));
        window.open(`${window.location.origin}${window.location.pathname}#/pdf-viewer/${viewerKey}`, "_blank", "noopener,noreferrer");
      };
      reader.onerror = () => alert("Unable to open this document.");
      reader.readAsDataURL(fileData);
      return;
    }

    localStorage.setItem(viewerKey, JSON.stringify({ fileName: safeName, fileType, fileData }));
    window.open(`${window.location.origin}${window.location.pathname}#/pdf-viewer/${viewerKey}`, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Unable to open file", error);
    alert("Unable to open this document.");
  }
}

function PdfViewerPage() {
  const [viewerData, setViewerData] = useState(null);

  useEffect(() => {
    const key = window.location.hash.replace("#/pdf-viewer/", "");
    try {
      setViewerData(JSON.parse(localStorage.getItem(key) || "null"));
    } catch {
      setViewerData(null);
    }
  }, []);

  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = `${window.location.origin}${window.location.pathname}`;
  };

  if (!viewerData?.fileData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="rounded-3xl bg-white/10 p-8 text-center shadow-2xl">
          <div className="text-2xl font-semibold">Document not found</div>
          <button type="button" onClick={goBack} className="mt-6 rounded-2xl bg-cyan-500 px-6 py-3 font-semibold text-white hover:bg-cyan-600">Back</button>
        </div>
      </div>
    );
  }

  const isImage = String(viewerData.fileType || "").startsWith("image/") || /^data:image\//.test(String(viewerData.fileData));

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-slate-900 px-5 py-4 shadow-lg">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold">{viewerData.fileName || "Document Viewer"}</div>
          <div className="text-xs text-slate-400">PDF Viewer</div>
        </div>
        <button type="button" onClick={goBack} className="rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-600">Back</button>
      </div>
      <div className="min-h-0 flex-1">
        {isImage ? (
          <div className="flex h-full items-center justify-center overflow-auto bg-slate-950 p-5">
            <img src={viewerData.fileData} alt={viewerData.fileName || "Document"} className="max-h-full max-w-full rounded-xl object-contain shadow-2xl" />
          </div>
        ) : (
          <iframe src={viewerData.fileData} title={viewerData.fileName || "PDF Viewer"} className="h-full w-full border-0 bg-white" />
        )}
      </div>
    </div>
  );
}

const PORTS_BY_COUNTRY = {
  "Sri Lanka": ["Colombo", "Hambantota", "Trincomalee"],
  "India": ["Mumbai", "Chennai", "Nhava Sheva"],
  "Singapore": ["Singapore"],
  "United Arab Emirates": ["Jebel Ali", "Abu Dhabi"],
  "Japan": ["Yokohama", "Tokyo", "Osaka"],
  "South Korea": ["Busan", "Incheon"],
  "China": ["Shanghai", "Shenzhen", "Ningbo"],
  "Malaysia": ["Port Klang", "Tanjung Pelepas"],
  "Thailand": ["Laem Chabang", "Bangkok"],
  "Indonesia": ["Jakarta", "Surabaya"],
  "Vietnam": ["Ho Chi Minh City", "Hai Phong"],
  "Bangladesh": ["Chittagong"],
  "Pakistan": ["Karachi"],
  "Australia": ["Sydney", "Melbourne"],
  "United States": ["Los Angeles", "New York", "Houston"],
};

const COUNTRY_PHONE_OPTIONS = [
  { country: "Sri Lanka", code: "+94" },
  { country: "India", code: "+91" },
  { country: "Singapore", code: "+65" },
  { country: "United Arab Emirates", code: "+971" },
  { country: "Japan", code: "+81" },
  { country: "South Korea", code: "+82" },
  { country: "China", code: "+86" },
  { country: "Malaysia", code: "+60" },
  { country: "Thailand", code: "+66" },
  { country: "Indonesia", code: "+62" },
  { country: "Vietnam", code: "+84" },
  { country: "Bangladesh", code: "+880" },
  { country: "Pakistan", code: "+92" },
  { country: "Nepal", code: "+977" },
  { country: "Maldives", code: "+960" },
  { country: "Australia", code: "+61" },
  { country: "New Zealand", code: "+64" },
  { country: "United Kingdom", code: "+44" },
  { country: "Germany", code: "+49" },
  { country: "France", code: "+33" },
  { country: "Italy", code: "+39" },
  { country: "Netherlands", code: "+31" },
  { country: "Belgium", code: "+32" },
  { country: "Spain", code: "+34" },
  { country: "Turkey", code: "+90" },
  { country: "Saudi Arabia", code: "+966" },
  { country: "Qatar", code: "+974" },
  { country: "Kuwait", code: "+965" },
  { country: "Oman", code: "+968" },
  { country: "Bahrain", code: "+973" },
  { country: "United States", code: "+1" },
  { country: "Canada", code: "+1" },
];

function normalizeUserType(type) {
  return String(type || "").trim().toUpperCase();
}

function seedData() {
  const existingUsers = readJson("users", []);
  const hasAdmin = existingUsers.some((user) => user.email?.toLowerCase() === "admin@logiconnect.com");
  const hasCompany = existingUsers.some((user) => normalizeUserType(user.type) === "COMPANY");
  const hasCustomer = existingUsers.some((user) => normalizeUserType(user.type) === "CUSTOMER");

  const nextUsers = [...existingUsers];

  if (!hasAdmin) {
    nextUsers.push({
      type: "ADMIN",
      name: "ADMIN",
      email: "admin@logiconnect.com",
      password: "Admin@123",
      mobile: "",
      city: "",
      country: "",
      address1: "",
      address2: "",
      createdAt: new Date().toISOString(),
    });
  }

  if (!hasCompany) {
    nextUsers.push({
      type: "COMPANY",
      name: "GSD",
      email: "company@logiconnect.com",
      password: "Test@123",
      mobile: "+94 777247671",
      city: "Colombo",
      country: "Sri Lanka",
      address1: "No. 01",
      address2: "Main Road",
      servicesOffered: ["FCL", "LCL", "Air Freight", "Sea Freight", "Customs Clearance", "Inland Transportation", "Warehousing"],
      approvalStatus: "APPROVED",
      createdAt: new Date().toISOString(),
    });
  }

  if (!hasCustomer) {
    nextUsers.push({
      type: "CUSTOMER",
      name: "SEYMIYON",
      email: "customer@logiconnect.com",
      password: "Test@123",
      mobile: "+94 771234567",
      city: "Wattala",
      country: "Sri Lanka",
      address1: "No. 10",
      address2: "Station Road",
      createdAt: new Date().toISOString(),
    });
  }

  writeJson(
    "users",
    nextUsers.map((user) =>
      normalizeUserType(user.type) === "COMPANY"
        ? { ...user, approvalStatus: user.approvalStatus || "PENDING" }
        : user
    )
  );

  if (!localStorage.getItem("quote_requests")) writeJson("quote_requests", []);
  if (!localStorage.getItem("bookings")) writeJson("bookings", []);
  if (!localStorage.getItem("documents")) writeJson("documents", []);
  if (!localStorage.getItem("payments")) writeJson("payments", []);
}

function StatCard({ label, value, note, icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-slate-500">{label}</div>
          <div className="mt-2 text-5xl font-semibold text-slate-900">{value}</div>
          {note ? <div className="mt-2 text-sm text-emerald-600">{note}</div> : null}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

function SectionCard({ title, badge, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
        {badge ? <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{badge}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function VesselTrackingSimulator({ userEmail = "", userType = "CUSTOMER" }) {
  const [selectedId, setSelectedId] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const portCoords = {
    Colombo: { x: 56, y: 67 },
    Hambantota: { x: 58, y: 70 },
    Trincomalee: { x: 59, y: 64 },
    Mumbai: { x: 51, y: 60 },
    Chennai: { x: 56, y: 61 },
    "Nhava Sheva": { x: 52, y: 59 },
    Singapore: { x: 69, y: 66 },
    "Jebel Ali": { x: 44, y: 56 },
    "Abu Dhabi": { x: 45, y: 55 },
    Yokohama: { x: 84, y: 49 },
    Tokyo: { x: 85, y: 50 },
    Osaka: { x: 82, y: 52 },
    Busan: { x: 81, y: 47 },
    Incheon: { x: 80, y: 46 },
    Shanghai: { x: 78, y: 52 },
    Shenzhen: { x: 76, y: 57 },
    Ningbo: { x: 79, y: 53 },
    "Port Klang": { x: 68, y: 67 },
    "Tanjung Pelepas": { x: 68, y: 68 },
    "Laem Chabang": { x: 72, y: 63 },
    Bangkok: { x: 71, y: 62 },
    Jakarta: { x: 71, y: 75 },
    Surabaya: { x: 74, y: 76 },
    "Ho Chi Minh City": { x: 73, y: 62 },
    "Hai Phong": { x: 75, y: 58 },
    Chittagong: { x: 66, y: 59 },
    Karachi: { x: 48, y: 58 },
    Sydney: { x: 88, y: 86 },
    Melbourne: { x: 86, y: 90 },
    "Los Angeles": { x: 11, y: 52 },
    "New York": { x: 22, y: 48 },
    Houston: { x: 16, y: 58 },
    Rotterdam: { x: 40, y: 39 },
    Hamburg: { x: 41, y: 37 },
  };

  const requests = readJson("quote_requests", []);
  const trackingItems = requests
    .filter((item) => {
      const ownerMatch = userType === "COMPANY" ? item.companyEmail === userEmail : item.customerEmail === userEmail;
      return ownerMatch && item.status === "Accepted" && item.vesselName && item.originPort && item.destinationPort;
    })
    .map((item) => {
      const originPoint = portCoords[item.originPort] || { x: 56, y: 67 };
      const destinationPoint = portCoords[item.destinationPort] || { x: 69, y: 66 };
      const startTs = item.polDate ? new Date(`${item.polDate}T00:00:00`).getTime() : now - 86400000;
      const endTs = item.podDate ? new Date(`${item.podDate}T23:59:59`).getTime() : now + 86400000;
      const total = Math.max(endTs - startTs, 1);
      const raw = (now - startTs) / total;
      const progress = Math.max(0, Math.min(1, raw));
      const shipX = originPoint.x + (destinationPoint.x - originPoint.x) * progress;
      const shipY = originPoint.y + (destinationPoint.y - originPoint.y) * progress;
      const angle = Math.atan2(destinationPoint.y - originPoint.y, destinationPoint.x - originPoint.x) * (180 / Math.PI);
      return {
        id: item.id,
        vessel: item.vesselName,
        voyage: item.voyageNumber || "-",
        originPort: item.originPort,
        destinationPort: item.destinationPort,
        polDate: item.polDate || "-",
        podDate: item.podDate || "-",
        status: now < startTs ? "Scheduled" : now > endTs ? "Arrived" : "In Transit",
        progressPercent: Math.round(progress * 100),
        originPoint,
        destinationPoint,
        shipX,
        shipY,
        shipAngle: angle,
      };
    });

  useEffect(() => {
    if (!trackingItems.length) {
      setSelectedId("");
      return;
    }
    if (!trackingItems.some((item) => item.id === selectedId)) {
      setSelectedId(trackingItems[0].id);
    }
  }, [trackingItems, selectedId]);

  const selectedRoute = trackingItems.find((item) => item.id === selectedId) || trackingItems[0] || null;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tracked Vessels" value={String(trackingItems.length)} icon="🚢" />
        <StatCard label="Origin Ports" value={String(new Set(trackingItems.map((r) => r.originPort)).size)} icon="📍" />
        <StatCard label="Destination Ports" value={String(new Set(trackingItems.map((r) => r.destinationPort)).size)} icon="🧭" />
        <StatCard label="Live Ships" value={String(trackingItems.filter((r) => r.status === "In Transit").length)} icon="⛴️" />
      </div>

      <SectionCard title="Global Vessel Tracking Map" badge="Live Ship Simulator">
        {trackingItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
            No accepted vessel routes available yet. Set Vessel Name, Origin Port, Destination Port, POL Date, and POD Date in accepted quote requests to show the simulator.
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[0.85fr_0.95fr_1.7fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-lg font-semibold text-slate-900">Tracked Fleet</div>
              <div className="mt-4 space-y-3">
                {trackingItems.map((route) => (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setSelectedId(route.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${selectedId === route.id ? "border-cyan-500 bg-cyan-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-900">{route.vessel}</div>
                        <div className="mt-1 text-sm text-slate-500">{route.originPort} → {route.destinationPort}</div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${route.status === "In Transit" ? "bg-emerald-100 text-emerald-700" : route.status === "Arrived" ? "bg-cyan-100 text-cyan-700" : "bg-amber-100 text-amber-700"}`}>{route.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-lg font-semibold text-slate-900">Selected Vessel Details</div>
              {selectedRoute ? (
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="font-semibold text-slate-900">Vessel:</span> {selectedRoute.vessel}</div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="font-semibold text-slate-900">Voyage:</span> {selectedRoute.voyage}</div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="font-semibold text-slate-900">Origin Port:</span> {selectedRoute.originPort}</div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="font-semibold text-slate-900">Destination Port:</span> {selectedRoute.destinationPort}</div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="font-semibold text-slate-900">POL Date:</span> {selectedRoute.polDate}</div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="font-semibold text-slate-900">POD Date:</span> {selectedRoute.podDate}</div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="font-semibold text-slate-900">Progress:</span> {selectedRoute.progressPercent}%</div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="font-semibold text-slate-900">Live Location:</span> {selectedRoute.shipX.toFixed(1)}%, {selectedRoute.shipY.toFixed(1)}%</div>
                </div>
              ) : null}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-lg font-semibold text-slate-900">Global Map</div>
                <div className="text-sm text-slate-500">Origin, destination, and live ship</div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#dbeafe]">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
                  alt="Global map"
                  className="h-[520px] w-full object-cover"
                />
                {trackingItems.map((route) => {
                  const isSelected = selectedRoute?.id === route.id;
                  const lineLength = Math.sqrt(((route.destinationPoint.x - route.originPoint.x) ** 2) + ((route.destinationPoint.y - route.originPoint.y) ** 2));
                  return (
                    <div key={route.id}>
                      <div
                        className="pointer-events-none absolute border-t-2 border-dashed border-cyan-500"
                        style={{
                          left: `${route.originPoint.x}%`,
                          top: `${route.originPoint.y}%`,
                          width: `${Math.max(lineLength, 4)}%`,
                          transform: `rotate(${Math.atan2(route.destinationPoint.y - route.originPoint.y, route.destinationPoint.x - route.originPoint.x)}rad)`,
                          transformOrigin: "0 0",
                          opacity: isSelected ? 1 : 0.35,
                        }}
                      />
                      <div
                        className={`absolute -translate-x-1/2 -translate-y-1/2 ${isSelected ? "z-20" : "z-10"}`}
                        style={{ left: `${route.originPoint.x}%`, top: `${route.originPoint.y}%` }}
                      >
                        <div className="rounded-full border-4 border-white bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">O</div>
                        <div className="mt-2 rounded-lg bg-white/95 px-2 py-1 text-xs font-semibold text-slate-800 shadow">{route.originPort}</div>
                      </div>
                      <div
                        className={`absolute -translate-x-1/2 -translate-y-1/2 ${isSelected ? "z-20" : "z-10"}`}
                        style={{ left: `${route.destinationPoint.x}%`, top: `${route.destinationPoint.y}%` }}
                      >
                        <div className="rounded-full border-4 border-white bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-lg">D</div>
                        <div className="mt-2 rounded-lg bg-white/95 px-2 py-1 text-xs font-semibold text-slate-800 shadow">{route.destinationPort}</div>
                      </div>
                      <div
                        className={`absolute -translate-x-1/2 -translate-y-1/2 text-2xl transition-all duration-1000 ${isSelected ? "z-30 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" : "z-20 opacity-70"}`}
                        style={{
                          left: `${route.shipX}%`,
                          top: `${route.shipY}%`,
                          transform: `translate(-50%, -50%) rotate(${route.shipAngle}deg)`,
                        }}
                        title={`${route.vessel} live ship`}
                      >
                        ⛴️
                      </div>
                    </div>
                  );
                })}
                <div className="absolute bottom-4 left-4 flex gap-3 rounded-xl bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow">
                  <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-emerald-500" /> Origin Port</div>
                  <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-rose-500" /> Destination Port</div>
                  <div className="flex items-center gap-2"><span className="text-base">⛴️</span> Live Ship</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function AdminDashboard({ adminData, onLogout }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [approvalRefreshTick, setApprovalRefreshTick] = useState(0);
  const users = readJson("users", []);
  const companies = users.filter((user) => normalizeUserType(user.type) === "COMPANY");
  const pendingCompanies = companies.filter((company) => (company.approvalStatus || "PENDING") === "PENDING");
  const customers = users.filter((user) => normalizeUserType(user.type) === "CUSTOMER");
  const bookings = readJson("bookings", []);
  const payments = readJson("payments", []);
  const quotes = readJson("quote_requests", []);
  const tabs = ["Overview", "Companies", "Users", "Bookings", "Payments", "Reviews", "Settings"];

  const totalRevenue = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const updateCompanyApproval = (companyEmail, approvalStatus) => {
    writeJson(
      "users",
      readJson("users", []).map((item) =>
        item.email === companyEmail ? { ...item, approvalStatus } : item
      )
    );
    setApprovalRefreshTick((prev) => prev + 1);
  };

  const renderList = (title, items, emptyText, renderItem) => (
    <SectionCard title={title}>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">{emptyText}</div>
      ) : (
        <div className="space-y-3">{items.map(renderItem)}</div>
      )}
    </SectionCard>
  );

  return (
    <div className="min-h-screen bg-[#eef4fb] text-slate-900">
      <header className="bg-[#07162c] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <div className="text-3xl font-semibold">Admin Dashboard</div>
            <div className="text-slate-300">{adminData?.email || "admin@logiconnect.com"}</div>
          </div>
          <button type="button" onClick={onLogout} className="text-sm font-semibold">Logout</button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-8 rounded-full bg-[#e8e8ed] p-1">
          <div className="grid grid-cols-3 gap-1 text-center text-sm font-medium md:grid-cols-7">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-3 transition ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "Overview" && (
          <div className="space-y-7">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Companies" value={String(companies.length)} icon="🏢" />
              <StatCard label="Active Users" value={String(users.length)} icon="👥" />
              <StatCard label="Active Shipments" value={String(bookings.length)} icon="🚢" />
              <StatCard label="Revenue (MTD)" value={`$${totalRevenue.toLocaleString()}`} icon="💲" />
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              <SectionCard title="Pending Company Approvals" badge={`${pendingCompanies.length} Pending`}>
                {pendingCompanies.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                    No company applications available.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingCompanies.slice(0, 5).map((company) => {
                      const approvalStatus = company.approvalStatus || "PENDING";
                      const locked = approvalStatus !== "PENDING";
                      return (
                        <div key={company.email} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div>
                            <div className="text-xl font-semibold text-slate-900">{company.name}</div>
                            <div className="mt-1 text-base text-slate-600">{company.country || company.city || "-"}</div>
                            <div className="mt-1 text-sm text-slate-400">
                              Submitted: {new Date(company.createdAt || Date.now()).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                            <div className="mt-2">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${approvalStatus === "APPROVED" ? "bg-emerald-100 text-emerald-700" : approvalStatus === "REJECTED" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                                {approvalStatus === "APPROVED" ? "Approved" : approvalStatus === "REJECTED" ? "Rejected" : "Pending"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateCompanyApproval(company.email, "APPROVED")}
                              disabled={locked}
                              className={`rounded-xl p-3 text-white transition ${locked ? "cursor-not-allowed bg-slate-300" : "bg-green-500 hover:bg-green-600"}`}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button
                              type="button"
                              onClick={() => updateCompanyApproval(company.email, "REJECTED")}
                              disabled={locked}
                              className={`rounded-xl p-3 text-white transition ${locked ? "cursor-not-allowed bg-slate-300" : "bg-rose-600 hover:bg-rose-700"}`}
                              title="Reject"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
              <SectionCard title="System Alerts" badge="Monitoring">
                <div className="space-y-3 text-slate-700">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">Admin monitoring is active.</div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">Payments and bookings can be reviewed here.</div>
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {activeTab === "Companies" &&
          renderList("Companies", companies, "No companies available.", (company) => (
            <div key={company.email} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold text-slate-900">{company.name}</div>
              <div className="text-sm text-slate-500">{company.email}</div>
              <div className="mt-1 text-sm text-cyan-700">{company.country || "-"}</div>
            </div>
          ))}

        {activeTab === "Users" &&
          renderList("Users", users, "No users available.", (user) => (
            <div key={user.email} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold text-slate-900">{user.name || "-"}</div>
              <div className="text-sm text-slate-500">{user.email}</div>
              <div className="mt-1 text-sm text-cyan-700">{user.type}</div>
            </div>
          ))}

        {activeTab === "Bookings" &&
          renderList("Bookings", bookings, "No bookings available.", (booking) => (
            <div key={booking.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold text-slate-900">{booking.id}</div>
              <div className="text-sm text-slate-500">{booking.companyName || "-"} • {booking.customerName || "-"}</div>
              <div className="mt-1 text-sm text-emerald-700">{booking.status || "Pending"}</div>
            </div>
          ))}

        {activeTab === "Payments" &&
          renderList("Payments", payments, "No payments available.", (payment) => (
            <div key={payment.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold text-slate-900">{payment.id}</div>
              <div className="text-sm text-slate-500">{payment.bookingId || "-"}</div>
              <div className="mt-1 text-sm text-emerald-700">${Number(payment.amount || 0).toLocaleString()} • {payment.status || "Pending"}</div>
            </div>
          ))}

        {activeTab === "Reviews" &&
          renderList(
            "Reviews",
            [
              { id: "r1", name: "John Chen", text: "Excellent shipping support and tracking." },
              { id: "r2", name: "Sarah Johnson", text: "Reliable partner for regular shipments." },
            ],
            "No reviews available.",
            (review) => (
              <div key={review.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="font-semibold text-slate-900">{review.name}</div>
                <div className="text-sm text-slate-500">{review.text}</div>
              </div>
            )
          )}

        {activeTab === "Settings" &&
          renderList(
            "Settings",
            [
              { id: "admin-email", label: "Admin Email", value: adminData?.email || "admin@logiconnect.com" },
              { id: "customers", label: "Customer Accounts", value: String(customers.length) },
              { id: "quotes", label: "Quote Requests", value: String(quotes.length) },
            ],
            "No settings available.",
            (item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="font-semibold text-slate-900">{item.label}</div>
                <div className="text-sm text-slate-500">{item.value}</div>
              </div>
            )
          )}
      </main>
    </div>
  );
}

function CustomerDashboard({ user, onLogout }) {
  const [showCustomerProfile, setShowCustomerProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedCompanyEmail, setSelectedCompanyEmail] = useState("");
  const [directorySearch, setDirectorySearch] = useState("");
  const [directoryCountryFilter, setDirectoryCountryFilter] = useState("");
  const [viewProfileCompany, setViewProfileCompany] = useState(null);
  const [profileTab, setProfileTab] = useState("Overview");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [receiptFiles, setReceiptFiles] = useState({});
  const [showQuotePage, setShowQuotePage] = useState(false);
  const [customerDocumentTab, setCustomerDocumentTab] = useState("Customer");
  const [customerDocumentDrafts, setCustomerDocumentDrafts] = useState({});
  const [customerProfileForm, setCustomerProfileForm] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    city: user?.city || "",
    address1: user?.address1 || "",
    address2: user?.address2 || "",
  }));
  const [quoteForm, setQuoteForm] = useState({
    originPort: "",
    originCountry: "",
    destinationPort: "",
    destinationCountry: "",
    shipmentType: "IMPORT",
    containerType: "FCL",
    containerSize: "",
    quantity: "",
    cargoType: "",
    cargoReadyDate: "",
    incoterm: "",
  });

  const email = user?.email || "";
  const customerInitial = String(user?.name || user?.email || "C").charAt(0).toUpperCase();
  const companies = readJson("users", []).filter((item) => normalizeUserType(item.type) === "COMPANY");
  const approvedCompaniesCount = companies.filter((item) => (item.approvalStatus || "PENDING") === "APPROVED").length;
  const requests = readJson("quote_requests", []).filter((item) => item.customerEmail === email);
  const bookings = readJson("bookings", []).filter((item) => item.customerEmail === email);
  const documents = readJson("documents", []).filter((item) => item.customerEmail === email);
  const payments = readJson("payments", []).filter((item) => item.customerEmail === email);

  const companyCountries = [...new Set(companies.map((company) => company.country).filter(Boolean))].sort();
  const filteredCompanies = companies.filter((company) => {
    const q = directorySearch.trim().toLowerCase();
    const matchesSearch = !q || company.name?.toLowerCase().includes(q) || company.email?.toLowerCase().includes(q) || company.country?.toLowerCase().includes(q);
    const matchesCountry = !directoryCountryFilter || company.country === directoryCountryFilter;
    return matchesSearch && matchesCountry;
  });
  const selectedCompany = companies.find((item) => item.email === selectedCompanyEmail) || null;
  const latestViewedCompany = viewProfileCompany
    ? companies.find((item) => item.email === viewProfileCompany.email) || viewProfileCompany
    : null;

  const getDisplayServices = (company) => {
    const services = Array.isArray(company?.servicesOffered) ? company.servicesOffered : [];
    return services.length ? services : ["FCL", "LCL", "Air Freight", "Sea Freight", "Customs Clearance", "Inland Transportation", "Warehousing"];
  };

  useEffect(() => {
    setCustomerProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      city: user?.city || "",
      address1: user?.address1 || "",
      address2: user?.address2 || "",
    });
  }, [user]);

  const saveCustomerProfile = () => {
    const updatedUser = {
      ...user,
      name: customerProfileForm.name,
      mobile: customerProfileForm.mobile,
      city: customerProfileForm.city,
      address1: customerProfileForm.address1,
      address2: customerProfileForm.address2,
    };
    writeJson("users", readJson("users", []).map((item) => item.email === user.email ? updatedUser : item));
    saveSession({ type: "CUSTOMER", email: updatedUser.email });
    setQuoteMessage("Customer profile saved successfully.");
  };

  const totalPaid = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingAmount = payments.filter((p) => p.status === "Pending").reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const openQuotePage = (companyEmail) => {
    setSelectedCompanyEmail(companyEmail);
    setViewProfileCompany(null);
    setQuoteMessage("");
    setShowQuotePage(true);
    setQuoteForm({
      originPort: "",
      originCountry: "",
      destinationPort: "",
      destinationCountry: "",
      shipmentType: "IMPORT",
      containerType: "FCL",
      containerSize: "",
      quantity: "",
      cargoType: "",
      cargoReadyDate: "",
      incoterm: "",
    });
  };

  const createQuoteRequest = () => {
    if (!selectedCompany) return setQuoteMessage("Please select a company.");
    if (!quoteForm.originCountry || !quoteForm.originPort || !quoteForm.destinationCountry || !quoteForm.destinationPort) {
      return setQuoteMessage("Please complete origin and destination details.");
    }
    if (!quoteForm.containerSize || !quoteForm.quantity || !quoteForm.cargoType || !quoteForm.cargoReadyDate || !quoteForm.incoterm) {
      return setQuoteMessage("Please complete all quote fields.");
    }
    const all = readJson("quote_requests", []);
    writeJson("quote_requests", [...all, {
      id: `QR-${Date.now().toString().slice(-6)}`,
      customerName: user?.name || email,
      customerEmail: email,
      companyName: selectedCompany.name,
      companyEmail: selectedCompany.email,
      shipmentType: quoteForm.shipmentType,
      containerType: quoteForm.containerType,
      containerSize: quoteForm.containerSize,
      quantity: quoteForm.quantity,
      cargoType: quoteForm.cargoType,
      originPort: quoteForm.originPort,
      originCountry: quoteForm.originCountry,
      destinationPort: quoteForm.destinationPort,
      destinationCountry: quoteForm.destinationCountry,
      cargoReadyDate: quoteForm.cargoReadyDate,
      incoterm: quoteForm.incoterm,
      status: "New",
      createdAt: new Date().toISOString(),
    }]);
    setQuoteMessage("Quote request sent successfully.");
    setShowQuotePage(false);
    setSelectedCompanyEmail("");
  };

  const confirmBooking = (request) => {
    const allBookings = readJson("bookings", []);
    if (allBookings.some((booking) => booking.requestId === request.id)) return;
    writeJson("bookings", [...allBookings, {
      id: `BK-${Date.now().toString().slice(-6)}`,
      requestId: request.id,
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      companyName: request.companyName,
      companyEmail: request.companyEmail,
      shipmentType: request.shipmentType,
      containerType: request.containerType,
      originPort: request.originPort,
      originCountry: request.originCountry,
      destinationPort: request.destinationPort,
      destinationCountry: request.destinationCountry,
      quotedPrice: request.quotedPrice || 0,
      status: "Pending",
      createdAt: new Date().toISOString(),
    }]);
    writeJson("quote_requests", readJson("quote_requests", []).map((item) => item.id === request.id ? { ...item, bookingConfirmed: true } : item));
    setQuoteMessage("Booking created successfully.");
    setActiveTab("Bookings");
  };

  const updateBookingStatus = (bookingId, status) => {
    writeJson("bookings", readJson("bookings", []).map((booking) => booking.id === bookingId ? { ...booking, status } : booking));
    setActiveTab("Bookings");
  };

  const markPaymentPaid = async (payment) => {
    const file = receiptFiles[payment.id];
    if (!file) return setPaymentMessage("Please attach payment document first.");
    const fileData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    writeJson("payments", readJson("payments", []).map((item) => item.id === payment.id ? { ...item, status: "Paid", paidAt: new Date().toISOString(), receiptData: fileData, receiptName: file.name } : item));
    writeJson("documents", [...readJson("documents", []), {
      id: `DOC-${Date.now().toString().slice(-6)}`,
      requestId: payment.requestId || "",
      bookingId: payment.bookingId,
      companyName: payment.companyName,
      companyEmail: payment.companyEmail,
      customerName: payment.customerName,
      customerEmail: payment.customerEmail,
      fileName: file.name,
      fileData,
      documentType: "PAYMENT RECEIPT",
      senderType: "Customer",
      receiverType: "Company",
      createdAt: new Date().toISOString(),
    }]);
    setPaymentMessage("Payment updated successfully.");
  };

  const customerDocumentRequests = requests.length ? requests : readJson("quote_requests", []).filter((item) => item.customerEmail === email);
  const customerSentDocuments = documents.filter((doc) => doc.senderType === "Customer");
  const companySentDocuments = documents.filter((doc) => doc.senderType === "Company");

  const updateCustomerDocumentDraft = (requestId, patch) => {
    setCustomerDocumentDrafts((prev) => ({ ...prev, [requestId]: { ...prev[requestId], ...patch } }));
  };

  const addCustomerDocument = (request) => {
    const draft = customerDocumentDrafts[request.id] || {};
    if (!draft.file || !draft.documentType) {
      setPaymentMessage("Please select document type and file.");
      return;
    }
    const pending = Array.isArray(draft.pendingDocs) ? draft.pendingDocs : [];
    updateCustomerDocumentDraft(request.id, {
      pendingDocs: [...pending, { tempId: `TMP-${Date.now()}`, file: draft.file, fileName: draft.file.name, documentType: draft.documentType, createdAt: new Date().toISOString() }],
      file: null,
      fileInputKey: Date.now(),
    });
    setPaymentMessage("");
  };

  const sendCustomerDocuments = async (request) => {
    const draft = customerDocumentDrafts[request.id] || {};
    const pending = Array.isArray(draft.pendingDocs) ? draft.pendingDocs : [];
    if (!pending.length) {
      setPaymentMessage("Please add at least one document.");
      return;
    }
    const converted = await Promise.all(pending.map((item) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        id: `DOC-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        requestId: request.id,
        bookingId: request.bookingId || "",
        companyName: request.companyName,
        companyEmail: request.companyEmail,
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        route: `${request.originPort || "-"} → ${request.destinationPort || "-"}`,
        fileName: item.fileName,
        fileData: reader.result,
        documentType: item.documentType,
        senderType: "Customer",
        receiverType: "Company",
        createdAt: item.createdAt,
      });
      reader.onerror = reject;
      reader.readAsDataURL(item.file);
    })));
    writeJson("documents", [...readJson("documents", []), ...converted]);
    updateCustomerDocumentDraft(request.id, { pendingDocs: [], file: null, fileInputKey: Date.now() });
    setPaymentMessage("Documents sent successfully.");
  };

  const tabs = ["Overview", "Directory", "Documents", "Payments", "Bookings", "Vessel Tracking"];

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="bg-[#07162c] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <div className="text-3xl font-semibold">Customer Dashboard</div>
            <div className="text-slate-300">{user?.name || user?.email}</div>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setShowCustomerProfile((prev) => !prev)} className="flex items-center gap-3 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-base font-bold text-white">{customerInitial}</span>
              <span className="hidden sm:block">{user?.name || user?.email}</span>
            </button>
            <button type="button" onClick={onLogout} className="text-sm font-semibold">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-8 rounded-full bg-[#e8e8ed] p-1">
          <div className="grid grid-cols-3 gap-1 text-center text-sm font-medium md:grid-cols-6">
            {tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-3 transition ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-700"}`}>{tab}</button>)}
          </div>
        </div>

        {quoteMessage ? <div className="mb-4 rounded-xl bg-cyan-50 px-4 py-3 text-sm text-cyan-700">{quoteMessage}</div> : null}
        {paymentMessage ? <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{paymentMessage}</div> : null}

        {showCustomerProfile ? (
          <SectionCard title="Profile">
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Name</label><input value={customerProfileForm.name} onChange={(e) => setCustomerProfileForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Email</label><input value={customerProfileForm.email} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg outline-none" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Mobile</label><input value={customerProfileForm.mobile} onChange={(e) => setCustomerProfileForm((prev) => ({ ...prev, mobile: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">City</label><input value={customerProfileForm.city} onChange={(e) => setCustomerProfileForm((prev) => ({ ...prev, city: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Address Line 1</label><input value={customerProfileForm.address1} onChange={(e) => setCustomerProfileForm((prev) => ({ ...prev, address1: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Address Line 2</label><input value={customerProfileForm.address2} onChange={(e) => setCustomerProfileForm((prev) => ({ ...prev, address2: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" /></div>
            </div>
            <button type="button" onClick={saveCustomerProfile} className="mt-6 rounded-2xl bg-cyan-500 px-6 py-3 text-lg font-semibold text-white">Save Profile</button>
          </SectionCard>
        ) : activeTab === "Overview" ? (
          <div className="space-y-7">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
              <StatCard label="Active Bookings" value={String(bookings.length)} icon="⚓" />
              <StatCard label="In Transit" value={String(bookings.filter((b) => b.status === "In Transit").length)} icon="📦" />
              <StatCard label="Pending" value={String(bookings.filter((b) => b.status === "Pending").length)} icon="⏳" />
              <StatCard label="Delivered" value={String(bookings.filter((b) => b.status === "Delivered").length)} icon="✅" />
              <StatCard label="Total Shipments" value={String(bookings.length)} icon="🕘" />
              <StatCard label="Pending Payments" value={`$${pendingAmount.toLocaleString()}`} icon="💳" />
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              <SectionCard title="Recent Bookings">{bookings.filter((b) => b.placedBooking).length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No recent bookings available.</div> : <div className="space-y-3">{bookings.filter((b) => b.placedBooking).slice().reverse().slice(0, 5).map((booking) => <div key={booking.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-300 hover:bg-sky-100"><div className="flex items-center justify-between gap-4"><div><div className="font-semibold text-slate-900">{booking.companyName}</div><div className="text-sm text-slate-500">{booking.originPort}, {booking.originCountry} → {booking.destinationPort}, {booking.destinationCountry}</div></div><div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Booking Placed</div></div></div>)}</div>}</SectionCard>
              <SectionCard title="Quick Actions"><div className="space-y-3"><button type="button" onClick={() => setActiveTab("Directory")} className="w-full rounded-2xl bg-cyan-500 px-5 py-4 text-left font-semibold text-white hover:bg-cyan-600">Request New Quote</button><button type="button" onClick={() => setActiveTab("Vessel Tracking")} className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left font-medium text-slate-800 hover:bg-slate-50">Track Vessel</button><button type="button" onClick={() => setActiveTab("Documents")} className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left font-medium text-slate-800 hover:bg-slate-50">Upload Document</button><button type="button" onClick={() => setActiveTab("Directory")} className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left font-medium text-slate-800 hover:bg-slate-50">Browse Companies</button></div></SectionCard>
            </div>
            <SectionCard title="Quote Request Status">{requests.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No quote requests available.</div> : <div className="space-y-4">{requests.slice().reverse().slice(0, 5).map((request) => {const bookingExists = bookings.some((booking) => booking.requestId === request.id); const confirmed = request.bookingConfirmed || bookingExists; return <div key={request.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:border-emerald-700 hover:bg-emerald-100"><div className="flex items-start justify-between gap-4"><div><div className="text-2xl font-semibold text-emerald-800">{request.companyName}</div><div className="mt-1 text-base text-slate-500">{request.originPort}, {request.originCountry} → {request.destinationPort}, {request.destinationCountry}</div></div><div className={`rounded-full px-4 py-2 text-sm font-semibold ${request.status === "Accepted" || confirmed ? "bg-emerald-100 text-emerald-700" : request.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{confirmed && request.status === "Accepted" ? "Accepted" : request.status}</div></div><div className="mt-4 space-y-2 text-sm text-slate-700"><div><span className="font-semibold text-slate-900">Quoted Price:</span> {request.quotedPrice ? `$${request.quotedPrice}` : "-"}</div><div><span className="font-semibold text-slate-900">Company Note:</span> {request.responseNote || "-"}</div><div><span className="font-semibold text-slate-900">Vessel:</span> {request.vesselName || "-"}</div><div><span className="font-semibold text-slate-900">Voyage:</span> {request.voyageNumber || "-"}</div><div><span className="font-semibold text-slate-900">POL Date:</span> {request.polDate || "-"}</div><div><span className="font-semibold text-slate-900">POD Date:</span> {request.podDate || "-"}</div></div>{request.status === "Accepted" ? <div className="mt-5 flex items-center justify-between gap-4"><button type="button" onClick={() => confirmBooking(request)} disabled={confirmed} className={`rounded-xl px-5 py-3 text-sm font-semibold text-white ${confirmed ? "cursor-not-allowed bg-slate-300" : "bg-emerald-500 hover:bg-emerald-600"}`}>Confirm Booking</button>{confirmed ? <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">Accepted</div> : null}</div> : null}</div>;})}</div>}</SectionCard>
          </div>
        ) : null}

        {activeTab === "Directory" && !showCustomerProfile && (showQuotePage ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4"><button type="button" onClick={() => setShowQuotePage(false)} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">← Back to Directory</button></div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-6 flex items-start justify-between gap-4"><div><h3 className="text-2xl font-semibold text-slate-900">Request a Quote</h3><p className="mt-2 text-sm text-slate-500">Fill in your shipping requirements to receive competitive quotes</p></div><div className="flex gap-3"><button type="button" onClick={createQuoteRequest} className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-white hover:bg-cyan-600">Submit Request Quote</button><button type="button" onClick={() => setShowQuotePage(false)} className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">Cancel</button></div></div><div className="space-y-6"><div><label className="mb-2 block text-sm font-semibold text-slate-800">Selected Company</label><input value={selectedCompany?.name || ""} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" /></div><div><label className="mb-2 block text-sm font-semibold text-slate-800">Shipment Type</label><div className="grid gap-4 md:grid-cols-2">{[{ key: "IMPORT", label: "Import" }, { key: "EXPORT", label: "Export" }].map((item) => <button key={item.key} type="button" onClick={() => setQuoteForm((prev) => ({ ...prev, shipmentType: item.key }))} className={`rounded-2xl border px-4 py-4 text-sm font-semibold ${quoteForm.shipmentType === item.key ? "border-cyan-500 bg-cyan-500 text-white" : "border-slate-200 bg-white text-slate-900"}`}>{item.label}</button>)}</div></div><div><label className="mb-2 block text-sm font-semibold text-slate-800">Container Type</label><div className="grid gap-4 md:grid-cols-2">{[{ key: "FCL", label: "FCL (Full Container Load)" }, { key: "LCL", label: "LCL (Less than Container Load)" }].map((item) => <button key={item.key} type="button" onClick={() => setQuoteForm((prev) => ({ ...prev, containerType: item.key }))} className={`rounded-2xl border px-4 py-4 text-sm font-semibold ${quoteForm.containerType === item.key ? "border-cyan-500 bg-cyan-500 text-white" : "border-slate-200 bg-white text-slate-900"}`}>{item.label}</button>)}</div></div><div className="grid gap-4 md:grid-cols-2"><div className="space-y-3"><label className="block text-sm font-semibold text-slate-800">Origin Port</label><select value={quoteForm.originCountry} onChange={(e) => setQuoteForm((prev) => ({ ...prev, originCountry: e.target.value, originPort: "" }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"><option value="">Select Origin Country</option>{Object.keys(PORTS_BY_COUNTRY).map((country) => <option key={country} value={country}>{country}</option>)}</select><select value={quoteForm.originPort} onChange={(e) => setQuoteForm((prev) => ({ ...prev, originPort: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"><option value="">Select Origin Port</option>{(PORTS_BY_COUNTRY[quoteForm.originCountry] || []).map((port) => <option key={port} value={port}>{port}</option>)}</select></div><div className="space-y-3"><label className="block text-sm font-semibold text-slate-800">Destination Port</label><select value={quoteForm.destinationCountry} onChange={(e) => setQuoteForm((prev) => ({ ...prev, destinationCountry: e.target.value, destinationPort: "" }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"><option value="">Select Destination Country</option>{Object.keys(PORTS_BY_COUNTRY).map((country) => <option key={country} value={country}>{country}</option>)}</select><select value={quoteForm.destinationPort} onChange={(e) => setQuoteForm((prev) => ({ ...prev, destinationPort: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"><option value="">Select Destination Port</option>{(PORTS_BY_COUNTRY[quoteForm.destinationCountry] || []).map((port) => <option key={port} value={port}>{port}</option>)}</select></div></div><div className="grid gap-4 md:grid-cols-3"><div><label className="mb-2 block text-sm font-semibold text-slate-800">Container Size</label><select value={quoteForm.containerSize} onChange={(e) => setQuoteForm((prev) => ({ ...prev, containerSize: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"><option value="">Select size</option><option value="20FT">20FT</option><option value="40FT">40FT</option><option value="40HQ">40HQ</option></select></div><div><label className="mb-2 block text-sm font-semibold text-slate-800">Quantity</label><input value={quoteForm.quantity} onChange={(e) => setQuoteForm((prev) => ({ ...prev, quantity: e.target.value.replace(/[^0-9]/g, "") }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400" /></div><div><label className="mb-2 block text-sm font-semibold text-slate-800">Cargo Type</label><select value={quoteForm.cargoType} onChange={(e) => setQuoteForm((prev) => ({ ...prev, cargoType: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"><option value="">Select type</option><option value="General Cargo">General Cargo</option><option value="Hazardous Cargo">Hazardous Cargo</option><option value="Perishable Cargo">Perishable Cargo</option><option value="Project Cargo">Project Cargo</option></select></div></div><div className="grid gap-4 md:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold text-slate-800">Cargo Ready Date</label><input type="date" value={quoteForm.cargoReadyDate} onChange={(e) => setQuoteForm((prev) => ({ ...prev, cargoReadyDate: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400" /></div><div><label className="mb-2 block text-sm font-semibold text-slate-800">Incoterm</label><select value={quoteForm.incoterm} onChange={(e) => setQuoteForm((prev) => ({ ...prev, incoterm: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"><option value="">Select incoterm</option><option value="EXW">EXW</option><option value="FOB">FOB</option><option value="CIF">CIF</option><option value="CFR">CFR</option><option value="DAP">DAP</option></select></div></div></div></div>
          </div>
        ) : (
          <div className="space-y-6"><SectionCard title="Companies" badge={`${approvedCompaniesCount} Verified`}><div className="mb-5 grid gap-4 md:grid-cols-[1fr_260px]"><div><label className="mb-2 block text-sm font-semibold text-slate-800">Search Company</label><input type="text" value={directorySearch} onChange={(e) => setDirectorySearch(e.target.value)} placeholder="Search by company name or country" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400" /></div><div><label className="mb-2 block text-sm font-semibold text-slate-800">Filter by Country</label><select value={directoryCountryFilter} onChange={(e) => setDirectoryCountryFilter(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"><option value="">All Countries</option>{companyCountries.map((country) => <option key={country} value={country}>{country}</option>)}</select></div></div>{latestViewedCompany ? <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><div className="text-2xl font-semibold text-slate-900">{latestViewedCompany.name}</div><div className="mt-1 text-sm text-slate-500">{latestViewedCompany.country || "-"}</div></div><button type="button" onClick={() => setViewProfileCompany(null)} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button></div><div className="mt-4 rounded-full bg-[#e8e8ed] p-1"><div className="grid grid-cols-3 gap-1 text-center text-sm font-medium">{["Overview", "Services", "Reviews"].map((tab) => <button key={tab} type="button" onClick={() => setProfileTab(tab)} className={`rounded-full px-4 py-3 transition ${profileTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-700"}`}>{tab}</button>)}</div></div>{profileTab === "Overview" ? <div className="mt-5 grid gap-6 lg:grid-cols-[1.7fr_0.8fr]"><div className="space-y-6"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="text-xl font-semibold text-slate-900">About Company</div><div className="mt-5 grid gap-4 md:grid-cols-2 text-sm text-slate-700"><div><span className="font-semibold text-slate-900">Established:</span> {latestViewedCompany.established || "-"}</div><div><span className="font-semibold text-slate-900">Team Size:</span> {latestViewedCompany.teamSize || "-"}</div></div><div className="mt-5 text-sm font-semibold text-slate-900">Coverage Areas</div><div className="mt-3 flex flex-wrap gap-2">{[latestViewedCompany.country || "Sri Lanka", "India", "Singapore", "UAE", "Japan", "Australia"].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">{item}</span>)}</div></div><div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="text-xl font-semibold text-slate-900">Specialties</div><div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-slate-700">{["Asia-Pacific Routes", "Express Delivery", "Door-to-Door Service", "Customs Clearance"].map((item) => <div key={item} className="flex items-center gap-2"><span className="text-emerald-500">✔</span>{item}</div>)}</div></div></div><div className="space-y-6"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="text-xl font-semibold text-slate-900">Contact Information</div><div className="mt-5 space-y-4 text-sm text-slate-700"><div><span className="font-semibold text-slate-900">Phone:</span> {latestViewedCompany.mobile || "-"}</div><div><span className="font-semibold text-slate-900">Email:</span> {latestViewedCompany.email}</div><div><span className="font-semibold text-slate-900">Website:</span> www.logiconnect.com</div></div></div></div></div> : null}{profileTab === "Services" ? <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="text-xl font-semibold text-slate-900">Services Offered</div><div className="mt-4 space-y-3">{getDisplayServices(latestViewedCompany).map((service) => <div key={service} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700"><div className="font-semibold text-slate-900">{service}</div><div className="mt-1">Professional logistics support for {service.toLowerCase()} operations.</div></div>)}</div></div> : null}{profileTab === "Reviews" ? <div className="mt-5 space-y-4">{[{ name: "John Chen", company: "Tech Imports Inc.", text: "Excellent service! They handled our FCL shipment with great professionalism.", date: "2 weeks ago" }, { name: "Sarah Johnson", company: "Global Traders Ltd.", text: "Very reliable partner for our regular shipments.", date: "1 month ago" }, { name: "Michael Wong", company: "Pacific Electronics", text: "Good service overall. Communication was clear and timely.", date: "2 months ago" }].map((review, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-4"><div><div className="font-semibold text-slate-900">{review.name} <span className="font-normal text-slate-500">• {review.company}</span></div><div className="mt-2 text-amber-500">★★★★★</div></div><div className="text-sm text-slate-500">{review.date}</div></div><div className="mt-4 text-sm text-slate-700">{review.text}</div></div>)}</div> : null}</div> : null}<div className="space-y-4">{filteredCompanies.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No companies found.</div> : filteredCompanies.map((company) => <div key={company.email} className="group rounded-3xl border border-blue-500 bg-blue-50/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-700 hover:bg-blue-100"><div className="flex items-start justify-between gap-4"><div className="flex-1"><div className="flex flex-wrap items-center gap-3"><div className="text-3xl font-semibold text-slate-900">{company.name}</div>{(company.approvalStatus || "PENDING") === "APPROVED" ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-[0_0_16px_rgba(34,197,94,0.28)]">Verified</span> : null}</div><div className="mt-1 text-lg text-slate-500">{company.country || "-"}</div><div className="mt-4 flex flex-wrap gap-2">{getDisplayServices(company).slice(0, 7).map((service, index) => <span key={index} className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">{service}</span>)}</div><div className="mt-5 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white px-4 py-4"><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rating</div><div className="mt-3 flex items-center gap-2 text-3xl font-semibold text-slate-900">4.8 <span className="text-lg text-amber-500">★★★★★</span></div></div><div className="rounded-2xl border border-slate-200 bg-white px-4 py-4"><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Performance</div><div className="mt-3 text-3xl font-semibold text-emerald-600">96%</div></div><div className="rounded-2xl border border-slate-200 bg-white px-4 py-4"><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">On-Time Delivery</div><div className="mt-3 text-3xl font-semibold text-cyan-600">98%</div></div></div></div><div className="flex flex-col gap-3"><button type="button" onClick={() => { setViewProfileCompany(company); setProfileTab("Overview"); }} className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600">View Profile</button><button type="button" onClick={() => openQuotePage(company.email)} className="rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white hover:bg-green-600">Request Quote</button></div></div></div>)}</div></SectionCard></div>
        ))}

        {activeTab === "Documents" && !showCustomerProfile && (
          <SectionCard title=""><div className="mb-8 flex gap-3">{["Customer", "Company"].map((tab) => <button key={tab} type="button" onClick={() => setCustomerDocumentTab(tab)} className={`rounded-2xl px-5 py-3 text-sm font-semibold ${customerDocumentTab === tab ? "bg-cyan-500 text-white" : "border border-slate-300 bg-white text-slate-700"}`}>{tab}</button>)}</div>{customerDocumentTab === "Customer" ? <div><h3 className="text-2xl font-semibold text-slate-900">Customer Documents</h3><p className="mt-2 text-lg text-slate-500">Send and view shipment documents here.</p><div className="mt-8 space-y-5">{customerDocumentRequests.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No documents available.</div> : customerDocumentRequests.slice().reverse().map((request) => {const draft = customerDocumentDrafts[request.id] || {}; const pendingDocs = Array.isArray(draft.pendingDocs) ? draft.pendingDocs : []; const relatedDocs = customerSentDocuments.filter((doc) => doc.requestId === request.id); return <div key={request.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-4"><div><div className="text-3xl font-semibold text-slate-900">{request.customerName || user?.name || "Customer"}</div><div className="mt-1 text-lg text-slate-700">{request.originPort || "-"} → {request.destinationPort || "-"}</div><div className="mt-1 text-sm text-slate-400">Request: {request.id}</div></div><div className="text-xl text-slate-500">{request.companyName || "-"}</div></div><div className="mt-6 grid grid-cols-[220px_1fr_70px_76px] gap-3"><select value={draft.documentType || "SUPPORTING DOCUMENT"} onChange={(e) => updateCustomerDocumentDraft(request.id, { documentType: e.target.value })} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none"><option value="SUPPORTING DOCUMENT">SUPPORTING DOCUMENT</option><option value="INVOICE">INVOICE</option><option value="PACKING LIST">PACKING LIST</option><option value="BILL OF LADING">BILL OF LADING</option></select><input key={draft.fileInputKey || request.id} type="file" onChange={(e) => updateCustomerDocumentDraft(request.id, { file: e.target.files?.[0] || null })} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none" /><button type="button" onClick={() => addCustomerDocument(request)} className="rounded-2xl bg-amber-500 px-4 py-4 text-sm font-semibold text-white hover:bg-amber-600">Add</button><button type="button" onClick={() => sendCustomerDocuments(request)} className="rounded-2xl bg-cyan-500 px-4 py-4 text-sm font-semibold text-white hover:bg-cyan-600">Send</button></div><div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="grid grid-cols-[1.5fr_1.2fr_1fr_0.7fr] bg-[#e8e0c9] px-4 py-4 text-sm font-semibold text-slate-900"><div>Selected Document</div><div>Document Type</div><div>Date & Time</div><div>Action</div></div>{[...pendingDocs, ...relatedDocs].length === 0 ? <div className="px-4 py-8 text-center text-slate-500">No documents available.</div> : [...pendingDocs, ...relatedDocs].map((doc) => <div key={doc.tempId || doc.id} className="grid grid-cols-[1.5fr_1.2fr_1fr_0.7fr] items-center border-t border-slate-100 px-4 py-4 text-sm text-slate-700"><div>{doc.fileName}</div><div>{doc.documentType}</div><div>{new Date(doc.createdAt).toLocaleString()}</div><div>{doc.fileData || doc.file ? <button type="button" onClick={() => openStoredFile(doc.fileData || doc.file, doc.fileName)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">View</button> : <span className="text-slate-400">Pending</span>}</div></div>)}</div></div>;})}</div></div> : <div><h3 className="text-2xl font-semibold text-slate-900">Company Documents</h3><p className="mt-2 text-lg text-slate-500">View documents sent by company here.</p><div className="mt-8 space-y-4">{companySentDocuments.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No documents available.</div> : companySentDocuments.slice().reverse().map((doc) => <div key={doc.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-4"><div><div className="text-3xl font-semibold text-slate-900">{doc.companyName}</div><div className="mt-1 text-lg text-slate-700">{doc.route || "-"}</div><div className="mt-1 text-sm text-slate-400">Request: {doc.requestId || "-"}</div></div><div className="text-xl text-slate-500">{doc.customerName}</div></div><div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="grid grid-cols-[1.5fr_1.2fr_1fr_0.7fr] bg-[#e8e0c9] px-4 py-4 text-sm font-semibold text-slate-900"><div>Selected Document</div><div>Document Type</div><div>Date & Time</div><div>Action</div></div><div className="grid grid-cols-[1.5fr_1.2fr_1fr_0.7fr] items-center border-t border-slate-100 px-4 py-4 text-sm text-slate-700"><div>{doc.fileName}</div><div>{doc.documentType}</div><div>{new Date(doc.createdAt).toLocaleString()}</div><div><button type="button" onClick={() => openStoredFile(doc.fileData, doc.fileName)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">View</button></div></div></div></div>)}</div></div>}</SectionCard>
        )}

        {activeTab === "Payments" && !showCustomerProfile && (
          <div className="space-y-6"><div className="grid gap-5 md:grid-cols-3"><StatCard label="Total Paid" value={`$${totalPaid.toLocaleString()}`} icon="✅" /><StatCard label="Pending" value={`$${pendingAmount.toLocaleString()}`} icon="🕒" /><StatCard label="Overdue" value={`$${payments.filter((p) => p.status === "Overdue").reduce((sum, p) => sum + Number(p.amount || 0), 0).toLocaleString()}`} icon="❗" /></div><SectionCard title="Payment History">{payments.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No payment records available.</div> : <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-700"><th className="px-2 py-3">Payment ID</th><th className="px-2 py-3">Booking</th><th className="px-2 py-3">Amount</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Date</th><th className="px-2 py-3">Actions</th></tr></thead><tbody>{payments.slice().reverse().map((payment) => <tr key={payment.id} className="border-b border-slate-100"><td className="px-2 py-4">{payment.id}</td><td className="px-2 py-4">{payment.bookingId}</td><td className="px-2 py-4">${Number(payment.amount || 0).toLocaleString()}</td><td className="px-2 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.status === "Paid" ? "bg-emerald-100 text-emerald-700" : payment.status === "Overdue" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{payment.status}</span></td><td className="px-2 py-4">{payment.paidAt || payment.createdAt || "-"}</td><td className="px-2 py-4"><div className="flex flex-wrap items-center gap-2">{payment.status !== "Paid" ? <><input type="file" onChange={(e) => setReceiptFiles((prev) => ({ ...prev, [payment.id]: e.target.files?.[0] || null }))} className="max-w-[180px] rounded-xl border border-slate-200 px-3 py-2 text-xs" /><button type="button" onClick={() => markPaymentPaid(payment)} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600">Paid</button></> : null}{payment.receiptData ? <button type="button" onClick={() => openStoredFile(payment.receiptData, payment.receiptName || "receipt")} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">View</button> : null}</div></td></tr>)}</tbody></table></div>}</SectionCard></div>
        )}

        {activeTab === "Bookings" && !showCustomerProfile && <SectionCard title="Bookings">{bookings.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No bookings available.</div> : <div className="space-y-3">{bookings.slice().reverse().map((booking) => <div key={booking.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-4"><div><div className="font-semibold text-slate-900">{booking.id}</div><div className="text-sm text-slate-500">{booking.companyName}</div><div className="mt-1 text-sm text-slate-600">{booking.originPort}, {booking.originCountry} → {booking.destinationPort}, {booking.destinationCountry}</div></div><div className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.status === "Accepted" ? "bg-emerald-100 text-emerald-700" : booking.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{booking.status}</div></div>{booking.status === "Pending" ? <div className="mt-4 flex gap-3"><button type="button" onClick={() => updateBookingStatus(booking.id, "Accepted")} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">Accept</button><button type="button" onClick={() => updateBookingStatus(booking.id, "Rejected")} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600">Reject</button></div> : null}</div>)}</div>}</SectionCard>}

        {activeTab === "Vessel Tracking" && !showCustomerProfile && <VesselTrackingSimulator userEmail={email} userType="CUSTOMER" />}
      </main>
    </div>
  );
}

function CompanyDashboard({ user, onLogout }) {
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [popupMessage, setPopupMessage] = useState("");
  const [drafts, setDrafts] = useState({});
  const [companyDocumentTab, setCompanyDocumentTab] = useState("Company");
  const [companyDocumentDrafts, setCompanyDocumentDrafts] = useState({});
  const [companyProfileForm, setCompanyProfileForm] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    contactPerson: user?.contactPerson || "",
    mobile: user?.mobile || "",
    city: user?.city || "",
    country: user?.country || "",
    address1: user?.address1 || "",
    address2: user?.address2 || "",
    established: user?.established || "",
    teamSize: user?.teamSize || "",
    servicesOffered: Array.isArray(user?.servicesOffered) ? user.servicesOffered : [],
  }));

  const email = user?.email || "";
  const companyInitial = String(user?.name || user?.email || "C").charAt(0).toUpperCase();
  const requests = readJson("quote_requests", []).filter((item) => item.companyEmail === email);
  const bookings = readJson("bookings", []).filter((item) => item.companyEmail === email);
  const documents = readJson("documents", []).filter((item) => item.companyEmail === email);
  const payments = readJson("payments", []).filter((item) => item.companyEmail === email);

  useEffect(() => {
    setCompanyProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      contactPerson: user?.contactPerson || "",
      mobile: user?.mobile || "",
      city: user?.city || "",
      country: user?.country || "",
      address1: user?.address1 || "",
      address2: user?.address2 || "",
      established: user?.established || "",
      teamSize: user?.teamSize || "",
      servicesOffered: Array.isArray(user?.servicesOffered) ? user.servicesOffered : [],
    });
  }, [user]);

  const saveCompanyProfile = () => {
    const updatedUser = {
      ...user,
      name: companyProfileForm.name,
      contactPerson: companyProfileForm.contactPerson,
      mobile: companyProfileForm.mobile,
      city: companyProfileForm.city,
      country: companyProfileForm.country,
      address1: companyProfileForm.address1,
      address2: companyProfileForm.address2,
      established: companyProfileForm.established,
      teamSize: companyProfileForm.teamSize,
      servicesOffered: companyProfileForm.servicesOffered,
    };
    writeJson("users", readJson("users", []).map((item) => item.email === user.email ? updatedUser : item));
    setPopupMessage("Company profile saved successfully.");
  };

  const toggleCompanyService = (service) => {
    setCompanyProfileForm((prev) => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(service)
        ? prev.servicesOffered.filter((item) => item !== service)
        : [...prev.servicesOffered, service],
    }));
  };

  const getDraft = (request, field, fallback = "") => drafts[request.id]?.[field] ?? request[field] ?? fallback;
  const saveDraft = (requestId, field, value) => setDrafts((prev) => ({ ...prev, [requestId]: { ...prev[requestId], [field]: value } }));

  const updateInquiry = (requestId, patch) => {
    writeJson("quote_requests", readJson("quote_requests", []).map((item) => item.id === requestId ? { ...item, ...patch } : item));
    setPopupMessage("Successfully updated");
  };

  const placeBooking = (booking) => {
    writeJson("bookings", readJson("bookings", []).map((item) => item.id === booking.id ? { ...item, placedBooking: true, placedAt: new Date().toISOString() } : item));
    const existingPayments = readJson("payments", []);
    if (!existingPayments.some((payment) => payment.bookingId === booking.id)) {
      writeJson("payments", [...existingPayments, { id: `P${Date.now().toString().slice(-4)}`, bookingId: booking.id, requestId: booking.requestId, companyName: booking.companyName, companyEmail: booking.companyEmail, customerName: booking.customerName, customerEmail: booking.customerEmail, originPort: booking.originPort, originCountry: booking.originCountry, destinationPort: booking.destinationPort, destinationCountry: booking.destinationCountry, amount: booking.quotedPrice || 0, status: "Pending", createdAt: new Date().toISOString() }]);
    }
    setPopupMessage("Booking placed successfully.");
  };

  const tabs = ["Overview", "Inquiries", "Bookings", "Documents", "Financials", "Live Tracking"];
  const companyDocumentRequests = requests.length ? requests : readJson("quote_requests", []).filter((item) => item.companyEmail === email);
  const companyOwnDocuments = documents.filter((doc) => doc.senderType === "Company");
  const customerUploadedDocuments = documents.filter((doc) => doc.senderType === "Customer");

  const updateCompanyDocumentDraft = (requestId, patch) => {
    setCompanyDocumentDrafts((prev) => ({ ...prev, [requestId]: { ...prev[requestId], ...patch } }));
  };

  const addCompanyDocument = (request) => {
    const draft = companyDocumentDrafts[request.id] || {};
    if (!draft.file || !draft.documentType) {
      setPopupMessage("Please select document type and file.");
      return;
    }
    const pending = Array.isArray(draft.pendingDocs) ? draft.pendingDocs : [];
    updateCompanyDocumentDraft(request.id, {
      pendingDocs: [...pending, { tempId: `TMP-${Date.now()}`, file: draft.file, fileName: draft.file.name, documentType: draft.documentType, createdAt: new Date().toISOString() }],
      file: null,
      fileInputKey: Date.now(),
    });
    setPopupMessage("");
  };

  const sendCompanyDocuments = async (request) => {
    const draft = companyDocumentDrafts[request.id] || {};
    const pending = Array.isArray(draft.pendingDocs) ? draft.pendingDocs : [];
    if (!pending.length) {
      setPopupMessage("Please add at least one document.");
      return;
    }
    const converted = await Promise.all(pending.map((item) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        id: `DOC-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        requestId: request.id,
        bookingId: request.bookingId || "",
        companyName: request.companyName,
        companyEmail: request.companyEmail,
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        route: `${request.originPort || '-'} → ${request.destinationPort || '-'}`,
        fileName: item.fileName,
        fileData: reader.result,
        documentType: item.documentType,
        senderType: "Company",
        receiverType: "Customer",
        createdAt: item.createdAt,
      });
      reader.onerror = reject;
      reader.readAsDataURL(item.file);
    })));
    writeJson("documents", [...readJson("documents", []), ...converted]);
    updateCompanyDocumentDraft(request.id, { pendingDocs: [], file: null, fileInputKey: Date.now() });
    setPopupMessage("Documents sent successfully.");
  };

  const totalPaid = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalPending = payments.filter((p) => p.status === "Pending").reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalOverdue = payments.filter((p) => p.status === "Overdue").reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#fff6ee] text-slate-900">
      <header className="bg-[#07162c] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div><div className="text-3xl font-semibold">Company Dashboard</div><div className="text-slate-300">{user?.name || user?.email}</div></div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setShowCompanyProfile((prev) => !prev)} className="flex items-center gap-3 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-white"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-base font-bold text-white">{companyInitial}</span><span className="hidden sm:block">{user?.name || user?.email}</span></button>
            <button type="button" onClick={onLogout} className="text-sm font-semibold">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-8 rounded-full bg-[#e8e8ed] p-1"><div className="grid grid-cols-3 gap-1 text-center text-sm font-medium md:grid-cols-6">{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-3 transition ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-700"}`}>{tab}</button>)}</div></div>
        {popupMessage ? <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{popupMessage}</div> : null}

        {showCompanyProfile ? (
          <SectionCard title="Company Profile">
            <div className="flex justify-end"><button type="button" onClick={saveCompanyProfile} className="rounded-2xl bg-cyan-500 px-6 py-3 text-base font-semibold text-white">Save Profile</button></div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Company Name</label><input value={companyProfileForm.name} onChange={(e) => setCompanyProfileForm((prev) => ({ ...prev, name: e.target.value.toUpperCase() }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Email</label><input value={companyProfileForm.email} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg outline-none" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Contact Person</label><input value={companyProfileForm.contactPerson} onChange={(e) => setCompanyProfileForm((prev) => ({ ...prev, contactPerson: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Mobile</label><input value={companyProfileForm.mobile} onChange={(e) => setCompanyProfileForm((prev) => ({ ...prev, mobile: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">City</label><input value={companyProfileForm.city} onChange={(e) => setCompanyProfileForm((prev) => ({ ...prev, city: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Country</label><select value={companyProfileForm.country} onChange={(e) => setCompanyProfileForm((prev) => ({ ...prev, country: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none"><option value="">Select Country</option>{COUNTRY_PHONE_OPTIONS.map((item) => <option key={item.country} value={item.country}>{item.country}</option>)}</select></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Address Line 1</label><input value={companyProfileForm.address1} onChange={(e) => setCompanyProfileForm((prev) => ({ ...prev, address1: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Address Line 2</label><input value={companyProfileForm.address2} onChange={(e) => setCompanyProfileForm((prev) => ({ ...prev, address2: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Established</label><input value={companyProfileForm.established} onChange={(e) => setCompanyProfileForm((prev) => ({ ...prev, established: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" placeholder="2003" /></div>
              <div><label className="mb-2 block text-sm font-semibold text-slate-800">Team Size</label><input value={companyProfileForm.teamSize} onChange={(e) => setCompanyProfileForm((prev) => ({ ...prev, teamSize: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none" placeholder="500+" /></div>
            </div>
            <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5"><div className="text-xl font-semibold text-slate-900">Services Offered</div><div className="mt-4 grid gap-3 md:grid-cols-2">{['FCL (Full Container Load)','LCL (Less than Container Load)','Air Freight','Sea Freight','Customs Clearance','Inland Transportation','Warehousing','Door-to-Door Delivery','Freight Forwarding','Project Cargo','Courier / Express Services','Supply Chain Solutions'].map((service) => <label key={service} className="flex items-center gap-3 text-lg text-slate-800"><input type="checkbox" checked={companyProfileForm.servicesOffered.includes(service)} onChange={() => toggleCompanyService(service)} className="h-5 w-5" /><span>{service}</span></label>)}</div></div>
          </SectionCard>
        ) : activeTab === "Overview" ? <div className="space-y-7"><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"><StatCard label="New Requests" value={String(requests.filter((r) => r.status === "New").length)} icon="✉️" /><StatCard label="Bookings" value={String(bookings.length)} icon="📦" /><StatCard label="Accepted" value={String(bookings.filter((b) => b.status === "Accepted").length)} icon="✅" /><StatCard label="Placed" value={String(bookings.filter((b) => b.placedBooking).length)} icon="🚢" /></div><div className="grid gap-6 xl:grid-cols-2"><SectionCard title="Operations Summary"><div className="text-lg text-slate-700">Track requests, bookings, and shipment actions from this dashboard.</div></SectionCard><SectionCard title="Notifications"><div className="text-lg text-slate-700">Recent activity and internal reminders will appear here.</div></SectionCard></div></div> : null}

        {activeTab === "Inquiries" && !showCompanyProfile && <SectionCard title="Incoming Quote Requests">{requests.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No quote requests available.</div> : <div className="space-y-4">{requests.slice().reverse().map((request) => {const quotedPrice = getDraft(request, "quotedPrice", ""); const responseNote = getDraft(request, "responseNote", ""); const vesselName = getDraft(request, "vesselName", ""); const voyageNumber = getDraft(request, "voyageNumber", ""); const polDate = getDraft(request, "polDate", ""); const podDate = getDraft(request, "podDate", ""); const locked = request.status === "Accepted" || request.status === "Rejected"; return <div key={request.id} className="rounded-2xl border border-orange-100 bg-orange-50/30 p-5"><div className="flex items-start justify-between gap-4"><div><div className="text-2xl font-semibold text-slate-900">{request.id}</div><div className="mt-1 text-slate-500"><span className="font-semibold text-slate-800">{request.customerName}</span> • {request.customerEmail}</div></div><div className={`rounded-full px-4 py-2 text-sm font-semibold ${request.status === "Accepted" ? "bg-emerald-100 text-emerald-700" : request.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{request.status}</div></div><div className="mt-5 grid gap-4 md:grid-cols-3 text-sm text-slate-700"><div><span className="font-semibold text-slate-900">Shipment:</span> {request.shipmentType || "-"}</div><div><span className="font-semibold text-slate-900">Container:</span> {request.containerType || "-"}</div><div><span className="font-semibold text-slate-900">Origin:</span> {request.originPort}, {request.originCountry}</div><div><span className="font-semibold text-slate-900">Destination:</span> {request.destinationPort}, {request.destinationCountry}</div><div><span className="font-semibold text-slate-900">Ready Date:</span> {request.cargoReadyDate || "-"}</div><div><span className="font-semibold text-slate-900">Incoterm:</span> {request.incoterm || "-"}</div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold text-slate-800">Quoted Price</label><div className="relative"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span><input type="number" value={quotedPrice} onChange={(e) => saveDraft(request.id, "quotedPrice", e.target.value)} className="w-full rounded-xl border border-orange-200 bg-white py-3 pl-8 pr-4 text-sm outline-none" /></div></div><div><label className="mb-2 block text-sm font-semibold text-slate-800">Response Note</label><textarea value={responseNote} onChange={(e) => saveDraft(request.id, "responseNote", e.target.value)} rows="2" className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none" /></div></div><div className="mt-5 grid gap-4 md:grid-cols-4"><select value={vesselName} onChange={(e) => saveDraft(request.id, "vesselName", e.target.value)} className="rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none"><option value="">Select Vessel</option>{["MSC Gülsün","MSC Irina","MSC Tessa","MSC Oscar","MSC Zoe","MSC Maya","MSC Diana","MSC Sixin","MSC Diletta","MSC Febe","Madrid Maersk","Munich Maersk","Moscow Maersk","Margrethe Maersk","Mathilde Maersk","Marie Maersk","Maribo Maersk","Magleby Maersk","Mærsk Mc-Kinney Møller","Mary Maersk","Ever Ace","Ever Alot","Ever Apex","Ever Art","Ever Aim","Ever Arm","Ever Atop","Ever Given","Ever Golden","Ever Goods","CMA CGM Jacques Saadé","CMA CGM Antoine de Saint Exupéry","CMA CGM Champs Élysées","CMA CGM Palais Royal","CMA CGM Louvre","CMA CGM Montmartre","CMA CGM Sorbonne","CMA CGM Rivoli","CMA CGM Concorde","CMA CGM Trocadéro","COSCO Shipping Universe","COSCO Shipping Galaxy","COSCO Shipping Solar","COSCO Shipping Planet","COSCO Shipping Taurus","COSCO Shipping Nebula","COSCO Shipping Star","COSCO Shipping Aries","COSCO Shipping Leo","COSCO Shipping Virgo","HMM Algeciras","HMM Copenhagen","HMM Dublin","HMM Oslo","HMM Rotterdam","HMM Southampton","HMM Hamburg","HMM Helsinki","HMM Stockholm","HMM Antwerp","Hamburg Express","Berlin Express","Rotterdam Express","Bangkok Express","Colombo Express","Kyoto Express","Osaka Express","Tokyo Express","Singapore Express","Vienna Express","ONE Apus","ONE Aquila","ONE Columba","ONE Cosmos","ONE Commitment","ONE Confidence","ONE Continuity","ONE Integrity","ONE Inspiration","ONE Innovation","ZIM Kingston","ZIM Rotterdam","ZIM Europe","ZIM Asia","ZIM America","ZIM Pacific","ZIM Atlantic","ZIM Haifa","ZIM Shanghai","ZIM Qingdao","MOL Triumph","MOL Truth","MOL Treasure","NYK Vega","NYK Venus","NYK Virgo","NYK Victory","NYK Vesta","NYK Orion","MOL Tradition"].map((v) => <option key={v} value={v}>{v}</option>)}</select><input placeholder="Number of Voyage" value={voyageNumber} onChange={(e) => saveDraft(request.id, "voyageNumber", e.target.value)} className="rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none" /><input type="date" value={polDate} onChange={(e) => saveDraft(request.id, "polDate", e.target.value)} className="rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none" /><input type="date" value={podDate} onChange={(e) => saveDraft(request.id, "podDate", e.target.value)} className="rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none" /></div><div className="mt-5 flex gap-3"><button type="button" disabled={locked} onClick={() => updateInquiry(request.id, { status: "Accepted", quotedPrice, responseNote, vesselName, voyageNumber, polDate, podDate })} className={`rounded-xl px-5 py-3 font-semibold text-white ${locked ? "cursor-not-allowed bg-slate-300" : "bg-emerald-500 hover:bg-emerald-600"}`}>Accept</button><button type="button" disabled={locked} onClick={() => updateInquiry(request.id, { status: "Rejected" })} className={`rounded-xl px-5 py-3 font-semibold text-white ${locked ? "cursor-not-allowed bg-slate-300" : "bg-red-500 hover:bg-red-600"}`}>Reject</button></div></div>;})}</div>}</SectionCard>}

        {activeTab === "Bookings" && !showCompanyProfile && <SectionCard title="Booking Management">{bookings.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No bookings available.</div> : <div className="space-y-4">{bookings.slice().reverse().map((booking) => <div key={booking.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-4"><div><div className="text-xl font-semibold text-slate-900">{booking.id}</div><div className="mt-1 text-sm text-slate-500">Request ID: {booking.requestId}</div></div><div className={`rounded-full px-4 py-2 text-sm font-semibold ${booking.status === "Accepted" ? "bg-emerald-100 text-emerald-700" : booking.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{booking.status || "Pending"}</div></div><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm text-slate-700"><div><span className="font-semibold text-slate-900">Customer:</span> {booking.customerName}</div><div><span className="font-semibold text-slate-900">Customer Email:</span> {booking.customerEmail}</div><div><span className="font-semibold text-slate-900">Shipment:</span> {booking.shipmentType || "-"}</div><div><span className="font-semibold text-slate-900">Container:</span> {booking.containerType || "-"}</div><div><span className="font-semibold text-slate-900">Quoted Price:</span> {booking.quotedPrice ? `$${booking.quotedPrice}` : "-"}</div><div><span className="font-semibold text-slate-900">Origin:</span> {booking.originPort}, {booking.originCountry}</div><div><span className="font-semibold text-slate-900">Destination:</span> {booking.destinationPort}, {booking.destinationCountry}</div><div><span className="font-semibold text-slate-900">Created:</span> {booking.createdAt || "-"}</div></div>{booking.status === "Accepted" ? <button type="button" onClick={() => placeBooking(booking)} disabled={booking.placedBooking} className={`mt-5 rounded-xl px-5 py-3 font-semibold text-white ${booking.placedBooking ? "cursor-not-allowed bg-slate-300" : "bg-cyan-500 hover:bg-cyan-600"}`}>{booking.placedBooking ? "Booking Placed" : "Place Booking"}</button> : null}</div>)}</div>}</SectionCard>}

        {activeTab === "Documents" && !showCompanyProfile && <SectionCard title=""><div className="mb-8 flex gap-3">{["Company", "Customer"].map((tab) => <button key={tab} type="button" onClick={() => setCompanyDocumentTab(tab)} className={`rounded-2xl px-5 py-3 text-sm font-semibold ${companyDocumentTab === tab ? "bg-cyan-500 text-white" : "border border-slate-300 bg-white text-slate-700"}`}>{tab}</button>)}</div>{companyDocumentTab === "Company" ? <div><h3 className="text-2xl font-semibold text-slate-900">Company Documents</h3><p className="mt-2 text-lg text-slate-500">Send documents to customers and view customer uploads here.</p><div className="mt-8 space-y-5">{companyDocumentRequests.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No documents available.</div> : companyDocumentRequests.slice().reverse().map((request) => {const draft = companyDocumentDrafts[request.id] || {}; const pendingDocs = Array.isArray(draft.pendingDocs) ? draft.pendingDocs : []; const relatedDocs = companyOwnDocuments.filter((doc) => doc.requestId === request.id); return <div key={request.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-4"><div><div className="text-3xl font-semibold text-slate-900">{request.companyName || user?.name || "Company"}</div><div className="mt-1 text-lg text-slate-700">{request.originPort || "-"} → {request.destinationPort || "-"}</div><div className="mt-1 text-sm text-slate-400">Request: {request.id}</div></div><div className="text-xl text-slate-500">{request.customerName || "-"}</div></div><div className="mt-6 grid grid-cols-[220px_1fr_70px_76px] gap-3"><select value={draft.documentType || "SUPPORTING DOCUMENT"} onChange={(e) => updateCompanyDocumentDraft(request.id, { documentType: e.target.value })} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none"><option value="SUPPORTING DOCUMENT">SUPPORTING DOCUMENT</option><option value="INVOICE">INVOICE</option><option value="PACKING LIST">PACKING LIST</option><option value="BILL OF LADING">BILL OF LADING</option></select><input key={draft.fileInputKey || request.id} type="file" onChange={(e) => updateCompanyDocumentDraft(request.id, { file: e.target.files?.[0] || null })} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none" /><button type="button" onClick={() => addCompanyDocument(request)} className="rounded-2xl bg-amber-500 px-4 py-4 text-sm font-semibold text-white hover:bg-amber-600">Add</button><button type="button" onClick={() => sendCompanyDocuments(request)} className="rounded-2xl bg-cyan-500 px-4 py-4 text-sm font-semibold text-white hover:bg-cyan-600">Send</button></div><div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="grid grid-cols-[1.5fr_1.2fr_1fr_0.7fr] bg-[#e8e0c9] px-4 py-4 text-sm font-semibold text-slate-900"><div>Selected Document</div><div>Document Type</div><div>Date & Time</div><div>Action</div></div>{[...pendingDocs, ...relatedDocs].length === 0 ? <div className="px-4 py-8 text-center text-slate-500">No documents available.</div> : [...pendingDocs, ...relatedDocs].map((doc) => <div key={doc.tempId || doc.id} className="grid grid-cols-[1.5fr_1.2fr_1fr_0.7fr] items-center border-t border-slate-100 px-4 py-4 text-sm text-slate-700"><div>{doc.fileName}</div><div>{doc.documentType}</div><div>{new Date(doc.createdAt).toLocaleString()}</div><div>{doc.fileData || doc.file ? <button type="button" onClick={() => openStoredFile(doc.fileData || doc.file, doc.fileName)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">View</button> : <span className="text-slate-400">Pending</span>}</div></div>)}</div></div>;})}</div></div> : <div><h3 className="text-2xl font-semibold text-slate-900">Customer Documents</h3><p className="mt-2 text-lg text-slate-500">View documents uploaded by customers here.</p><div className="mt-8 space-y-4">{customerUploadedDocuments.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No documents available.</div> : customerUploadedDocuments.slice().reverse().map((doc) => <div key={doc.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-4"><div><div className="text-3xl font-semibold text-slate-900">{doc.customerName}</div><div className="mt-1 text-lg text-slate-700">{doc.route || "-"}</div><div className="mt-1 text-sm text-slate-400">Request: {doc.requestId || "-"}</div></div><div className="text-xl text-slate-500">{doc.companyName}</div></div><div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="grid grid-cols-[1.5fr_1.2fr_1fr_0.7fr] bg-[#e8e0c9] px-4 py-4 text-sm font-semibold text-slate-900"><div>Selected Document</div><div>Document Type</div><div>Date & Time</div><div>Action</div></div><div className="grid grid-cols-[1.5fr_1.2fr_1fr_0.7fr] items-center border-t border-slate-100 px-4 py-4 text-sm text-slate-700"><div>{doc.fileName}</div><div>{doc.documentType}</div><div>{new Date(doc.createdAt).toLocaleString()}</div><div><button type="button" onClick={() => openStoredFile(doc.fileData, doc.fileName)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">View</button></div></div></div></div>)}</div></div>}</SectionCard>}

        {activeTab === "Financials" && !showCompanyProfile && <div className="space-y-6"><div className="text-2xl font-semibold text-slate-900">{user?.name || "Company"} - Financial Dashboard</div><div className="grid gap-5 md:grid-cols-3"><StatCard label="Total Paid" value={`$${totalPaid.toLocaleString()}`} icon="✅" /><StatCard label="Pending" value={`$${totalPending.toLocaleString()}`} icon="🕒" /><StatCard label="Overdue" value={`$${totalOverdue.toLocaleString()}`} icon="❗" /></div><SectionCard title="Payment History">{payments.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No payment records available.</div> : <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-700"><th className="px-2 py-3">Payment ID</th><th className="px-2 py-3">Booking</th><th className="px-2 py-3">Amount</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Date</th><th className="px-2 py-3">Actions</th></tr></thead><tbody>{payments.slice().reverse().map((payment) => <tr key={payment.id} className="border-b border-slate-100"><td className="px-2 py-4">{payment.id}</td><td className="px-2 py-4">{payment.bookingId}</td><td className="px-2 py-4">${Number(payment.amount || 0).toLocaleString()}</td><td className="px-2 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.status === "Paid" ? "bg-emerald-100 text-emerald-700" : payment.status === "Overdue" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{payment.status}</span></td><td className="px-2 py-4">{payment.paidAt || payment.createdAt || "-"}</td><td className="px-2 py-4">{payment.receiptData ? <button type="button" onClick={() => openStoredFile(payment.receiptData, payment.receiptName || "receipt")} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">View Receipt</button> : null}</td></tr>)}</tbody></table></div>}</SectionCard></div>}

        {activeTab === "Live Tracking" && !showCompanyProfile && <VesselTrackingSimulator userEmail={email} userType="COMPANY" />}
      </main>
    </div>
  );
}

export default function LogiconnectLandingPage() {
  if (window.location.hash.startsWith("#/pdf-viewer/")) return <PdfViewerPage />;

  useEffect(() => {
    seedData();
  }, []);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegisterInfo, setShowRegisterInfo] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerType, setRegisterType] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerOrgName, setRegisterOrgName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerAddress1, setRegisterAddress1] = useState("");
  const [registerAddress2, setRegisterAddress2] = useState("");
  const [registerCity, setRegisterCity] = useState("");
  const [registerCountry, setRegisterCountry] = useState("");
  const [registerCountryCode, setRegisterCountryCode] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [showRegisterSuccessPopup, setShowRegisterSuccessPopup] = useState(false);
  
  const users = readJson("users", []);

  const stats = [
    { value: "0+", label: "Logistics Partners" },
    { value: "0+", label: "Active Shipments" },
    { value: "1+", label: "Countries" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  const features = [
    {
      title: "Verified Logistics Companies",
      text: "Connect with trusted freight forwarders and shipping providers from one professional platform.",
      icon: "✓",
    },
    {
      title: "Live Shipment Visibility",
      text: "Track shipments, manage quotes, and follow key logistics activity with ease.",
      icon: "◎",
    },
    {
      title: "Secure Document Flow",
      text: "Handle quotations, bookings, and supporting documents in one organized system.",
      icon: "▣",
    },
  ];

  const adminCountLabel = useMemo(() => String(users.filter((user) => normalizeUserType(user.type) === "ADMIN").length || 1), [users]);

  useEffect(() => {
    if (!registerSuccess) return;
    const timer = setTimeout(() => {
      setRegisterSuccess("");
      setShowRegisterInfo(false);
      setRegisterError("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [registerSuccess]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const matchedUser = users.find(
      (user) => user.email?.toLowerCase() === loginEmail.toLowerCase() && user.password === loginPassword
    );

    if (!matchedUser) {
      setLoginError("Invalid email or password.");
      return;
    }

    const matchedType = normalizeUserType(matchedUser.type);

    if (matchedType === "ADMIN") {
      setCurrentAdmin({ ...matchedUser, type: matchedType });
      setCurrentCustomer(null);
      setCurrentCompany(null);
      saveSession({ type: "ADMIN", email: matchedUser.email });
    } else if (matchedType === "CUSTOMER") {
      setCurrentCustomer({ ...matchedUser, type: matchedType });
      setCurrentAdmin(null);
      setCurrentCompany(null);
      saveSession({ type: "CUSTOMER", email: matchedUser.email });
    } else if (matchedType === "COMPANY") {
      setCurrentCompany({ ...matchedUser, type: matchedType });
      setCurrentAdmin(null);
      setCurrentCustomer(null);
      saveSession({ type: "COMPANY", email: matchedUser.email });
    } else {
      setLoginError("This account type cannot log in.");
      return;
    }
    setLoginError("");
    setShowLogin(false);
    setShowLoginPassword(false);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const normalizedEmail = registerEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setRegisterError("Enter email.");
      return;
    }
    if (users.some((user) => user.email?.toLowerCase() === normalizedEmail)) {
      setRegisterError("Already Registered Email");
      return;
    }
    const strong = registerPassword.length >= 8 && /[A-Z]/.test(registerPassword) && /[a-z]/.test(registerPassword) && /[0-9]/.test(registerPassword) && /[^A-Za-z0-9]/.test(registerPassword);
    if (!strong) {
      setRegisterError("Password must have 8+ characters, uppercase, lowercase, number, and symbol.");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Passwords do not match.");
      return;
    }
    if (!registerType) {
      setRegisterError("Please select Company or Customer.");
      return;
    }
    if (!registerOrgName.trim()) {
      setRegisterError(registerType === "COMPANY" ? "Enter company name." : "Enter customer name.");
      return;
    }
    if (!registerAddress1.trim() || !registerCity.trim() || !registerCountry || !registerMobile.trim()) {
      setRegisterError("Please complete address, city, country, and mobile number.");
      return;
    }
    if (!/^[1-9][0-9]{8}$/.test(registerMobile.trim())) {
      setRegisterError("Mobile number must contain exactly 9 digits without starting 0.");
      return;
    }

    const normalizedType = registerType.toUpperCase();
    const newUser = {
      type: normalizedType,
      name: registerOrgName.trim().toUpperCase(),
      email: normalizedEmail,
      password: registerPassword,
      address1: registerAddress1.trim(),
      address2: registerAddress2.trim(),
      city: registerCity.trim(),
      country: registerCountry,
      countryCode: registerCountryCode,
      mobile: `${registerCountryCode} ${registerMobile.trim()}`,
      approvalStatus: normalizedType === "COMPANY" ? "PENDING" : undefined,
      createdAt: new Date().toISOString(),
    };

    writeJson("users", [...users, newUser]);
    localStorage.setItem("logiconnect_last_registration", JSON.stringify(newUser));
    clearSession();

    setRegisterSuccess("Successfully Registered");
    setRegisterError("");

    setRegisterType("");
    setRegisterOrgName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setRegisterMobile("");
    setRegisterAddress1("");
    setRegisterAddress2("");
    setRegisterCity("");
    setRegisterCountry("");
    setRegisterCountryCode("");
    setShowRegisterPassword(false);
    setShowRegisterConfirmPassword(false);

    setTimeout(() => {
      setRegisterSuccess("");
      setShowRegisterInfo(false);
    }, 2000);
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    setCurrentCustomer(null);
    setCurrentCompany(null);
    setLoginPassword("");
    setShowLogin(false);
    setShowLoginPassword(false);
    clearSession();
  };

  if (currentAdmin) {
    return <AdminDashboard adminData={currentAdmin} onLogout={handleLogout} />;
  }
  if (currentCustomer) {
    return <CustomerDashboard user={currentCustomer} onLogout={handleLogout} />;
  }
  if (currentCompany) {
    return <CompanyDashboard user={currentCompany} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="relative z-20 border-b border-cyan-400/10 bg-[#07162c] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 text-xl font-bold">⚓</div>
            <div className="text-3xl font-semibold tracking-tight">
              Logi<span className="text-cyan-400">Connect</span>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            <a href="#" className="text-cyan-400">Home</a>
            <a href="#about" className="text-white transition hover:text-cyan-300">About</a>
            <a href="#how" className="text-white transition hover:text-cyan-300">How It Works</a>
            <a href="#contact" className="text-white transition hover:text-cyan-300">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowLogin(true);
                setLoginEmail("");
                setLoginPassword("");
                setLoginError("");
              }}
              className="text-sm font-semibold text-white transition hover:text-cyan-300"
            >
              Login
            </button>
            <button
              onClick={() => setShowRegisterInfo(true)}
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#08162c]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(8,22,44,0.78), rgba(8,22,44,0.78)), url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-center justify-center px-6 py-20 text-center lg:px-10">
          <div className="max-w-5xl">
            <h1 className="text-5xl font-semibold leading-tight text-white md:text-7xl">
              Connect with Trusted <span className="text-cyan-400">Logistics Partners</span>
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-200">
              Streamline your shipping operations by connecting with verified logistics companies worldwide. Get quotes, track shipments, and manage documents all in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 text-center md:grid-cols-4 lg:px-10">
          {stats.map((item) => (
            <div key={item.label}>
              <div className="text-5xl font-medium text-[#0a1730]">{item.label === "Admin Account" ? adminCountLabel : item.value}</div>
              <div className="mt-3 text-lg text-slate-600">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="bg-[#f4f7fb] px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-5xl font-semibold text-[#08162c]">Why Choose LogiConnect?</h2>
          <p className="mt-6 text-2xl text-slate-600">Everything you need to manage your logistics operations efficiently and securely.</p>
        </div>
        <div className="mx-auto mt-16 grid max-w-7xl gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl font-bold text-cyan-500">{feature.icon}</div>
              <h3 className="mt-6 text-2xl font-semibold text-[#08162c]">{feature.title}</h3>
              <p className="mt-4 text-lg leading-8 text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="bg-white px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-5xl font-semibold text-[#08162c]">How It Works</h2>
          <p className="mt-6 text-2xl text-slate-600">Register, connect with logistics partners, request quotes, and manage your shipment workflow from one place.</p>
        </div>
      </section>

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="relative w-full max-w-xl rounded-[28px] bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="absolute right-6 top-6 text-2xl text-slate-500 transition hover:text-slate-800"
            >
              ✕
            </button>

            <h2 className="text-5xl font-semibold tracking-tight text-slate-800">User Login</h2>

            <form className="mt-8 space-y-5" onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder="Email ID"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  setLoginError("");
                }}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                required
              />

              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError("");
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-5 py-4 pr-24 text-lg outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-base font-medium text-cyan-600"
                >
                  {showLoginPassword ? "Hide" : "Show"}
                </button>
              </div>

              {loginError ? <div className="text-base font-medium text-red-600">{loginError}</div> : null}

              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-400 py-4 text-xl font-semibold text-white transition hover:bg-cyan-500"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {showRegisterInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="relative w-full max-w-2xl rounded-[28px] bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowRegisterInfo(false)}
              className="absolute right-6 top-6 text-2xl text-slate-500 transition hover:text-slate-800"
            >
              ✕
            </button>

            <h2 className="text-3xl font-semibold tracking-tight text-slate-800">Register Account</h2>

            <form className="mt-8 space-y-4" onSubmit={handleRegisterSubmit}>
              <input
                type="email"
                placeholder="Email ID"
                value={registerEmail}
                onChange={(e) => {
                  setRegisterEmail(e.target.value);
                  setRegisterError("");
                  setRegisterSuccess("");
                }}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                required
              />

              <div className="relative">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => {
                    setRegisterPassword(e.target.value);
                    setRegisterError("");
                    setRegisterSuccess("");
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm pr-24 outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-medium text-cyan-600"
                >
                  {showRegisterPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    registerPassword.length >= 8 && /[A-Z]/.test(registerPassword) && /[a-z]/.test(registerPassword) && /[0-9]/.test(registerPassword) && /[^A-Za-z0-9]/.test(registerPassword)
                      ? "w-full bg-emerald-500"
                      : registerPassword.length >= 6
                      ? "w-2/3 bg-amber-400"
                      : registerPassword.length > 0
                      ? "w-1/3 bg-rose-400"
                      : "w-0"
                  }`}
                />
              </div>

              {registerError ? (
                <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                  {registerError}
                </div>
              ) : null}

              <div className="relative">
                <input
                  type={showRegisterConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={registerConfirmPassword}
                  onChange={(e) => {
                    setRegisterConfirmPassword(e.target.value);
                    setRegisterError("");
                    setRegisterSuccess("");
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-24 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterConfirmPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-medium text-cyan-600"
                >
                  {showRegisterConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-3">
                <select
                  value={registerType}
                  onChange={(e) => {
                    setRegisterType(e.target.value.toUpperCase());
                    setRegisterError("");
                    setRegisterSuccess("");
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none transition focus:border-cyan-400"
                >
                  <option value="">SELECT</option>
                  <option value="COMPANY">COMPANY</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                </select>

                {registerType && (
                  <input
                    type="text"
                    placeholder={registerType === "COMPANY" ? "COMPANY NAME" : "CUSTOMER NAME"}
                    value={registerOrgName}
                    onChange={(e) => {
                      setRegisterOrgName(e.target.value.toUpperCase());
                      setRegisterError("");
                      setRegisterSuccess("");
                    }}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                  />
                )}
              </div>

              <input
                type="text"
                placeholder="Address Line 1"
                value={registerAddress1}
                onChange={(e) => {
                  setRegisterAddress1(e.target.value);
                  setRegisterError("");
                  setRegisterSuccess("");
                }}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                required
              />

              <input
                type="text"
                placeholder="Address Line 2"
                value={registerAddress2}
                onChange={(e) => {
                  setRegisterAddress2(e.target.value);
                  setRegisterError("");
                  setRegisterSuccess("");
                }}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
              />

              <input
                type="text"
                placeholder="City"
                value={registerCity}
                onChange={(e) => {
                  setRegisterCity(e.target.value);
                  setRegisterError("");
                  setRegisterSuccess("");
                }}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                required
              />

              <div className="space-y-3">
                <select
                  value={registerCountry}
                  onChange={(e) => {
                    const selected = COUNTRY_PHONE_OPTIONS.find((item) => item.country === e.target.value);
                    setRegisterCountry(e.target.value);
                    setRegisterCountryCode(selected?.code || "");
                    setRegisterError("");
                    setRegisterSuccess("");
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                >
                  <option value="">Select Country</option>
                  {COUNTRY_PHONE_OPTIONS.map((item) => (
                    <option key={item.country} value={item.country}>{item.country}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Country"
                  value={registerCountry}
                  readOnly
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-[110px_1fr] gap-3">
                <input
                  type="text"
                  value={registerCountryCode}
                  placeholder="Code"
                  readOnly
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={registerMobile}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
                    setRegisterMobile(onlyDigits);
                    setRegisterError("");
                    setRegisterSuccess("");
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                  required
                />
              </div>

              {registerSuccess ? (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">
                  {registerSuccess}
                </div>
              ) : null}

              <button
                type="submit"
                className="rounded-2xl bg-slate-400 px-8 py-3 text-base font-semibold text-white transition hover:bg-cyan-500"
              >
                Signup
              </button>
            </form>
          </div>
        </div>
      )}

      <section className="bg-[linear-gradient(135deg,#0b1630_0%,#1a2b4a_100%)] px-6 py-24 text-white lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-5xl font-semibold">Ready to Streamline Your Logistics?</h2>
          <p className="mt-6 text-2xl text-slate-300">Join businesses already using LogiConnect.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => setShowRegisterInfo(true)}
              className="rounded-xl bg-cyan-400 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500"
            >
              Get Started Free
            </button>
            <a
              href="#contact-footer"
              className="rounded-xl border border-white px-10 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-[#0b1630]"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      <footer id="contact-footer" className="bg-[#07162c] px-6 py-16 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 text-xl font-bold">⚓</div>
              <div className="text-3xl font-semibold tracking-tight">
                Logi<span className="text-cyan-400">Connect</span>
              </div>
            </div>
            <p className="mt-6 max-w-xs text-lg leading-8 text-slate-300">
              Connecting businesses with trusted logistics partners worldwide.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold">Quick Links</h3>
            <div className="mt-6 space-y-3 text-lg text-slate-300">
              <a href="#" className="block transition hover:text-cyan-300">Home</a>
              <a href="#about" className="block transition hover:text-cyan-300">About Us</a>
              <a href="#how" className="block transition hover:text-cyan-300">How It Works</a>
              <a href="#" className="block transition hover:text-cyan-300">Company Directory</a>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold">Services</h3>
            <div className="mt-6 space-y-3 text-lg text-slate-300">
              <div>FCL Shipping</div>
              <div>LCL Shipping</div>
              <div>Air Freight</div>
              <div>Vessel Tracking</div>
              <div>Document Management</div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold">Contact Us</h3>
            <div className="mt-6 space-y-4 text-lg text-slate-300">
              <div>Email: chithrakumardakshan@gmail.com</div>
              <div>Phone: +94751185997</div>
              <div>Website: www.logiconnect.com</div>
            </div>
          </div>

          <div className="xl:justify-self-end">
            <h3 className="text-2xl font-semibold">Admin Access</h3>
            <p className="mt-6 max-w-xs text-lg leading-8 text-slate-300">
              Right side admin login for monitoring the platform.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowLogin(true);
                setLoginEmail("");
                setLoginPassword("");
                setLoginError("");
              }}
              className="mt-6 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-6 py-3 text-base font-semibold text-white transition hover:bg-cyan-500"
            >
              Admin Login
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-8 text-center text-base text-slate-400">
          © 2026 LogiConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
