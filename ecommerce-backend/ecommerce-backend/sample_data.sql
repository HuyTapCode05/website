-- ==============================
-- SAMPLE DATA FOR FASHION STORE
-- ==============================
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Clear old data first
DELETE FROM product_variants WHERE product_id BETWEEN 1 AND 14;
DELETE FROM products WHERE id BETWEEN 1 AND 14;
DELETE FROM categories WHERE id BETWEEN 1 AND 6;
INSERT INTO categories (id, name, slug, description, active, parent_id) VALUES
(1, 'Áo Thun', 'ao-thun', 'Áo thun nam nữ các loại', 1, NULL),
(2, 'Áo Sơ Mi', 'ao-so-mi', 'Áo sơ mi công sở và casual', 1, NULL),
(3, 'Quần Jean', 'quan-jean', 'Quần jean nam nữ thời trang', 1, NULL),
(4, 'Quần Kaki', 'quan-kaki', 'Quần kaki phong cách', 1, NULL),
(5, 'Giày Dép', 'giay-dep', 'Giày dép thời trang', 1, NULL),
(6, 'Phụ Kiện', 'phu-kien', 'Phụ kiện thời trang', 1, NULL)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Products (using existing image files in uploads/products/)
INSERT INTO products (id, name, slug, description, price, sale_price, status, image_url, category_id, stock, created_at, updated_at) VALUES
(1, 'Giày Thể Thao Nam TMTT26 Hiện Đại', 'giay-the-thao-nam-tmtt26', 'Giày thể thao nam thiết kế hiện đại, đế cao su chống trượt, phù hợp chạy bộ và đi chơi.', 890000, 690000, 'ACTIVE', '/uploads/products/1763306832932_giay-the-thao-nam-tmtt26-hien-dai.jpg', 5, 50, NOW(), NOW()),

(2, 'Áo Lifestyle Unisex Phong Cách', 'ao-lifestyle-unisex', 'Áo lifestyle unisex chất liệu cotton 100%, thoáng mát, phù hợp mọi dịp.', 350000, NULL, 'ACTIVE', '/uploads/products/1763306948450_ao_lifestyle-07_4fce7794e6ab42dcb6a8a8f614d4edc4_large.jpg', 1, 80, NOW(), NOW()),

(3, 'Áo Khoác Nữ Thời Trang Hàn Quốc', 'ao-khoac-nu-han-quoc', 'Áo khoác nữ phong cách Hàn Quốc, chất liệu dày dặn giữ ấm tốt.', 750000, 599000, 'ACTIVE', '/uploads/products/1763307007256_811458_nv_f_162_master.jpg', 2, 35, NOW(), NOW()),

(4, 'Áo Thun Nam Cổ Tròn Basic', 'ao-thun-nam-co-tron-basic', 'Áo thun nam cổ tròn basic, chất cotton mềm mại, form regular fit thoải mái.', 250000, 199000, 'ACTIVE', '/uploads/products/1763307094072_8bpu7_mau-ao-thun-nam-dep-3_719fd81d021a4da8954ab2d73a9ecc7b.jpg', 1, 120, NOW(), NOW()),

(5, 'Quần Jean Nam Slim Fit Cao Cấp', 'quan-jean-nam-slim-fit', 'Quần jean nam slim fit, chất vải denim co giãn nhẹ, tôn dáng.', 650000, 520000, 'ACTIVE', '/uploads/products/1763307160466_0b5e877ceb05076da71319b8f02c0f94.jpg_720x720q80.jpg', 3, 60, NOW(), NOW()),

(6, 'Áo Polo Nam Premium', 'ao-polo-nam-premium', 'Áo polo nam chất liệu cotton pique cao cấp, form chuẩn, nhiều màu sắc lựa chọn.', 420000, NULL, 'ACTIVE', '/uploads/products/1763316047153_z7231373918201_cc77b299c747594f2c8bb48f8218385f.jpg', 1, 90, NOW(), NOW()),

(7, 'Áo Sơ Mi Nữ Công Sở Thanh Lịch', 'ao-so-mi-nu-cong-so', 'Áo sơ mi nữ thiết kế thanh lịch, phù hợp đi làm và dự tiệc.', 380000, 299000, 'ACTIVE', '/uploads/products/1763316393529_z7231376035530_d5726f079261596b7a273da8681b5c40.jpg', 2, 55, NOW(), NOW()),

(8, 'Túi Xách Nữ Da Cao Cấp', 'tui-xach-nu-da-cao-cap', 'Túi xách nữ chất liệu da PU cao cấp, nhiều ngăn tiện lợi, thiết kế sang trọng.', 1200000, 899000, 'ACTIVE', '/uploads/products/1763318648127_z7231386065821_ba9dd670e476374d76476911cefbad34.jpg', 6, 25, NOW(), NOW()),

(9, 'Quần Kaki Nam Ống Đứng', 'quan-kaki-nam-ong-dung', 'Quần kaki nam ống đứng, chất vải mềm mại không nhăn, phù hợp đi làm.', 450000, NULL, 'ACTIVE', '/uploads/products/1763318817678_z7231386976966_78ba4242ee712d0004aad15353d35fad.jpg', 4, 70, NOW(), NOW()),

(10, 'Áo Hoodie Unisex Oversize', 'ao-hoodie-unisex-oversize', 'Áo hoodie unisex form oversize, chất nỉ bông dày dặn giữ ấm tốt.', 550000, 449000, 'ACTIVE', '/uploads/products/1763319005098_z7231387704401_460187ad2c9028195874a480477adec2.jpg', 1, 45, NOW(), NOW()),

(11, 'Giày Sneaker Nữ Trắng Classic', 'giay-sneaker-nu-trang', 'Giày sneaker nữ màu trắng classic, đế cao 3cm, dễ phối đồ.', 780000, NULL, 'ACTIVE', '/uploads/products/1763319169169_z7231388294246_861168b356b2bd4acc85d7cb73aa0e5f.jpg', 5, 40, NOW(), NOW()),

(12, 'Mũ Lưỡi Trai Thời Trang', 'mu-luoi-trai-thoi-trang', 'Mũ lưỡi trai phong cách streetwear, chất liệu vải canvas bền đẹp.', 180000, 149000, 'ACTIVE', '/uploads/products/1763319281219_z7231388632612_dea4463394f40e878f4608bad7ab3b5c.jpg', 6, 100, NOW(), NOW()),

(13, 'Áo Khoác Bomber Nam Cá Tính', 'ao-khoac-bomber-nam', 'Áo khoác bomber nam phong cách cá tính, chất liệu dù chống nước nhẹ.', 680000, NULL, 'ACTIVE', '/uploads/products/1763319413139_z7231388918210_31cad6047b1c02faec351208f9a2ed46.jpg', 2, 30, NOW(), NOW()),

(14, 'Áo Polo Classic Fit', 'ao-polo-classic-fit', 'Áo polo classic fit cao cấp, thêu logo tinh tế, chất liệu cotton mát.', 480000, 380000, 'ACTIVE', '/uploads/products/1770569186127_1763316047153_z7231373918201_cc77b299c747594f2c8bb48f8218385f.jpg', 1, 65, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), sale_price=VALUES(sale_price), image_url=VALUES(image_url), category_id=VALUES(category_id), stock=VALUES(stock);

-- Product Variants
INSERT INTO product_variants (id, sku, color, size, stock, price, sale_price, product_id) VALUES
(1, 'GIAY-TMTT26-41-DEN', 'Đen', '41', 15, 890000, 690000, 1),
(2, 'GIAY-TMTT26-42-DEN', 'Đen', '42', 20, 890000, 690000, 1),
(3, 'GIAY-TMTT26-43-TRANG', 'Trắng', '43', 15, 890000, 690000, 1),
(4, 'AO-LIFE-M-DEN', 'Đen', 'M', 25, 350000, NULL, 2),
(5, 'AO-LIFE-L-TRANG', 'Trắng', 'L', 30, 350000, NULL, 2),
(6, 'AO-LIFE-XL-XAM', 'Xám', 'XL', 25, 350000, NULL, 2),
(7, 'AK-NU-M-BE', 'Be', 'M', 12, 750000, 599000, 3),
(8, 'AK-NU-L-DEN', 'Đen', 'L', 12, 750000, 599000, 3),
(9, 'AK-NU-S-TRANG', 'Trắng', 'S', 11, 750000, 599000, 3),
(10, 'AT-NAM-M-DEN', 'Đen', 'M', 30, 250000, 199000, 4),
(11, 'AT-NAM-L-TRANG', 'Trắng', 'L', 30, 250000, 199000, 4),
(12, 'AT-NAM-XL-XANH', 'Xanh Navy', 'XL', 30, 250000, 199000, 4),
(13, 'AT-NAM-S-DO', 'Đỏ', 'S', 30, 250000, 199000, 4),
(14, 'QJ-NAM-30-XANH', 'Xanh Đậm', '30', 20, 650000, 520000, 5),
(15, 'QJ-NAM-32-DEN', 'Đen', '32', 20, 650000, 520000, 5),
(16, 'QJ-NAM-34-XANH', 'Xanh Nhạt', '34', 20, 650000, 520000, 5),
(17, 'AP-NAM-M-DEN', 'Đen', 'M', 30, 420000, NULL, 6),
(18, 'AP-NAM-L-TRANG', 'Trắng', 'L', 30, 420000, NULL, 6),
(19, 'AP-NAM-XL-XANH', 'Xanh Navy', 'XL', 30, 420000, NULL, 6),
(20, 'SM-NU-S-TRANG', 'Trắng', 'S', 20, 380000, 299000, 7),
(21, 'SM-NU-M-HONG', 'Hồng', 'M', 20, 380000, 299000, 7),
(22, 'SM-NU-L-XANH', 'Xanh', 'L', 15, 380000, 299000, 7),
(23, 'TX-NU-DEN', 'Đen', 'ONE SIZE', 10, 1200000, 899000, 8),
(24, 'TX-NU-NAU', 'Nâu', 'ONE SIZE', 8, 1200000, 899000, 8),
(25, 'TX-NU-KEM', 'Kem', 'ONE SIZE', 7, 1200000, 899000, 8),
(26, 'QK-NAM-30-BE', 'Be', '30', 25, 450000, NULL, 9),
(27, 'QK-NAM-32-DEN', 'Đen', '32', 25, 450000, NULL, 9),
(28, 'QK-NAM-34-XAM', 'Xám', '34', 20, 450000, NULL, 9),
(29, 'HD-UNI-M-DEN', 'Đen', 'M', 15, 550000, 449000, 10),
(30, 'HD-UNI-L-XAM', 'Xám', 'L', 15, 550000, 449000, 10),
(31, 'HD-UNI-XL-TRANG', 'Trắng', 'XL', 15, 550000, 449000, 10),
(32, 'GS-NU-36-TRANG', 'Trắng', '36', 15, 780000, NULL, 11),
(33, 'GS-NU-37-TRANG', 'Trắng', '37', 15, 780000, NULL, 11),
(34, 'GS-NU-38-HONG', 'Hồng', '38', 10, 780000, NULL, 11),
(35, 'MU-UNI-DEN', 'Đen', 'ONE SIZE', 35, 180000, 149000, 12),
(36, 'MU-UNI-TRANG', 'Trắng', 'ONE SIZE', 35, 180000, 149000, 12),
(37, 'MU-UNI-XANH', 'Xanh Navy', 'ONE SIZE', 30, 180000, 149000, 12),
(38, 'BM-NAM-M-DEN', 'Đen', 'M', 10, 680000, NULL, 13),
(39, 'BM-NAM-L-XANH', 'Xanh Rêu', 'L', 10, 680000, NULL, 13),
(40, 'BM-NAM-XL-XAM', 'Xám', 'XL', 10, 680000, NULL, 13),
(41, 'AP2-NAM-M-DO', 'Đỏ', 'M', 20, 480000, 380000, 14),
(42, 'AP2-NAM-L-XANH', 'Xanh Navy', 'L', 25, 480000, 380000, 14),
(43, 'AP2-NAM-XL-DEN', 'Đen', 'XL', 20, 480000, 380000, 14)
ON DUPLICATE KEY UPDATE sku=VALUES(sku);
