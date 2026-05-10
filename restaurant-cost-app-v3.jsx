import { useState, useMemo, useEffect } from "react";

// ============================================================
// RESPONSIVE HOOK
// ============================================================
const useScreen = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024, w };
};

// ============================================================
// DAFTRA API
// ============================================================
const DaftraAPI = {
  async getProducts(sub, key) {
    const r = await fetch(`https://${sub}.daftra.com/api2/products.json?limit=100`, { headers: { apikey: key, Accept: "application/json" } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    return data.data.map((item, i) => ({
      id: i + 1, name: item.Product.name,
      price: parseFloat(item.Product.buy_price) || 0,
      unit: "كجم", category: item.Product.ProductCategory?.[0]?.name || "عام",
      stock: item.Product.stock_balance || 0, daftraId: item.Product.id,
    }));
  },
};

// ============================================================
// CURRENCIES
// ============================================================
const CURRENCIES = [
  { code: "EGP", symbol: "ج.م",  name: "الجنيه المصري",    flag: "🇪🇬", country: "مصر" },
  { code: "SAR", symbol: "ر.س",  name: "الريال السعودي",   flag: "🇸🇦", country: "السعودية" },
  { code: "AED", symbol: "د.إ",  name: "الدرهم الإماراتي", flag: "🇦🇪", country: "الإمارات" },
  { code: "KWD", symbol: "د.ك",  name: "الدينار الكويتي",  flag: "🇰🇼", country: "الكويت" },
  { code: "BHD", symbol: "د.ب",  name: "الدينار البحريني", flag: "🇧🇭", country: "البحرين" },
  { code: "QAR", symbol: "ر.ق",  name: "الريال القطري",    flag: "🇶🇦", country: "قطر" },
  { code: "JOD", symbol: "د.أ",  name: "الدينار الأردني",  flag: "🇯🇴", country: "الأردن" },
];

// ============================================================
// DEMO DATA
// ============================================================
const DEMO_INGREDIENTS = [
  { id: 1, name: "دجاج مشوي",   unit: "كجم", price: 85,  category: "بروتين",  stock: 15 },
  { id: 2, name: "أرز بسمتي",   unit: "كجم", price: 22,  category: "حبوب",    stock: 50 },
  { id: 3, name: "زيت زيتون",   unit: "لتر", price: 95,  category: "زيوت",    stock: 8  },
  { id: 4, name: "طماطم",       unit: "كجم", price: 12,  category: "خضروات",  stock: 20 },
  { id: 5, name: "بصل",         unit: "كجم", price: 8,   category: "خضروات",  stock: 25 },
  { id: 6, name: "ثوم",         unit: "كجم", price: 35,  category: "توابل",   stock: 5  },
  { id: 7, name: "جبن موزاريلا",unit: "كجم", price: 120, category: "ألبان",   stock: 10 },
  { id: 8, name: "عجينة بيتزا", unit: "كجم", price: 18,  category: "حبوب",    stock: 30 },
  { id: 9, name: "لحم بقري",    unit: "كجم", price: 180, category: "بروتين",  stock: 12 },
  { id: 10,name: "خس روماني",   unit: "كجم", price: 20,  category: "خضروات",  stock: 18 },
];

const DEMO_RECIPES = [
  { id: 1, name: "دجاج مشوي مع أرز",  category: "الأطباق الرئيسية", sellingPrice: 95,  portions: 1, ingredients: [{ ingredientId: 1, quantity: 0.25 }, { ingredientId: 2, quantity: 0.15 }, { ingredientId: 3, quantity: 0.02 }, { ingredientId: 5, quantity: 0.05 }] },
  { id: 2, name: "بيتزا مارغريتا",    category: "البيتزا",           sellingPrice: 85,  portions: 1, ingredients: [{ ingredientId: 8, quantity: 0.3  }, { ingredientId: 7, quantity: 0.15 }, { ingredientId: 4, quantity: 0.2  }, { ingredientId: 3, quantity: 0.02 }] },
  { id: 3, name: "برجر لحم بقري",     category: "البرجر",            sellingPrice: 120, portions: 1, ingredients: [{ ingredientId: 9, quantity: 0.2  }, { ingredientId: 4, quantity: 0.05 }, { ingredientId: 5, quantity: 0.03 }, { ingredientId: 6, quantity: 0.01 }] },
];

const PAGES = { SETUP: "setup", DASHBOARD: "dashboard", INGREDIENTS: "ingredients", RECIPES: "recipes", REPORTS: "reports" };

// ============================================================
// LIGHT WARM THEME — CLink Brand
// ============================================================
const C = {
  bg:         "#FFFDF7",
  surface:    "#FEF8ED",
  surface2:   "#FDF3D8",
  border:     "#E8D090",
  borderSoft: "#F2E4B0",
  gold:       "#C8A84B",
  goldDark:   "#9B7820",
  goldPale:   "#C8A84B18",
  goldLight:  "#FFF8E0",
  text:       "#1E1408",
  textDim:    "#5C4020",
  textFaint:  "#9B7840",
  positive:   "#1A6B1A",
  negative:   "#B03020",
  warning:    "#C07010",
  info:       "#1A5C8A",
  white:      "#FFFFFF",
  shadow:     "0 2px 12px rgba(200,168,75,0.12)",
  shadowMd:   "0 4px 24px rgba(200,168,75,0.16)",
};

const getColor = (pct) => pct <= 28 ? C.positive : pct <= 35 ? C.warning : C.negative;
const getLabel = (pct) => pct <= 28 ? "ممتاز" : pct <= 35 ? "مقبول" : "مرتفع";

// ============================================================
// SHARED COMPONENTS
// ============================================================
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px", boxShadow: C.shadow, ...style }}>{children}</div>
);

const CardTitle = ({ children, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
    <div style={{ fontSize: 14, fontWeight: 700, color: C.goldDark }}>{children}</div>
    {action}
  </div>
);

const Badge = ({ children, color = C.gold }) => (
  <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: color + "18", color, border: `1px solid ${color}30`, fontSize: 11, fontWeight: 700 }}>{children}</span>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", style = {}, disabled = false }) => {
  const base = { fontFamily: "'Cairo', sans-serif", fontWeight: 700, border: "none", cursor: disabled ? "not-allowed" : "pointer", borderRadius: 8, transition: "all 0.15s", opacity: disabled ? 0.6 : 1 };
  const sizes = { sm: { padding: "5px 12px", fontSize: 12 }, md: { padding: "9px 18px", fontSize: 13 }, lg: { padding: "12px 24px", fontSize: 15 } };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`, color: "#fff", boxShadow: `0 2px 8px ${C.gold}40` },
    ghost:   { background: "transparent", color: C.gold, border: `1px solid ${C.gold}` },
    danger:  { background: "#FFF0EE", color: C.negative, border: `1px solid ${C.negative}30` },
    light:   { background: C.goldLight, color: C.goldDark, border: `1px solid ${C.border}` },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>{children}</button>;
};

const Input = ({ value, onChange, placeholder, type = "text", style = {} }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{ width: "100%", padding: "10px 13px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontFamily: "'Cairo', sans-serif", background: C.white, color: C.text, outline: "none", boxSizing: "border-box", ...style }}
  />
);

const Select = ({ value, onChange, children, style = {} }) => (
  <select value={value} onChange={onChange}
    style={{ width: "100%", padding: "10px 13px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontFamily: "'Cairo', sans-serif", background: C.white, color: C.text, boxSizing: "border-box", ...style }}>
    {children}
  </select>
);

const Label = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: C.textFaint, marginBottom: 5, letterSpacing: 0.5 }}>{children}</div>
);

const HBar = ({ value, max, color = C.gold, height = 6 }) => (
  <div style={{ height, background: C.surface2, borderRadius: 3, overflow: "hidden", flex: 1 }}>
    <div style={{ height: "100%", width: `${Math.min((value / max) * 100, 100)}%`, background: color, borderRadius: 3, transition: "width 0.5s" }} />
  </div>
);

const Modal = ({ children, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(30,20,8,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
      {children}
    </div>
  </div>
);

const ModalTitle = ({ children }) => (
  <div style={{ fontSize: 18, fontWeight: 800, color: C.goldDark, marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>{children}</div>
);

// ============================================================
// LOGO COMPONENT
// ============================================================
const CLinkLogo = ({ size = 32, showText = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <rect width="48" height="48" rx="11" fill={C.gold} />
      <path d="M 33.19 14.81 A 13 13 0 1 0 33.19 33.19" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="33.19" cy="14.81" r="3" fill="white" />
      <circle cx="33.19" cy="33.19" r="3" fill="white" />
      <line x1="36" y1="14.81" x2="43" y2="14.81" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" opacity="0.7" />
      <line x1="36" y1="33.19" x2="43" y2="33.19" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" opacity="0.7" />
      <circle cx="44.5" cy="24" r="2" fill="white" opacity="0.85" />
    </svg>
    {showText && (
      <div>
        <div style={{ fontSize: size * 0.48, fontWeight: 900, color: C.goldDark, lineHeight: 1, fontFamily: "Georgia, serif", letterSpacing: -0.3 }}>
          CLink<span style={{ color: C.gold }}>·</span>
        </div>
        <div style={{ fontSize: size * 0.2, color: C.gold, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase", marginTop: 1 }}>Financial Apps</div>
      </div>
    )}
  </div>
);

// ============================================================
// TABLE WRAPPER (scrollable on mobile)
// ============================================================
const TableWrap = ({ children }) => (
  <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>{children}</table>
  </div>
);
const Th = ({ children }) => <th style={{ textAlign: "right", padding: "9px 12px", fontSize: 11, color: C.textFaint, borderBottom: `2px solid ${C.border}`, fontWeight: 700, whiteSpace: "nowrap" }}>{children}</th>;
const Td = ({ children, style = {} }) => <td style={{ padding: "11px 12px", fontSize: 13, borderBottom: `1px solid ${C.borderSoft}`, color: C.textDim, verticalAlign: "middle", ...style }}>{children}</td>;

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const { isMobile, isTablet, isDesktop } = useScreen();
  const [page, setPage] = useState(PAGES.SETUP);
  const [connection, setConnection] = useState({ subdomain: "", apiKey: "", status: "disconnected" });
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [ingredients, setIngredients] = useState(DEMO_INGREDIENTS);
  const [recipes, setRecipes] = useState(DEMO_RECIPES);
  const [alert, setAlert] = useState(null);
  const [showIngForm, setShowIngForm] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [newIng, setNewIng] = useState({ name: "", unit: "كجم", price: "", category: "خضروات" });
  const [newRecipe, setNewRecipe] = useState({ name: "", category: "الأطباق الرئيسية", sellingPrice: "", portions: 1, ingredients: [] });
  const [recipeIngRow, setRecipeIngRow] = useState({ ingredientId: "", quantity: "" });

  const toast = (msg, type = "success") => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3000); };

  const connectDaftra = async () => {
    if (!connection.subdomain || !connection.apiKey) return toast("أدخل النطاق الفرعي ومفتاح API", "error");
    setConnection(c => ({ ...c, status: "connecting" }));
    try {
      const products = await DaftraAPI.getProducts(connection.subdomain, connection.apiKey);
      setIngredients(products.map((p, i) => ({ ...p, id: i + 1 })));
      setConnection(c => ({ ...c, status: "connected" }));
      toast(`تم الاتصال! جُلب ${products.length} مكوّن من دفترة`);
      setPage(PAGES.DASHBOARD);
    } catch {
      setConnection(c => ({ ...c, status: "demo" }));
      toast("وضع التجربة — الاتصال الحقيقي يعمل بعد النشر على دفترة", "warn");
      setPage(PAGES.DASHBOARD);
    }
  };

  const calcCost = (recipe) => recipe.ingredients.reduce((sum, ri) => {
    const ing = ingredients.find(i => i.id === ri.ingredientId);
    return sum + (ing ? ing.price * ri.quantity : 0);
  }, 0);

  const enriched = useMemo(() => recipes.map(r => {
    const cost = calcCost(r);
    const pct = r.sellingPrice > 0 ? (cost / r.sellingPrice) * 100 : 0;
    return { ...r, cost, pct, profit: r.sellingPrice - cost };
  }), [recipes, ingredients]);

  const avgFoodCost = useMemo(() => enriched.length ? enriched.reduce((s, r) => s + r.pct, 0) / enriched.length : 0, [enriched]);

  const addIngredient = () => {
    if (!newIng.name || !newIng.price) return toast("أدخل اسم المكوّن والسعر", "error");
    setIngredients([...ingredients, { ...newIng, id: Date.now(), price: parseFloat(newIng.price) }]);
    setNewIng({ name: "", unit: "كجم", price: "", category: "خضروات" });
    setShowIngForm(false); toast("تم إضافة المكوّن");
  };

  const addRecipeIng = () => {
    if (!recipeIngRow.ingredientId || !recipeIngRow.quantity) return;
    setNewRecipe(r => ({ ...r, ingredients: [...r.ingredients, { ingredientId: parseInt(recipeIngRow.ingredientId), quantity: parseFloat(recipeIngRow.quantity) }] }));
    setRecipeIngRow({ ingredientId: "", quantity: "" });
  };

  const saveRecipe = () => {
    if (!newRecipe.name || !newRecipe.sellingPrice) return toast("أدخل اسم الوصفة وسعر البيع", "error");
    if (editingRecipe) {
      setRecipes(rs => rs.map(r => r.id === editingRecipe ? { ...newRecipe, id: editingRecipe, sellingPrice: parseFloat(newRecipe.sellingPrice) } : r));
      toast("تم تعديل الوصفة");
    } else {
      setRecipes(rs => [...rs, { ...newRecipe, id: Date.now(), sellingPrice: parseFloat(newRecipe.sellingPrice) }]);
      toast("تم إضافة الوصفة");
    }
    setShowRecipeForm(false); setEditingRecipe(null);
    setNewRecipe({ name: "", category: "الأطباق الرئيسية", sellingPrice: "", portions: 1, ingredients: [] });
  };

  const statusColors = { disconnected: C.textFaint, connecting: C.warning, connected: C.positive, demo: C.warning, error: C.negative };
  const statusLabels = { disconnected: "غير متصل", connecting: "جاري الاتصال...", connected: "متصل بدفترة", demo: "وضع التجربة", error: "خطأ" };

  const navItems = [
    { id: PAGES.DASHBOARD,   icon: "◈", label: "الرئيسية" },
    { id: PAGES.INGREDIENTS, icon: "⊞", label: "المكوّنات" },
    { id: PAGES.RECIPES,     icon: "✦", label: "الوصفات" },
    { id: PAGES.REPORTS,     icon: "◎", label: "التقارير" },
    { id: PAGES.SETUP,       icon: "⚙", label: "الإعدادات" },
  ];

  // ── SIDEBAR (Desktop) ──────────────────────────────────────
  const Sidebar = () => (
    <div style={{ width: isTablet ? 72 : 230, background: C.white, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 10, boxShadow: "2px 0 16px rgba(200,168,75,0.08)" }}>
      <div style={{ padding: isTablet ? "18px 12px" : "18px 18px", borderBottom: `1px solid ${C.borderSoft}` }}>
        {isTablet ? <CLinkLogo size={36} showText={false} /> : <CLinkLogo size={32} showText={true} />}
        {!isTablet && (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: C.goldLight, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 14 }}>⬡</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.goldDark }}>Menu</div>
              <div style={{ fontSize: 9, color: C.textFaint }}>حاسبة تكلفة المطاعم</div>
            </div>
            <span style={{ marginRight: "auto", fontSize: 14 }}>{currency.flag}</span>
          </div>
        )}
      </div>
      <nav style={{ flex: 1, padding: isTablet ? "12px 8px" : "14px 12px" }}>
        {navItems.map(item => (
          <div key={item.id} onClick={() => setPage(item.id)} style={{
            display: "flex", alignItems: "center", gap: isTablet ? 0 : 10, justifyContent: isTablet ? "center" : "flex-start",
            padding: isTablet ? "12px" : "10px 12px", borderRadius: 10, marginBottom: 3, cursor: "pointer",
            background: page === item.id ? C.goldPale : "transparent",
            border: `1px solid ${page === item.id ? C.gold + "50" : "transparent"}`,
            color: page === item.id ? C.gold : C.textFaint,
            fontWeight: page === item.id ? 700 : 400, fontSize: 13, transition: "all 0.15s"
          }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {!isTablet && <span>{item.label}</span>}
          </div>
        ))}
      </nav>
      <div style={{ padding: "12px 14px", borderTop: `1px solid ${C.borderSoft}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: statusColors[connection.status], flexShrink: 0 }} />
          {!isTablet && <span style={{ fontSize: 11, color: statusColors[connection.status], fontWeight: 600 }}>{statusLabels[connection.status]}</span>}
        </div>
      </div>
    </div>
  );

  // ── BOTTOM NAV (Mobile) ────────────────────────────────────
  const BottomNav = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 10, boxShadow: "0 -4px 16px rgba(200,168,75,0.1)" }}>
      {navItems.map(item => (
        <div key={item.id} onClick={() => setPage(item.id)} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "8px 4px", cursor: "pointer",
          color: page === item.id ? C.gold : C.textFaint,
          borderTop: `2px solid ${page === item.id ? C.gold : "transparent"}`,
          background: page === item.id ? C.goldPale : "transparent",
          transition: "all 0.15s"
        }}>
          <span style={{ fontSize: 18, marginBottom: 2 }}>{item.icon}</span>
          <span style={{ fontSize: 9, fontWeight: page === item.id ? 700 : 400 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );

  const sidebarWidth = isMobile ? 0 : isTablet ? 72 : 230;
  const mainPad = isMobile ? "16px 14px 80px" : "24px 28px";

  // ── SETUP ──────────────────────────────────────────────────
  const renderSetup = () => (
    <div style={{ maxWidth: 560 }}>
      <Card style={{ marginBottom: 16 }}>
        <CardTitle>⚙ ربط التطبيق بدفترة</CardTitle>
        <div style={{ marginBottom: 12 }}>
          <Label>النطاق الفرعي</Label>
          <div style={{ display: "flex" }}>
            <Input value={connection.subdomain} onChange={e => setConnection(c => ({ ...c, subdomain: e.target.value }))} placeholder="اسم-شركتك" style={{ borderRadius: "8px 0 0 8px" }} />
            <div style={{ padding: "10px 12px", background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: "0 8px 8px 0", fontSize: 12, color: C.textFaint, whiteSpace: "nowrap" }}>.daftra.com</div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Label>مفتاح API</Label>
          <Input type="password" value={connection.apiKey} onChange={e => setConnection(c => ({ ...c, apiKey: e.target.value }))} placeholder="أدخل مفتاح API" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <Label>العملة</Label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {CURRENCIES.map(c => (
              <div key={c.code} onClick={() => setCurrency(c)} style={{ padding: "8px 6px", borderRadius: 8, border: `1.5px solid ${currency.code === c.code ? C.gold : C.border}`, background: currency.code === c.code ? C.goldPale : C.surface, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{c.flag}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: currency.code === c.code ? C.goldDark : C.textDim }}>{c.symbol}</div>
                <div style={{ fontSize: 9, color: C.textFaint }}>{c.country}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={connectDaftra} disabled={connection.status === "connecting"}>
            {connection.status === "connecting" ? "جاري الاتصال..." : "اتصال بدفترة"}
          </Btn>
          <Btn variant="light" onClick={() => { setConnection(c => ({ ...c, status: "demo" })); setPage(PAGES.DASHBOARD); }}>تجربة بدون اتصال</Btn>
        </div>
      </Card>
      <Card>
        <CardTitle>ℹ كيف يعمل الربط؟</CardTitle>
        {["يجلب منتجاتك من دفترة كمكوّنات مع أسعار الشراء", "يحدّث الأسعار تلقائياً من فواتير المشتريات", "يعمل الاتصال الكامل عند النشر على متجر دفترة"].map((text, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
            <span style={{ background: C.goldPale, color: C.gold, padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 13, color: C.textDim, lineHeight: 1.6, fontFamily: "'Cairo', sans-serif" }}>{text}</span>
          </div>
        ))}
      </Card>
    </div>
  );

  // ── DASHBOARD ──────────────────────────────────────────────
  const renderDashboard = () => (
    <>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "متوسط نسبة التكلفة", value: `${avgFoodCost.toFixed(1)}%`, color: getColor(avgFoodCost), sub: getLabel(avgFoodCost) },
          { label: "عدد الوصفات", value: enriched.length, color: C.info, sub: "وصفة" },
          { label: "المكوّنات", value: ingredients.length, color: C.gold, sub: "مكوّن" },
          { label: "أعلى هامش", value: enriched.length ? `${Math.max(...enriched.map(r => r.profit)).toFixed(0)}` : "—", color: C.positive, sub: currency.symbol },
        ].map((k, i) => (
          <Card key={i} style={{ padding: "16px 18px", borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 10, color: C.textFaint, fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: 16 }}>
        <CardTitle>✦ أداء الوصفات</CardTitle>
        <TableWrap>
          <thead><tr>{["الوصفة", "تكلفة الطبق", "سعر البيع", "هامش الربح", "نسبة التكلفة", "الحالة"].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {enriched.map(r => (
              <tr key={r.id} style={{ background: "transparent" }}>
                <Td style={{ fontWeight: 700, color: C.text }}>{r.name}</Td>
                <Td>{r.cost.toFixed(2)} {currency.symbol}</Td>
                <Td>{r.sellingPrice} {currency.symbol}</Td>
                <Td style={{ color: C.positive, fontWeight: 700 }}>{r.profit.toFixed(2)} {currency.symbol}</Td>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <HBar value={r.pct} max={50} color={getColor(r.pct)} />
                    <span style={{ color: getColor(r.pct), fontWeight: 700, fontSize: 12, minWidth: 36 }}>{r.pct.toFixed(1)}%</span>
                  </div>
                </Td>
                <Td><Badge color={getColor(r.pct)}>{getLabel(r.pct)}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
        <Card>
          <CardTitle>⊞ أغلى المكوّنات</CardTitle>
          {[...ingredients].sort((a, b) => b.price - a.price).slice(0, 5).map((ing, i) => (
            <div key={ing.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: C.textFaint, fontWeight: 800, width: 16 }}>#{i + 1}</span>
                <div>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{ing.name}</div>
                  <div style={{ fontSize: 10, color: C.textFaint }}>{ing.category}</div>
                </div>
              </div>
              <span style={{ color: C.goldDark, fontWeight: 700, fontSize: 13 }}>{ing.price} {currency.symbol}/{ing.unit}</span>
            </div>
          ))}
        </Card>
        <Card>
          <CardTitle>◎ ملخص الحالة</CardTitle>
          {[
            { label: "ممتازة (≤28%)", n: enriched.filter(r => r.pct <= 28).length, color: C.positive },
            { label: "مقبولة (29-35%)", n: enriched.filter(r => r.pct > 28 && r.pct <= 35).length, color: C.warning },
            { label: "مرتفعة (>35%)", n: enriched.filter(r => r.pct > 35).length, color: C.negative },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
              <span style={{ fontSize: 13, color: C.textDim }}>{item.label}</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: item.color }}>{item.n}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: "10px 14px", background: avgFoodCost <= 30 ? "#F0FFF0" : "#FFFBF0", borderRadius: 8, border: `1px solid ${avgFoodCost <= 30 ? C.positive + "40" : C.warning + "40"}` }}>
            <div style={{ fontSize: 12, color: avgFoodCost <= 30 ? C.positive : C.warning, fontWeight: 600 }}>
              {avgFoodCost <= 28 ? "✓ نسبة ممتازة — استمر" : avgFoodCost <= 35 ? "⚠ راجع الوصفات ذات التكلفة المرتفعة" : "✗ مراجعة عاجلة للأسعار"}
            </div>
          </div>
        </Card>
      </div>
    </>
  );

  // ── INGREDIENTS ────────────────────────────────────────────
  const renderIngredients = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: C.textFaint }}>{ingredients.length} مكوّن</span>
        <Btn onClick={() => setShowIngForm(true)} size="sm">+ إضافة مكوّن</Btn>
      </div>
      <Card>
        <TableWrap>
          <thead><tr>{["المكوّن", "التصنيف", "الوحدة", "سعر الشراء", "إجراء"].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {ingredients.map(ing => (
              <tr key={ing.id}>
                <Td style={{ fontWeight: 700, color: C.text }}>{ing.name}</Td>
                <Td><Badge>{ing.category}</Badge></Td>
                <Td>{ing.unit}</Td>
                <Td style={{ color: C.goldDark, fontWeight: 700 }}>{ing.price} {currency.symbol}</Td>
                <Td><Btn variant="danger" size="sm" onClick={() => { setIngredients(i => i.filter(x => x.id !== ing.id)); toast("تم الحذف"); }}>حذف</Btn></Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>
      {showIngForm && (
        <Modal onClose={() => setShowIngForm(false)}>
          <ModalTitle>إضافة مكوّن جديد</ModalTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div><Label>اسم المكوّن</Label><Input value={newIng.name} onChange={e => setNewIng({ ...newIng, name: e.target.value })} placeholder="مثال: دجاج طازج" /></div>
            <div><Label>التصنيف</Label><Select value={newIng.category} onChange={e => setNewIng({ ...newIng, category: e.target.value })}>{["بروتين", "خضروات", "حبوب", "ألبان", "زيوت", "توابل", "أخرى"].map(c => <option key={c}>{c}</option>)}</Select></div>
            <div><Label>وحدة القياس</Label><Select value={newIng.unit} onChange={e => setNewIng({ ...newIng, unit: e.target.value })}>{["كجم", "جم", "لتر", "مل", "حبة", "علبة"].map(u => <option key={u}>{u}</option>)}</Select></div>
            <div><Label>السعر ({currency.symbol})</Label><Input type="number" value={newIng.price} onChange={e => setNewIng({ ...newIng, price: e.target.value })} placeholder="0.00" /></div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setShowIngForm(false)}>إلغاء</Btn>
            <Btn onClick={addIngredient}>حفظ</Btn>
          </div>
        </Modal>
      )}
    </>
  );

  // ── RECIPES ────────────────────────────────────────────────
  const renderRecipes = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: C.textFaint }}>{recipes.length} وصفة</span>
        <Btn onClick={() => { setEditingRecipe(null); setNewRecipe({ name: "", category: "الأطباق الرئيسية", sellingPrice: "", portions: 1, ingredients: [] }); setShowRecipeForm(true); }} size="sm">+ إضافة وصفة</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)", gap: 14 }}>
        {enriched.map(r => (
          <Card key={r.id} style={{ borderTop: `3px solid ${getColor(r.pct)}`, padding: "18px 18px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 6 }}>{r.name}</div>
            <div style={{ marginBottom: 14 }}><Badge>{r.category}</Badge></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[
                { label: "تكلفة الطبق", val: `${r.cost.toFixed(2)} ${currency.symbol}`, color: C.negative },
                { label: "سعر البيع",   val: `${r.sellingPrice} ${currency.symbol}`,   color: C.info },
                { label: "هامش الربح", val: `${r.profit.toFixed(2)} ${currency.symbol}`, color: C.positive },
                { label: "نسبة التكلفة",val: `${r.pct.toFixed(1)}%`,                   color: getColor(r.pct) },
              ].map((item, i) => (
                <div key={i} style={{ background: C.surface, borderRadius: 8, padding: "9px 10px" }}>
                  <div style={{ fontSize: 10, color: C.textFaint, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 10 }}>
              <HBar value={r.pct} max={50} color={getColor(r.pct)} height={6} />
            </div>
            <Btn variant="ghost" size="sm" style={{ width: "100%", textAlign: "center" }} onClick={() => { setNewRecipe({ ...r, sellingPrice: r.sellingPrice.toString() }); setEditingRecipe(r.id); setShowRecipeForm(true); }}>تعديل</Btn>
          </Card>
        ))}
      </div>
      {showRecipeForm && (
        <Modal onClose={() => { setShowRecipeForm(false); setEditingRecipe(null); }}>
          <ModalTitle>{editingRecipe ? "تعديل الوصفة" : "إضافة وصفة جديدة"}</ModalTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div><Label>اسم الوصفة</Label><Input value={newRecipe.name} onChange={e => setNewRecipe({ ...newRecipe, name: e.target.value })} /></div>
            <div><Label>التصنيف</Label><Select value={newRecipe.category} onChange={e => setNewRecipe({ ...newRecipe, category: e.target.value })}>{["الأطباق الرئيسية", "البيتزا", "البرجر", "السلطات", "المشروبات", "الحلويات"].map(c => <option key={c}>{c}</option>)}</Select></div>
            <div><Label>سعر البيع ({currency.symbol})</Label><Input type="number" value={newRecipe.sellingPrice} onChange={e => setNewRecipe({ ...newRecipe, sellingPrice: e.target.value })} /></div>
            <div><Label>عدد الحصص</Label><Input type="number" value={newRecipe.portions} onChange={e => setNewRecipe({ ...newRecipe, portions: parseInt(e.target.value) })} /></div>
          </div>
          <Label>إضافة مكوّنات</Label>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Select value={recipeIngRow.ingredientId} onChange={e => setRecipeIngRow({ ...recipeIngRow, ingredientId: e.target.value })} style={{ flex: 2 }}>
              <option value="">اختر مكوّناً</option>
              {ingredients.map(i => <option key={i.id} value={i.id}>{i.name} — {i.price} {currency.symbol}/{i.unit}</option>)}
            </Select>
            <Input type="number" step="0.01" placeholder="الكمية" value={recipeIngRow.quantity} onChange={e => setRecipeIngRow({ ...recipeIngRow, quantity: e.target.value })} style={{ flex: 1 }} />
            <Btn onClick={addRecipeIng}>+</Btn>
          </div>
          {newRecipe.ingredients.length > 0 && (
            <div style={{ background: C.surface, borderRadius: 8, padding: "12px", marginBottom: 14 }}>
              {newRecipe.ingredients.map((ri, i) => {
                const ing = ingredients.find(x => x.id === ri.ingredientId);
                return ing ? (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
                    <span style={{ fontSize: 13, color: C.text }}>{ing.name}</span>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: C.textFaint }}>{ri.quantity} {ing.unit}</span>
                      <span style={{ color: C.goldDark, fontWeight: 700, fontSize: 12 }}>{(ing.price * ri.quantity).toFixed(2)} {currency.symbol}</span>
                      <button onClick={() => setNewRecipe(r => ({ ...r, ingredients: r.ingredients.filter((_, idx) => idx !== i) }))} style={{ background: "none", border: "none", color: C.negative, cursor: "pointer", fontSize: 16 }}>×</button>
                    </div>
                  </div>
                ) : null;
              })}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`, fontWeight: 700, fontSize: 13 }}>
                <span style={{ color: C.textDim }}>الإجمالي</span>
                <span style={{ color: C.goldDark }}>{newRecipe.ingredients.reduce((sum, ri) => { const ing = ingredients.find(x => x.id === ri.ingredientId); return sum + (ing ? ing.price * ri.quantity : 0); }, 0).toFixed(2)} {currency.symbol}</span>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => { setShowRecipeForm(false); setEditingRecipe(null); }}>إلغاء</Btn>
            <Btn onClick={saveRecipe}>{editingRecipe ? "حفظ التعديلات" : "حفظ الوصفة"}</Btn>
          </div>
        </Modal>
      )}
    </>
  );

  // ── REPORTS ────────────────────────────────────────────────
  const renderReports = () => (
    <>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card>
          <CardTitle>⚠ أعلى نسب تكلفة</CardTitle>
          {[...enriched].sort((a, b) => b.pct - a.pct).map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{r.name}</div>
                <div style={{ fontSize: 11, color: C.textFaint }}>تكلفة: {r.cost.toFixed(2)} {currency.symbol}</div>
              </div>
              <Badge color={getColor(r.pct)}>{r.pct.toFixed(1)}%</Badge>
            </div>
          ))}
        </Card>
        <Card>
          <CardTitle>✦ أعلى هوامش ربح</CardTitle>
          {[...enriched].sort((a, b) => b.profit - a.profit).map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{r.name}</div>
                <div style={{ fontSize: 11, color: C.textFaint }}>سعر البيع: {r.sellingPrice} {currency.symbol}</div>
              </div>
              <span style={{ color: C.positive, fontWeight: 800, fontSize: 15 }}>+{r.profit.toFixed(2)} {currency.symbol}</span>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <CardTitle>◎ تقرير شامل</CardTitle>
        <TableWrap>
          <thead><tr>{["الوصفة", "تكلفة المكوّنات", "سعر البيع", "هامش الربح", "نسبة التكلفة", "التوصية"].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {enriched.map(r => (
              <tr key={r.id}>
                <Td style={{ fontWeight: 700, color: C.text }}>{r.name}</Td>
                <Td>{r.cost.toFixed(2)} {currency.symbol}</Td>
                <Td>{r.sellingPrice} {currency.symbol}</Td>
                <Td style={{ color: C.positive, fontWeight: 700 }}>{r.profit.toFixed(2)} {currency.symbol}</Td>
                <Td style={{ color: getColor(r.pct), fontWeight: 700 }}>{r.pct.toFixed(1)}%</Td>
                <Td style={{ fontSize: 12 }}>{r.pct <= 28 ? "✓ لا تعديل" : r.pct <= 35 ? "⚠ راجع الكميات" : "✗ رفع السعر"}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>
    </>
  );

  const pageTitle = { [PAGES.SETUP]: "إعدادات دفترة", [PAGES.DASHBOARD]: "لوحة التحكم", [PAGES.INGREDIENTS]: "المكوّنات", [PAGES.RECIPES]: "الوصفات", [PAGES.REPORTS]: "التقارير" }[page];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Cairo', sans-serif", direction: "rtl" }}>

        {/* Toast */}
        {alert && (
          <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: C.white, border: `1.5px solid ${alert.type === "error" ? C.negative : alert.type === "warn" ? C.warning : C.positive}`, color: alert.type === "error" ? C.negative : alert.type === "warn" ? C.warning : C.positive, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, zIndex: 999, boxShadow: C.shadowMd, whiteSpace: "nowrap" }}>
            {alert.msg}
          </div>
        )}

        {/* Sidebar or Bottom Nav */}
        {!isMobile && <Sidebar />}
        {isMobile && <BottomNav />}

        {/* Main Content */}
        <main style={{ marginRight: sidebarWidth, padding: mainPad, minHeight: "100vh" }}>
          {/* Top Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, paddingBottom: 16, borderBottom: `1px solid ${C.borderSoft}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {isMobile && <CLinkLogo size={28} showText={false} />}
              <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: C.text, margin: 0 }}>{pageTitle}</h1>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {connection.status === "demo" && <Badge color={C.warning}>تجربة</Badge>}
              <span style={{ fontSize: 16 }}>{currency.flag}</span>
              {!isMobile && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: C.goldLight, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.goldDark, fontWeight: 700 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: statusColors[connection.status] }} />
                  {statusLabels[connection.status]}
                </div>
              )}
            </div>
          </div>

          {page === PAGES.SETUP        && renderSetup()}
          {page === PAGES.DASHBOARD    && renderDashboard()}
          {page === PAGES.INGREDIENTS  && renderIngredients()}
          {page === PAGES.RECIPES      && renderRecipes()}
          {page === PAGES.REPORTS      && renderReports()}
        </main>
      </div>
    </>
  );
}
