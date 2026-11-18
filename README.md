# bredly 🏅

Trang huy hiệu kiểu Credly của Bubu Húi, do Vk Hơm cấp.

## Chạy thử trên máy

```bash
npm install
npm run dev
```

## Cấu trúc

```
data.json                 dữ liệu huy hiệu (app đọc/ghi trực tiếp file này)
src/
  App.jsx                 ghép các màn hình lại với nhau
  config.js               thông tin repo
  constants/tiers.js      4 cấp độ huy hiệu và màu sắc
  hooks/                  state của app (dữ liệu, đăng nhập, điều hướng, thông báo)
  lib/                    hàm tiện ích (GitHub, ngày tháng, ảnh, huy hiệu)
  components/             các phần giao diện
.github/workflows/        tự build và deploy lên GitHub Pages khi push
```

Deploy: mỗi lần push lên `main`, GitHub Actions tự build và đăng lên GitHub Pages.
