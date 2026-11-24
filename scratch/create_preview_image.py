import os
from PIL import Image, ImageDraw, ImageFont

# Canvas dimensions
W, H = 1350, 150
bg_color = (11, 15, 25) # Dark theme background
img = Image.new('RGB', (W, H), bg_color)
draw = ImageDraw.Draw(img)

# Try loading standard windows font
try:
    font_bold = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 15)
    font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 15)
    font_date = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 16)
    font_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 12)
except Exception:
    font_bold = ImageFont.load_default()
    font_title = font_bold
    font_date = font_bold
    font_sm = font_bold

# Draw rounded rectangle helper
def round_rect(xy, rad, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=rad, fill=fill, outline=outline, width=width)

# 1. Cụm bên trái: DANH SÁCH PHẦN MỀM + Tất cả khách hàng
y_top = 50
round_rect([(20, y_top), (220, y_top + 40)], rad=8, fill=(236, 72, 153))
draw.text((32, y_top + 10), "DANH SÁCH PHẦN MỀM", font=font_title, fill=(255, 255, 255))

# Ô Tất cả khách hàng
x_cust = 230
round_rect([(x_cust, y_top), (x_cust + 175, y_top + 40)], rad=8, fill=(0, 0, 0), outline=(51, 65, 85), width=2)
draw.text((x_cust + 12, y_top + 10), "Tất cả khách hàng  ▼", font=font_bold, fill=(255, 255, 255))
# Nút x
round_rect([(x_cust + 185, y_top + 4), (x_cust + 217, y_top + 36)], rad=6, fill=(0, 0, 0), outline=(51, 65, 85), width=1)
draw.text((x_cust + 196, y_top + 8), "✕", font=font_bold, fill=(148, 163, 184))

# 3. Cụm bên phải: Ô TÌM KIẾM + BIDV + MẮT + TẠO ĐƠN MỚI
# Bắt đầu từ phải sang
x_right = W - 20
# Nút Tạo đơn mới (rộng 140)
x_btn_new = x_right - 145
round_rect([(x_btn_new, y_top), (x_right, y_top + 40)], rad=8, fill=(236, 72, 153), outline=(244, 114, 182), width=1)
draw.text((x_btn_new + 14, y_top + 10), "+  TẠO ĐƠN MỚI", font=font_title, fill=(255, 255, 255))

# Nút mắt
x_eye = x_btn_new - 48
round_rect([(x_eye, y_top + 2), (x_eye + 38, y_top + 38)], rad=8, fill=(0, 0, 0), outline=(51, 65, 85), width=1)
draw.text((x_eye + 12, y_top + 10), "👁", font=font_bold, fill=(148, 163, 184))

# Nút BIDV
x_bidv = x_eye - 48
round_rect([(x_bidv, y_top + 2), (x_bidv + 38, y_top + 38)], rad=8, fill=(5, 150, 105), outline=(16, 185, 129), width=1)
draw.text((x_bidv + 6, y_top + 10), "BIDV", font=font_sm, fill=(255, 255, 255))

# Ô Tìm kiếm (rộng 240)
x_search_right = x_bidv - 12
x_search = x_search_right - 250
round_rect([(x_search, y_top), (x_search_right, y_top + 40)], rad=9, fill=(0, 0, 0), outline=(51, 65, 85), width=2)
draw.text((x_search + 12, y_top + 10), "TÌM KIẾM", font=font_title, fill=(245, 158, 11))
draw.text((x_search + 85, y_top + 10), "🔍 Tìm khách / tên...", font=font_bold, fill=(100, 116, 139))
draw.text((x_search_right - 22, y_top + 10), "✕", font=font_bold, fill=(239, 68, 68))

# 2. CỤM CHÍNH GIỮA: Nằm CHÍNH GIỮA TUYỆT ĐỐI giữa nút ✕ của Khách hàng và Ô Tìm kiếm!
left_boundary = x_cust + 225
right_boundary = x_search
center_point = (left_boundary + right_boundary) // 2

# Khung ngày rộng 280
w_date_box = 280
x_date = center_point - (w_date_box // 2)

round_rect([(x_date, y_top), (x_date + w_date_box, y_top + 40)], rad=9, fill=(0, 0, 0), outline=(51, 65, 85), width=2)
draw.text((x_date + 12, y_top + 10), "Ngày  ▼", font=font_title, fill=(255, 255, 255))

# Nút lùi xanh
x_arr1 = x_date + 80
round_rect([(x_arr1, y_top + 6), (x_arr1 + 28, y_top + 34)], rad=6, fill=(5, 150, 105))
draw.text((x_arr1 + 10, y_top + 8), "<", font=font_title, fill=(255, 255, 255))

# Chữ ngày
draw.text((x_arr1 + 38, y_top + 10), "10/11/2026", font=font_date, fill=(255, 255, 255))

# Nút tiến xanh
x_arr2 = x_arr1 + 130
round_rect([(x_arr2, y_top + 6), (x_arr2 + 28, y_top + 34)], rad=6, fill=(5, 150, 105))
draw.text((x_arr2 + 10, y_top + 8), ">", font=font_title, fill=(255, 255, 255))

# Nút lịch xanh
x_cal = x_arr2 + 34
round_rect([(x_cal, y_top + 6), (x_cal + 28, y_top + 34)], rad=6, fill=(5, 150, 105))
draw.text((x_cal + 6, y_top + 8), "📅", font=font_sm, fill=(255, 255, 255))

# Vẽ thước đo và mũi tên trực quan phía trên
y_ruler = 20
draw.line([(left_boundary, y_ruler), (right_boundary, y_ruler)], fill=(56, 189, 248), width=2)
draw.line([(left_boundary, y_ruler - 6), (left_boundary, y_ruler + 6)], fill=(56, 189, 248), width=2)
draw.line([(right_boundary, y_ruler - 6), (right_boundary, y_ruler + 6)], fill=(56, 189, 248), width=2)
draw.line([(center_point, y_ruler - 6), (center_point, y_ruler + 25)], fill=(250, 204, 21), width=2)

text_center_guide = "◄── CÂN CHÍNH GIỮA 100% KHOẢNG TRỐNG GIỮA 2 Ô ──►"
bbox = draw.textbbox((0, 0), text_center_guide, font=font_bold)
tw = bbox[2] - bbox[0]
draw.text((center_point - tw // 2, y_ruler - 18), text_center_guide, font=font_bold, fill=(250, 204, 21))

# Lưu ảnh vào artifact directory
artifact_dir = r"C:\Users\quynhbupbehp\.gemini\antigravity\brain\e175339d-074d-4d41-bc3d-86abaacf48fe"
out_path = os.path.join(artifact_dir, "preview_sw_center.png")
img.save(out_path)
print("Saved preview image successfully to:", out_path)

