const money = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const dateTime = new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short" });
const collapsedPanels = {
  orders: false,
  customers: false,
};

const categoryMeta = [
  { id: "spices", label: "Spices", prefix: "spices" },
  { id: "mixes", label: "Spice blends", prefix: "mixes" },
  { id: "flavors", label: "Flavourings", prefix: "flavors" },
  { id: "zaatar", label: "Za'atar", prefix: "zaatar" },
  { id: "herbs", label: "Herbs", prefix: "herbs" },
  { id: "attara", label: "Herbal goods", prefix: "attara" },
  { id: "food", label: "Food goods", prefix: "food" },
  { id: "body-care", label: "Body care", prefix: "body-care" },
  { id: "nuts", label: "Nuts", prefix: "nuts" },
  { id: "special-offers", label: "Special offers", prefix: "special-offers" },
];

const products = [
  [
    "spices-001",
    "زنجبيل حب"
  ],
  [
    "spices-002",
    "زنجبيل مطحون"
  ],
  [
    "spices-003",
    "فلفل أسود مطحون"
  ],
  [
    "spices-004",
    "فلفل أسود حب"
  ],
  [
    "spices-005",
    "فلفل أبيض مطحون"
  ],
  [
    "spices-006",
    "فلفل أبيض حب"
  ],
  [
    "spices-007",
    "خولنجان حب"
  ],
  [
    "spices-008",
    "خولنجان مطحون"
  ],
  [
    "spices-009",
    "كركم حب"
  ],
  [
    "spices-010",
    "كركم مطحون"
  ],
  [
    "spices-011",
    "كمون حب"
  ],
  [
    "spices-012",
    "كمون مطحون"
  ],
  [
    "spices-013",
    "يانسون حب"
  ],
  [
    "spices-014",
    "يانسون نجمة"
  ],
  [
    "spices-015",
    "يانسون مطحون"
  ],
  [
    "spices-016",
    "كزبرة حب"
  ],
  [
    "spices-017",
    "كزبرة مطحونة"
  ],
  [
    "spices-018",
    "قرنفل حب"
  ],
  [
    "spices-019",
    "قرنفل مطحون"
  ],
  [
    "spices-020",
    "لومي"
  ],
  [
    "spices-021",
    "شمرا حب"
  ],
  [
    "spices-022",
    "شمرا مطحونة"
  ],
  [
    "spices-023",
    "بهار حلو حب"
  ],
  [
    "spices-024",
    "بهار حلو مطحون"
  ],
  [
    "spices-025",
    "قرفة عيدان"
  ],
  [
    "spices-026",
    "قرفة سيجار"
  ],
  [
    "spices-027",
    "قرفة مطحونة"
  ],
  [
    "spices-028",
    "سمسم ني"
  ],
  [
    "spices-029",
    "سمسم"
  ],
  [
    "spices-030",
    "سمسم محمص"
  ],
  [
    "spices-031",
    "حبة البركة"
  ],
  [
    "spices-032",
    "سماق حب"
  ],
  [
    "spices-033",
    "سماق مطحون"
  ],
  [
    "spices-034",
    "قشر السماق"
  ],
  [
    "spices-035",
    "هيل حب"
  ],
  [
    "spices-036",
    "هيل مطحون"
  ],
  [
    "spices-037",
    "ملح صيني"
  ],
  [
    "spices-038",
    "ثوم بودرة"
  ],
  [
    "spices-039",
    "بصل بودرة"
  ],
  [
    "spices-040",
    "محلب حب"
  ],
  [
    "spices-041",
    "محلب مطحون"
  ],
  [
    "spices-042",
    "فليفلة حلوة"
  ],
  [
    "spices-043",
    "فليفلة وسط"
  ],
  [
    "spices-044",
    "شطة"
  ],
  [
    "spices-045",
    "أوريغانو"
  ],
  [
    "spices-046",
    "حلبة حب"
  ],
  [
    "spices-047",
    "حلبة مطحونة"
  ],
  [
    "spices-048",
    "ورق غار"
  ],
  [
    "spices-049",
    "كراوية حب"
  ],
  [
    "spices-050",
    "كراوية مطحونة"
  ],
  [
    "spices-051",
    "رز مطحون"
  ],
  [
    "spices-052",
    "كربونة"
  ],
  [
    "spices-053",
    "قلي"
  ],
  [
    "spices-054",
    "نعنع"
  ],
  [
    "spices-055",
    "جوزة الطيب حب"
  ],
  [
    "spices-056",
    "جوزة الطيب مطحونة"
  ],
  [
    "spices-057",
    "فلفل مشكل"
  ],
  [
    "mixes-001",
    "ماجي"
  ],
  [
    "mixes-002",
    "ماجي أبيض"
  ],
  [
    "mixes-003",
    "سبع بهارات"
  ],
  [
    "mixes-004",
    "سمك"
  ],
  [
    "mixes-005",
    "بهارات فروج بالفرن"
  ],
  [
    "mixes-006",
    "همبرغر دجاج"
  ],
  [
    "mixes-007",
    "همبرغر لحمة"
  ],
  [
    "mixes-008",
    "فلافل"
  ],
  [
    "mixes-009",
    "فلافل اكسترا"
  ],
  [
    "mixes-010",
    "كاري"
  ],
  [
    "mixes-011",
    "كبسة"
  ],
  [
    "mixes-012",
    "مندي"
  ],
  [
    "mixes-013",
    "برياني"
  ],
  [
    "mixes-014",
    "بهارات بيضاء"
  ],
  [
    "mixes-015",
    "بطاطا"
  ],
  [
    "mixes-016",
    "شاورما"
  ],
  [
    "mixes-017",
    "شاورما لحمة"
  ],
  [
    "mixes-018",
    "كريسبي"
  ],
  [
    "mixes-019",
    "شيش"
  ],
  [
    "mixes-020",
    "دجاج مدخن"
  ],
  [
    "mixes-021",
    "كليجة"
  ],
  [
    "mixes-022",
    "محاشي"
  ],
  [
    "mixes-023",
    "فاهيتا"
  ],
  [
    "mixes-024",
    "فرانشيسكو"
  ],
  [
    "mixes-025",
    "مكسيكانو"
  ],
  [
    "mixes-026",
    "بهارات سلطة"
  ],
  [
    "mixes-027",
    "سجق"
  ],
  [
    "mixes-028",
    "بروستد"
  ],
  [
    "mixes-029",
    "بهارات مشاوي"
  ],
  [
    "flavors-001",
    "جبنة"
  ],
  [
    "flavors-002",
    "كتشب"
  ],
  [
    "flavors-003",
    "خل"
  ],
  [
    "flavors-004",
    "بيتزا"
  ],
  [
    "flavors-005",
    "باربكيو"
  ],
  [
    "flavors-006",
    "نكهة ذرة"
  ],
  [
    "flavors-007",
    "مدخن"
  ],
  [
    "zaatar-001",
    "زعتر أخضر"
  ],
  [
    "zaatar-002",
    "زعتر أحمر"
  ],
  [
    "zaatar-003",
    "زعتر مناقيش"
  ],
  [
    "herbs-001",
    "مليسة"
  ],
  [
    "herbs-002",
    "بابونج"
  ],
  [
    "herbs-003",
    "ورد جوري"
  ],
  [
    "herbs-004",
    "ورد جوري زرار"
  ],
  [
    "herbs-005",
    "زهرة البنفسج"
  ],
  [
    "herbs-006",
    "لسان العصفور"
  ],
  [
    "herbs-007",
    "ختمية بيضاء"
  ],
  [
    "herbs-008",
    "ختمية سوداء"
  ],
  [
    "herbs-009",
    "عشرق"
  ],
  [
    "herbs-010",
    "سنامكي"
  ],
  [
    "herbs-011",
    "ميرمية"
  ],
  [
    "herbs-012",
    "كركديه"
  ],
  [
    "herbs-013",
    "زوفا"
  ],
  [
    "herbs-014",
    "زهرة الرمان (الجلنار)"
  ],
  [
    "herbs-015",
    "ورق زيتون"
  ],
  [
    "herbs-016",
    "زهرة الألماسة"
  ],
  [
    "herbs-017",
    "زعتر بري"
  ],
  [
    "herbs-018",
    "زعتر فارسي"
  ],
  [
    "herbs-019",
    "زهرة الياسمين"
  ],
  [
    "herbs-020",
    "عشبة القديسين"
  ],
  [
    "herbs-021",
    "خلطة زهورات شامية"
  ],
  [
    "herbs-022",
    "خلطة زهورات آسيوية"
  ],
  [
    "herbs-023",
    "قريص"
  ],
  [
    "attara-001",
    "حرمل"
  ],
  [
    "attara-002",
    "حنة طبيعية"
  ],
  [
    "attara-003",
    "صمغ عربي حب"
  ],
  [
    "attara-004",
    "صمغ عربي مطحون"
  ],
  [
    "attara-005",
    "ورق السدر"
  ],
  [
    "attara-006",
    "ورق السدر مطحون"
  ],
  [
    "attara-007",
    "لبان الذكر"
  ],
  [
    "attara-008",
    "المرة (مرمكي)"
  ],
  [
    "attara-009",
    "بزور القاطونة"
  ],
  [
    "attara-010",
    "بزر كتان"
  ],
  [
    "attara-011",
    "بزر رشاد"
  ],
  [
    "attara-012",
    "بزور الشيا"
  ],
  [
    "attara-013",
    "قسط هندي حب"
  ],
  [
    "attara-014",
    "قسط هندي مطحون"
  ],
  [
    "attara-015",
    "فاسوخ"
  ],
  [
    "attara-016",
    "عكبر حب"
  ],
  [
    "attara-017",
    "عكبر مطحون"
  ],
  [
    "attara-018",
    "حبوب اللقاح"
  ],
  [
    "attara-019",
    "طلع النخيل"
  ],
  [
    "attara-020",
    "تين الفيل"
  ],
  [
    "attara-021",
    "هندي شعيري"
  ],
  [
    "attara-022",
    "راوند"
  ],
  [
    "attara-023",
    "كف مريم"
  ],
  [
    "attara-024",
    "بذور الأكبة"
  ],
  [
    "attara-025",
    "بذور شوك الجمل"
  ],
  [
    "attara-026",
    "عشبة شوك الجمل"
  ],
  [
    "attara-027",
    "صبرا"
  ],
  [
    "attara-028",
    "حنظل"
  ],
  [
    "attara-029",
    "شرش الرباص"
  ],
  [
    "attara-030",
    "قشر الرمان"
  ],
  [
    "attara-031",
    "خلة"
  ],
  [
    "attara-032",
    "شبة حجر"
  ],
  [
    "attara-033",
    "شبة مطحونة"
  ],
  [
    "attara-034",
    "جاوي أسود"
  ],
  [
    "attara-035",
    "جاوي أحمر"
  ],
  [
    "attara-036",
    "جاوي أبيض"
  ],
  [
    "attara-037",
    "عرعر"
  ],
  [
    "attara-038",
    "شيح"
  ],
  [
    "attara-039",
    "عشبة مورينغا"
  ],
  [
    "attara-040",
    "ماتشا"
  ],
  [
    "attara-041",
    "علكة عربية (علك بطم)"
  ],
  [
    "attara-042",
    "زعرور"
  ],
  [
    "attara-043",
    "شرش الحلاوة"
  ],
  [
    "food-001",
    "قهوة حسيب الذهبية"
  ],
  [
    "food-002",
    "رز محمود طويل"
  ],
  [
    "food-003",
    "رز سيدي هشام قصير"
  ],
  [
    "food-004",
    "شعيرية"
  ],
  [
    "food-005",
    "أرضي شوكي كبير"
  ],
  [
    "food-006",
    "أرضي شوكي صغير"
  ],
  [
    "food-007",
    "مخلل خيار كبير"
  ],
  [
    "food-008",
    "مخلل خيار صغير"
  ],
  [
    "food-009",
    "ورق عنب"
  ],
  [
    "food-010",
    "ورق عنب مفرغ من الهواء"
  ],
  [
    "food-011",
    "بديل الليمون"
  ],
  [
    "food-012",
    "مربى التوت الشامي"
  ],
  [
    "food-013",
    "مربى الباذنجان"
  ],
  [
    "food-014",
    "مربى اليقطين"
  ],
  [
    "food-015",
    "مربى المانغو"
  ],
  [
    "food-016",
    "مربى التين"
  ],
  [
    "food-017",
    "مربى المشمش"
  ],
  [
    "food-018",
    "دبس رمان"
  ],
  [
    "food-019",
    "دبس رمان 4,8kg"
  ],
  [
    "food-020",
    "مركز توت شامي"
  ],
  [
    "food-021",
    "حمض حصرم"
  ],
  [
    "food-022",
    "مركز شراب الورد"
  ],
  [
    "food-023",
    "ماء زهر"
  ],
  [
    "food-024",
    "ماء ورد"
  ],
  [
    "food-025",
    "برغل ناعم kg"
  ],
  [
    "food-026",
    "برغل خشن kg"
  ],
  [
    "food-027",
    "عدس مجروش kg"
  ],
  [
    "food-028",
    "فاصولياء كلاوي kg"
  ],
  [
    "food-029",
    "فول يابس سوري kg"
  ],
  [
    "food-030",
    "نشاء قمح خشن kg"
  ],
  [
    "food-031",
    "نشاء ذرة kg"
  ],
  [
    "food-032",
    "حمص حب kg"
  ],
  [
    "food-033",
    "طحينة 800g"
  ],
  [
    "food-034",
    "طحينة 5kg"
  ],
  [
    "food-035",
    "فانيليا 500g"
  ],
  [
    "food-036",
    "شاي ظروف 100"
  ],
  [
    "food-037",
    "شاي مولانا"
  ],
  [
    "food-038",
    "شاي كرزة 450g"
  ],
  [
    "food-039",
    "شاي كرزة 900g"
  ],
  [
    "food-040",
    "ماجي مكعبات"
  ],
  [
    "food-041",
    "كشكة kg"
  ],
  [
    "body-care-001",
    "ميم حناجر"
  ],
  [
    "body-care-002",
    "ميم شرائح دبل"
  ],
  [
    "body-care-003",
    "فاربن حناجر"
  ],
  [
    "body-care-004",
    "فاربن شرائح"
  ],
  [
    "body-care-005",
    "ميليا"
  ],
  [
    "body-care-006",
    "كريم الشبة (شهد العسل)"
  ],
  [
    "body-care-007",
    "كحلة عربية"
  ],
  [
    "body-care-008",
    "حنة شعر أسود"
  ],
  [
    "body-care-009",
    "حنة شعر بني"
  ],
  [
    "body-care-010",
    "حنة شعر كستنائي"
  ],
  [
    "body-care-011",
    "صابون غار الملكة"
  ],
  [
    "body-care-012",
    "صابون زيت الزيتون"
  ],
  [
    "body-care-013",
    "بوكس صابون مشكل"
  ],
  [
    "body-care-014",
    "ليف طبيعي"
  ],
  [
    "body-care-015",
    "ليف كف"
  ],
  [
    "body-care-016",
    "ليف طويل"
  ],
  [
    "body-care-017",
    "كيس حمام"
  ],
  [
    "body-care-018",
    "أبو الفاس"
  ],
  [
    "body-care-019",
    "حجر حمام"
  ],
  [
    "nuts-001",
    "لوز ني"
  ],
  [
    "nuts-002",
    "كاجو ني"
  ],
  [
    "nuts-003",
    "جوز"
  ],
  [
    "nuts-004",
    "مكسرات مشكلة مالح"
  ],
  [
    "nuts-005",
    "مكسرات مشكلة مدخن"
  ],
  [
    "nuts-006",
    "مكسرات مشكلة حامض"
  ],
  [
    "nuts-007",
    "مكسرات مشكلة جبنة"
  ],
  [
    "nuts-008",
    "كسرات مشكلة حد"
  ],
  [
    "nuts-009",
    "مكسرات صينية"
  ],
  [
    "nuts-010",
    "بزر أبيض قرع"
  ],
  [
    "nuts-011",
    "بزر أبيض كوسا"
  ],
  [
    "nuts-012",
    "بزر أسود"
  ],
  [
    "nuts-013",
    "بزر أحمر"
  ],
  [
    "nuts-014",
    "بزر أصفر"
  ]
].map(([id, name]) => ({ id, name }));

function customProducts() {
  return JSON.parse(localStorage.getItem("jleilatiCustomProducts") || "[]").map((product) => ({
    id: product.id,
    name: product.name?.en || product.name?.ar || product.name,
    category: product.category,
    variants: product.variants || [],
    hidden: false,
  }));
}

function productNameOverrides() {
  return JSON.parse(localStorage.getItem("jleilatiProductNames") || "{}");
}

function productDescriptionOverrides() {
  return JSON.parse(localStorage.getItem("jleilatiProductDescriptions") || "{}");
}

function hiddenProducts() {
  try {
    return new Set(JSON.parse(localStorage.getItem("jleilatiHiddenProducts") || "[]"));
  } catch (error) {
    return new Set();
  }
}

function saveHiddenProducts(next) {
  localStorage.setItem("jleilatiHiddenProducts", JSON.stringify([...next]));
}

function hasArabicText(value) {
  return /[\u0600-\u06ff]/.test(String(value || ""));
}

function categoryForProduct(product) {
  if (product.category) return product.category;
  return categoryMeta.find((category) => product.id.startsWith(`${category.prefix}-`))?.id || "spices";
}

function categoryLabel(categoryId) {
  return categoryMeta.find((category) => category.id === categoryId)?.label || categoryId;
}

function allProducts() {
  const overrides = productNameOverrides();
  const hidden = hiddenProducts();
  return [...products, ...customProducts()].map((product) => ({
    ...product,
    category: categoryForProduct(product),
    name: overrides[product.id]?.ar || overrides[product.id]?.en || overrides[product.id] || product.name,
    hidden: hidden.has(product.id) || Boolean(product.hidden),
  }));
}

const defaultInventory = Object.fromEntries(allProducts().map((product) => [product.id, 10000]));

function orders() {
  return JSON.parse(localStorage.getItem("jleilatiOrders") || "[]");
}

function formatOrderDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : dateTime.format(date);
}

function statusLabel(status) {
  if (status === "sent") return "Sent";
  if (status === "pending_payment") return "Pending payment";
  return "In progress";
}

function paymentLabel(order) {
  const status = order.payment?.status || "";
  if (status === "paid") return "Paid";
  if (status === "redirected_to_stripe") return "Stripe started";
  if (status === "ready_for_checkout") return "Ready";
  return status || "-";
}

function inventory() {
  return { ...Object.fromEntries(allProducts().map((product) => [product.id, 10000])), ...JSON.parse(localStorage.getItem("jleilatiInventory") || "{}") };
}

function saveInventory(next) {
  localStorage.setItem("jleilatiInventory", JSON.stringify(next));
}

function soldByProduct() {
  return orders().reduce((sold, order) => {
    order.lines.forEach((line) => {
      sold[line.productId] = (sold[line.productId] || 0) + line.grams;
    });
    return sold;
  }, {});
}

function renderOrders() {
  const list = document.querySelector("#ordersList");
  const current = orders();
  if (!current.length) {
    list.innerHTML = '<div class="notice"><p>No orders yet. New paid orders will appear here after checkout.</p></div>';
    return;
  }
  list.innerHTML = `
    <div class="admin-table-wrap">
      <table class="admin-table excel-table orders-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Products</th>
            <th>Payment</th>
            <th>Shipping</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${current
            .map(
              (order) => `
                <tr>
                  <td class="strong-cell">#${order.id}</td>
                  <td>${formatOrderDate(order.createdAt)}</td>
                  <td>${[order.customer.firstName, order.customer.secondName].filter(Boolean).join(" ") || "-"}</td>
                  <td>${order.customer.email || "-"}</td>
                  <td>${order.customer.phone || "-"}</td>
                  <td class="wide-cell">${order.customer.address || "-"}</td>
                  <td class="wide-cell">${(order.lines || []).map((line) => `${line.productName} · ${line.weight} × ${line.quantity || 1}`).join("<br />") || "-"}</td>
                  <td>${paymentLabel(order)}</td>
                  <td>${order.shippingWorkflow?.labelStatus === "created" ? "Label created" : "Ready for label"}</td>
                  <td class="strong-cell">${money.format(order.totals?.total || 0)}</td>
                  <td><span class="status-pill ${order.status === "sent" ? "sent" : ""}">${statusLabel(order.status)}</span></td>
                  <td><button type="button" data-sent="${order.id}" ${order.status === "sent" ? "disabled" : ""}>Mark sent</button></td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  list.querySelectorAll("[data-sent]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = orders().map((order) => (String(order.id) === String(button.dataset.sent) ? { ...order, status: "sent" } : order));
      localStorage.setItem("jleilatiOrders", JSON.stringify(next));
      render();
    });
  });
}

function renderStock() {
  const list = document.querySelector("#stockList");
  const stock = inventory();
  const sold = soldByProduct();
  const grouped = categoryMeta.map((category) => ({
    ...category,
    products: allProducts().filter((product) => product.category === category.id),
  }));
  list.innerHTML = grouped
    .map(
      (category) => `
        <details class="category-stock">
          <summary>
            <span>${category.label}</span>
            <small>${category.products.length} products</small>
          </summary>
          <div class="admin-table-wrap">
            <table class="admin-table inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Visible</th>
                  <th>Available</th>
                  <th>Sold</th>
                  <th>Start</th>
                  <th>Adjust grams</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${category.products
                  .map((product) => {
                    const start = stock[product.id] || 0;
                    const used = sold[product.id] || 0;
                    const remaining = Math.max(0, start - used);
                    const low = remaining <= 1000;
                    return `
                      <tr class="${low ? "low-row" : ""}">
                        <td><strong>${product.name}</strong></td>
                        <td>${product.hidden ? "Hidden" : "Published"}</td>
                        <td>${remaining} g</td>
                        <td>${used} g</td>
                        <td>${start} g</td>
                        <td><input type="number" min="100" step="100" value="1000" aria-label="grams to adjust for ${product.name}" /></td>
                        <td class="stock-actions">
                          <button type="button" data-add="${product.id}">Add qty</button>
                          <button type="button" data-remove="${product.id}">Reduce</button>
                          <button type="button" data-set="${product.id}">Set</button>
                          <button type="button" data-edit-product="${product.id}">Edit</button>
                          <button type="button" data-toggle-product="${product.id}">${product.hidden ? "Publish" : "Hide"}</button>
                        </td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
          <div class="category-tools">
            <button type="button" data-add-category="${category.id}">Create new product under ${category.label}</button>
          </div>
        </details>
      `
    )
    .join("");

  list.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = inventory();
      const value = Number(button.closest("tr").querySelector("input").value || 0);
      next[button.dataset.add] = (next[button.dataset.add] || 0) + value;
      saveInventory(next);
      render();
    });
  });
  list.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = inventory();
      const value = Number(button.closest("tr").querySelector("input").value || 0);
      next[button.dataset.remove] = Math.max(0, (next[button.dataset.remove] || 0) - value);
      saveInventory(next);
      render();
    });
  });
  list.querySelectorAll("[data-set]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = inventory();
      const value = Number(button.closest("tr").querySelector("input").value || 0);
      next[button.dataset.set] = Math.max(0, value);
      saveInventory(next);
      render();
    });
  });
  list.querySelectorAll("[data-add-category]").forEach((button) => {
    button.addEventListener("click", () => {
      const form = document.querySelector("#productForm");
      document.querySelector("#addProductPanel").classList.remove("hidden");
      document.querySelector("#editProductPanel").classList.add("hidden");
      form.elements.category.value = button.dataset.addCategory;
      document.querySelector("#addProductPanel").scrollIntoView({ behavior: "smooth", block: "start" });
      form.elements.name.focus();
    });
  });
  list.querySelectorAll("[data-edit-product]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.editProduct;
      document.querySelector("#editProductPanel").classList.remove("hidden");
      document.querySelector("#addProductPanel").classList.add("hidden");
      document.querySelector("#nameProductSelect").value = productId;
      document.querySelector("#descriptionProductSelect").value = productId;
      document.querySelector("#imageProductSelect").value = productId;
      document.querySelector("#editProductPanel").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  list.querySelectorAll("[data-toggle-product]").forEach((button) => {
    button.addEventListener("click", () => {
      const hidden = hiddenProducts();
      const productId = button.dataset.toggleProduct;
      if (hidden.has(productId)) hidden.delete(productId);
      else hidden.add(productId);
      saveHiddenProducts(hidden);
      render();
    });
  });
}

function renderNotifications() {
  const area = document.querySelector("#notifications");
  const stock = inventory();
  const sold = soldByProduct();
  const newOrders = orders().filter((order) => order.status !== "sent").length;
  const notices = allProducts()
    .map((product) => {
      const remaining = Math.max(0, (stock[product.id] || 0) - (sold[product.id] || 0));
      if (remaining === 0) return `<div class="notice"><strong>${product.name} is out of stock.</strong><p>Email notification should go to saeedjleilati@gmail.com.</p></div>`;
      if (remaining <= 1000) return `<div class="notice"><strong>${product.name} is low.</strong><p>${remaining} g remaining. Consider adding stock soon.</p></div>`;
      return "";
    })
    .filter(Boolean);
  area.innerHTML = notices.join("") || '<div class="notice"><p>No urgent stock notifications.</p></div>';
  document.querySelector("#noticeCount").textContent = notices.length + newOrders;
  document.querySelector("#lowStockCount").textContent = notices.length;
}

function renderStats() {
  const current = orders();
  const total = current.reduce((sum, order) => sum + order.totals.total, 0);
  document.querySelector("#ordersCount").textContent = current.length;
  document.querySelector("#salesTotal").textContent = money.format(total);
}

function renderCustomers() {
  const customers = customerSummaries();
  const area = document.querySelector("#customersList");
  if (!customers.length) {
    area.innerHTML = '<div class="notice"><p>No customers yet.</p></div>';
    return;
  }
  area.innerHTML = `
    <div class="admin-table-wrap">
      <table class="admin-table excel-table customers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Orders</th>
            <th>Total purchase</th>
            <th>Last order</th>
            <th>Last date</th>
            <th>Last status</th>
          </tr>
        </thead>
        <tbody>
          ${customers
            .map(
              (customer) => `
                <tr>
                  <td class="strong-cell">${customer.name || "-"}</td>
                  <td>${customer.email || "-"}</td>
                  <td>${customer.phone || "-"}</td>
                  <td class="wide-cell">${customer.address || "-"}</td>
                  <td>${customer.orderCount}</td>
                  <td class="strong-cell">${money.format(customer.total)}</td>
                  <td>#${customer.lastOrderId}</td>
                  <td>${formatOrderDate(customer.lastOrderDate)}</td>
                  <td>${statusLabel(customer.lastStatus)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function customerSummaries() {
  const map = new Map();
  orders().forEach((order) => {
    const email = String(order.customer.email || "").trim().toLowerCase();
    const key = email || `${order.customer.phone}-${order.customer.firstName}`;
    const existing = map.get(key) || {
      name: [order.customer.firstName, order.customer.secondName].filter(Boolean).join(" "),
      email: order.customer.email || "",
      phone: order.customer.phone || "",
      address: order.customer.address || "",
      orderCount: 0,
      total: 0,
      lastOrderId: order.id,
      lastOrderDate: order.createdAt || "",
      lastStatus: order.status || "in_progress",
      products: [],
    };
    existing.orderCount += 1;
    existing.total += Number(order.totals?.total || 0);
    existing.lastOrderId = order.id;
    existing.lastOrderDate = order.createdAt || existing.lastOrderDate;
    existing.lastStatus = order.status || "in_progress";
    existing.products.push(...(order.lines || []).map((line) => `${line.productName} ${line.weight || ""}`.trim()));
    map.set(key, existing);
  });
  return [...map.values()];
}

function downloadCustomers() {
  const rows = [["Name", "Email", "Phone", "Address", "Orders", "Total purchase", "Last order", "Last date", "Last status", "Products purchased"]];
  customerSummaries().forEach((customer) => {
    rows.push([
      customer.name,
      customer.email,
      customer.phone,
      customer.address,
      customer.orderCount,
      customer.total.toFixed(2),
      customer.lastOrderId,
      formatOrderDate(customer.lastOrderDate),
      customer.lastStatus,
      [...new Set(customer.products)].join("; "),
    ]);
  });
  const csv = rows.map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "jleilati-customers.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function togglePanelBody(kind, bodySelector, button) {
  collapsedPanels[kind] = !collapsedPanels[kind];
  const body = document.querySelector(bodySelector);
  if (!body) return;
  body.classList.toggle("hidden", collapsedPanels[kind]);
  button.textContent = collapsedPanels[kind] ? "Show list" : "Hide list";
}

function saveProduct(product) {
  const current = JSON.parse(localStorage.getItem("jleilatiCustomProducts") || "[]");
  localStorage.setItem("jleilatiCustomProducts", JSON.stringify([product, ...current]));
  const nextInventory = inventory();
  nextInventory[product.id] = product.startingStock;
  saveInventory(nextInventory);
}

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve("assets/spice-product.png");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function fileToRequiredDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Please choose an image."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

function renderImageProductOptions() {
  const select = document.querySelector("#imageProductSelect");
  if (!select) return;
  select.innerHTML = allProducts()
    .map((product) => `<option value="${product.id}">${product.name}</option>`)
    .join("");
}

function renderNameProductOptions() {
  const select = document.querySelector("#nameProductSelect");
  if (!select) return;
  select.innerHTML = allProducts()
    .map((product) => `<option value="${product.id}">${product.name}</option>`)
    .join("");
}

function renderDescriptionProductOptions() {
  const select = document.querySelector("#descriptionProductSelect");
  if (!select) return;
  select.innerHTML = allProducts()
    .map((product) => `<option value="${product.id}">${product.name}</option>`)
    .join("");
}

function updateProductName(event) {
  event.preventDefault();
  const form = event.target;
  const productId = form.elements.productId.value;
  const name = form.elements.name.value.trim();
  if (!name) return;
  const current = productNameOverrides();
  localStorage.setItem(
    "jleilatiProductNames",
    JSON.stringify({
      ...current,
      [productId]: hasArabicText(name) ? { ...(current[productId] || {}), ar: name } : { ar: name, de: name, en: name, fr: name },
    })
  );
  form.reset();
  document.querySelector("#nameUpdateNotice").textContent = "Saved.";
  render();
}

function updateProductDescription(event) {
  event.preventDefault();
  const form = event.target;
  const productId = form.elements.productId.value;
  const description = form.elements.description.value.trim();
  if (!description) return;
  const current = productDescriptionOverrides();
  localStorage.setItem(
    "jleilatiProductDescriptions",
    JSON.stringify({
      ...current,
      [productId]: { ar: description, de: description, en: description, fr: description },
    })
  );
  form.reset();
  document.querySelector("#descriptionUpdateNotice").textContent = "Saved.";
  render();
}

async function updateProductImage(event) {
  event.preventDefault();
  const form = event.target;
  const productId = form.elements.productId.value;
  const image = await fileToRequiredDataUrl(form.elements.photo.files[0]);
  const current = JSON.parse(localStorage.getItem("jleilatiProductImages") || "{}");
  localStorage.setItem("jleilatiProductImages", JSON.stringify({ ...current, [productId]: image }));
  form.reset();
  renderImageProductOptions();
  document.querySelector("#imageUpdateNotice").textContent = "Saved.";
}

function addVariantRow(values = {}) {
  const rows = document.querySelector("#variantRows");
  const row = document.createElement("div");
  row.className = "variant-row";
  row.innerHTML = `
    <label>Label<input name="variantLabel" required value="${values.label || ""}" placeholder="100 g" /></label>
    <label>Grams<input name="variantGrams" required type="number" min="1" step="1" value="${values.grams || ""}" placeholder="100" /></label>
    <label>Price €<input name="variantPrice" required type="number" min="0" step="0.01" value="${values.price || ""}" placeholder="3.00" /></label>
    <label>Qty<input name="variantStock" required type="number" min="0" step="1" value="${values.stock ?? ""}" placeholder="100" /></label>
    <button type="button" data-remove-variant>Remove</button>
  `;
  row.querySelector("[data-remove-variant]").addEventListener("click", () => {
    if (rows.querySelectorAll(".variant-row").length > 1) row.remove();
  });
  rows.appendChild(row);
}

function resetVariantRows() {
  const rows = document.querySelector("#variantRows");
  rows.innerHTML = "";
  addVariantRow({ label: "100 g", grams: 100, price: "", stock: 100 });
  addVariantRow({ label: "200 g", grams: 200, price: "", stock: 50 });
}

function productVariantsFromForm() {
  return [...document.querySelectorAll("#variantRows .variant-row")]
    .map((row) => {
      const label = row.querySelector('[name="variantLabel"]').value.trim();
      const grams = Number(row.querySelector('[name="variantGrams"]').value || 0);
      const price = Number(row.querySelector('[name="variantPrice"]').value || 0);
      const stock = Number(row.querySelector('[name="variantStock"]').value || 0);
      return {
        id: `${grams}g-${Math.random().toString(36).slice(2, 7)}`,
        label,
        grams,
        price,
        stock,
      };
    })
    .filter((variant) => variant.label && variant.grams > 0 && variant.price >= 0 && variant.stock >= 0);
}

async function addProduct(event) {
  event.preventDefault();
  const form = event.target;
  const notice = document.querySelector("#productCreateNotice");
  if (notice) notice.textContent = "";
  const name = form.elements.name.value.trim();
  const description = form.elements.desc.value.trim() || "Product added from the admin dashboard.";
  const variants = productVariantsFromForm();
  if (!variants.length) {
    alert("Add at least one selling unit before creating the product.");
    return;
  }
  const id = `custom-${Date.now()}`;
  const image = await fileToDataUrl(form.elements.photo.files[0]);
  const startingStock = variants.reduce((sum, variant) => sum + variant.grams * variant.stock, 0);
  const product = {
    id,
    category: form.elements.category.value,
    color: "#9f5528",
    featured: 200 + Date.now(),
    image,
    startingStock,
    hidden: false,
    name: hasArabicText(name) ? { ar: name } : { ar: name, de: name, en: name, fr: name },
    desc: {
      ar: description,
      de: description,
      en: description,
      fr: description,
    },
    variants,
  };
  saveProduct(product);
  if (!form.elements.published.checked) {
    const hidden = hiddenProducts();
    hidden.add(product.id);
    saveHiddenProducts(hidden);
  }
  form.reset();
  resetVariantRows();
  if (notice) notice.textContent = `Created ${name}.`;
  render();
}

function render() {
  renderStats();
  renderOrders();
  renderStock();
  renderNotifications();
  renderCustomers();
  renderNameProductOptions();
  renderDescriptionProductOptions();
  renderImageProductOptions();
}

document.querySelector("#notificationShortcut").addEventListener("click", () => {
  document.querySelector("#notificationsPanel").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#notificationShortcut").addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  document.querySelector("#notificationsPanel").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#downloadCustomers").addEventListener("click", downloadCustomers);
document.querySelector("#toggleOrdersList").addEventListener("click", (event) => togglePanelBody("orders", "#ordersPanelBody", event.currentTarget));
document.querySelector("#toggleCustomersList").addEventListener("click", (event) => togglePanelBody("customers", "#customersPanelBody", event.currentTarget));
document.querySelector("#addVariantRow").addEventListener("click", () => addVariantRow());
document.querySelector("#productForm").addEventListener("submit", addProduct);
document.querySelector("#productForm").addEventListener(
  "invalid",
  () => {
    const notice = document.querySelector("#productCreateNotice");
    if (notice) notice.textContent = "Please fill product name, category, and every selling unit label, grams, price, and qty.";
  },
  true
);
document.querySelector("#nameForm").addEventListener("submit", updateProductName);
document.querySelector("#descriptionForm").addEventListener("submit", updateProductDescription);
document.querySelector("#imageForm").addEventListener("submit", updateProductImage);
resetVariantRows();
render();
