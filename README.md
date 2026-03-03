# Carousel Project

Dự án Carousel component được xây dựng bằng React, TypeScript và Vite. Component hỗ trợ tính năng kéo thả (drag), autoplay và điều hướng tự động.

## Yêu cầu hệ thống

- **Node.js**: Phiên bản 20 trở lên

## Hướng dẫn cài đặt và chạy local

### 1. Checkout branch main

```bash
git checkout main
```

### 2. Cài đặt thư viện

```bash
npm install
```

### 3. Build dự án

```bash
npm run build
```

### 4. Chạy preview

```bash
npm run preview
```

### Các lệnh khác

- **Chạy development server**: `npm run dev`

## Cấu trúc dự án

```
carousel/
├── src/
│   ├── App.tsx              # Component chính của ứng dụng
│   ├── Carousel.tsx         # Component carousel
│   ├── main.tsx             # Entry point của ứng dụng
│   └── styles/              # Thư mục chứa các file CSS
│       ├── carousel.module.css  # Styles cho carousel component
│       └── index.css        # Global styles
├── public/                  # Thư mục chứa static assets
├── index.html               # HTML template
├── package.json             # Dependencies và scripts
├── vite.config.ts           # Cấu hình Vite
├── tsconfig.json            # Cấu hình TypeScript
└── eslint.config.js         # Cấu hình ESLint
```

## Giải thích về cách triển khai tính năng kéo và vuốt (Drag & Swipe)

Sử dụng **Pointer Events** để xử lý các tương tác kéo và vuốt.

- **`onPointerDown`**: Bắt đầu quá trình kéo
  - Lưu vị trí ban đầu của con trỏ (`startX`)
  - Đặt trạng thái `isDragging = true`

- **`onPointerMove`**: Xử lý khi người dùng kéo
  - Tính toán khoảng cách di chuyển (`offset = clientX - startX`)
  - Cập nhật vị trí slide sử dụng `transform: translateX()` được tính toán dựa trên `currentIndex` và `offset`

- **`onPointerUp`**: Kết thúc quá trình kéo
  - Xác định hướng kéo (trái/phải) dựa trên dấu của `offset`
  - Gọi `nextSlide()` hoặc `prevSlide()`, tại đây sẽ tính toán vị trí kéo hiện tại kết hợp `DRAG_THRESHOLD` để chuyển slide `currentIndex`
  - Reset trạng thái kéo

## Giải thích về cách chặn click khi đang kéo

- Sử dụng ref `hasDragged` để lưu trạng thái
- Đánh dấu là drag nếu di chuyển > 5 pixels (để phân biệt với click)

```javascript
if (Math.abs(clientX - startX) > 5) {
  hasDragged.current = true;
}
```

## Giải thích về cách dừng tự động chuyển slide khi hover

- **`onMouseEnter`**: Khi con trỏ di chuyển vào khu vực của slide cập nhật ref `isHovering.current = true`, lúc này hàm xử lý chuyển trang sẽ check biến này ngay từ đầu, nếu giá trị `true` sẽ dừng lại không tiếp tục chạy logic phía sau

- **`onMouseLeave`**: Cập nhật ref `isHovering.current = false`

## Giải thích về cách triển khai infinite loop

- Lặp lại ở đầu và cuối của array: [s1] [s2] [s3] **[1] [2] [3]** [e1] [e2] [e3]
- Khi kéo array khớp biên ví dụ [s3] và [e1] sẽ tự động nhảy về [3] và [1] tương ứng
- Sử dụng state `isDragging` tắt transition để slide được cập nhật vị trí ngay lập tức
