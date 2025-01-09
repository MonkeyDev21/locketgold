// Updated Locket_ndn_fix.js
// ========= Đặt ngày tham gia là 1/1/2025 ========= //
var specificDate = "2025-01-01T00:00:00Z"; // Định dạng ISO 8601

// ========= ID Mapping ========= //
const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold'] // Đảm bảo rằng Locket Gold được sử dụng đúng cách
};

// ========= Kiểm tra và Khởi tạo ========= //
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];

// Bắt lỗi khi parsing response
try {
  var obj = JSON.parse($response.body);
} catch (e) {
  console.log("Error parsing response body:", e);
  $done({}); // Trả kết quả trống nếu lỗi xảy ra
}

// Đảm bảo các key cơ bản tồn tại
if (!obj.subscriber) obj.subscriber = {};
if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};
if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};

// ========= Tạo thông tin gói Locket Gold ========= //
var nguyendinhnghi = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2099-12-18T01:04:17Z", // Ngày hết hạn lâu dài
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: specificDate,  // Ngày tham gia
  purchase_date: specificDate,          // Ngày mua
  store: "app_store"
};

var ndn_entitlement = {
  grace_period_expires_date: null,
  purchase_date: specificDate, // Ngày tham gia
  product_identifier: "com.nguyendinhnghi.premium.yearly",
  expires_date: "2099-12-18T01:04:17Z" // Ngày hết hạn lâu dài
};

// ========= Áp dụng Mapping ========= //
const match = Object.keys(mapping).find(e => ua.includes(e));

if (match) {
  let entitlementKey = mapping[match][0] || "Locket";
  let subscriptionKey = mapping[match][1] || "com.nguyendinhnghi.premium.yearly";

  obj.subscriber.subscriptions[subscriptionKey] = nguyendinhnghi;
  obj.subscriber.entitlements[entitlementKey] = ndn_entitlement;
} else {
  // Gán mặc định nếu không có khớp
  obj.subscriber.subscriptions["com.nguyendinhnghi.premium.yearly"] = nguyendinhnghi;
  obj.subscriber.entitlements["Locket"] = ndn_entitlement;
}

// ========= Thêm thông báo và Log ========= //
obj.Attention = "Chúc mừng bạn Nguyễn Đình Nghị! Vui lòng không bán hoặc chia sẻ cho người khác!";
console.log("User-Agent:", ua);
console.log("Final Modified Response:", JSON.stringify(obj, null, 2));

// ========= Trả kết quả cuối cùng ========= //
$done({ body: JSON.stringify(obj) });