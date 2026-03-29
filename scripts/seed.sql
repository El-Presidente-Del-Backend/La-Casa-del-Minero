-- =============================================================
-- Seed script for La Casa del Minero
-- Populates categories, products, and product_specs tables
-- =============================================================

BEGIN;

-- ---------------------------------------------------------
-- 1. Categories
-- ---------------------------------------------------------
INSERT INTO categories (name, slug, label, image_url) VALUES
  ('Seguridad',    'seguridad',    'Seguridad',     '/images/categories/seguridad.jpg'),
  ('Herramientas', 'herramientas', 'Herramientas',  '/images/categories/herramientas.jpg'),
  ('Iluminacion',  'iluminacion',  'Iluminación',   '/images/categories/iluminacion.jpg'),
  ('Deteccion',    'deteccion',    'Detección',     '/images/categories/deteccion.jpg');

-- ---------------------------------------------------------
-- 2. Products
-- ---------------------------------------------------------

-- Casco de Seguridad Industrial
INSERT INTO products (name, description, long_description, price, original_price, category_id, image_url, badge, in_stock, sku) VALUES
(
  'Casco de Seguridad Industrial',
  'Casco de protección clase E con suspensión de 4 puntos. Resistente a impactos y dieléctrico.',
  'Casco de seguridad industrial diseñado para las condiciones más exigentes de la minería. Fabricado con polietileno de alta densidad, cuenta con suspensión ajustable de 4 puntos para máxima comodidad durante jornadas largas. Certificado bajo norma ANSI/ISEA Z89.1 Clase E, ofrece protección contra impactos laterales y superiores, así como aislamiento dieléctrico hasta 20,000V. Compatible con accesorios como protectores faciales, orejeras y lámparas frontales.',
  45.00,
  NULL,
  (SELECT id FROM categories WHERE name = 'Seguridad'),
  '/images/products/casco-seguridad.jpg',
  'Más vendido',
  true,
  'SEG-CAS-001'
);

-- Broca de Perforación TC
INSERT INTO products (name, description, long_description, price, original_price, category_id, image_url, badge, in_stock, sku) VALUES
(
  'Broca de Perforación TC',
  'Broca de carburo de tungsteno para perforación en roca dura. Alta durabilidad.',
  'Broca de perforación fabricada con insertos de carburo de tungsteno de grado premium, diseñada específicamente para perforación en roca dura y semi-dura. Su geometría de corte optimizada maximiza la tasa de penetración mientras minimiza el desgaste. Ideal para operaciones de voladura, exploración y extracción. Disponible en diferentes diámetros para adaptarse a diversos equipos de perforación.',
  320.00,
  380.00,
  (SELECT id FROM categories WHERE name = 'Herramientas'),
  '/images/products/broca-perforacion.jpg',
  'Oferta',
  true,
  'HER-BRO-002'
);

-- Botas de Seguridad Minera
INSERT INTO products (name, description, long_description, price, original_price, category_id, image_url, badge, in_stock, sku) VALUES
(
  'Botas de Seguridad Minera',
  'Botas con punta de acero, suela antideslizante y resistente a químicos.',
  'Botas de seguridad diseñadas para el sector minero con punta de acero que soporta impactos de hasta 200J. La suela de poliuretano bidensidad ofrece resistencia excepcional a la abrasión, aceites y químicos, además de propiedades antideslizantes en superficies mojadas. El forro interior transpirable mantiene el pie seco durante toda la jornada. Cumple normativa EN ISO 20345:2011 S3.',
  120.00,
  NULL,
  (SELECT id FROM categories WHERE name = 'Seguridad'),
  '/images/products/botas-seguridad.jpg',
  'Nuevo',
  true,
  'SEG-BOT-003'
);

-- Lámpara Minera LED
INSERT INTO products (name, description, long_description, price, original_price, category_id, image_url, badge, in_stock, sku) VALUES
(
  'Lámpara Minera LED',
  'Lámpara frontal LED con batería recargable de larga duración. 10,000 lúmenes.',
  'Lámpara minera de última generación con tecnología LED de alto rendimiento que proporciona hasta 10,000 lúmenes de iluminación. Su batería de litio recargable ofrece hasta 16 horas de autonomía en modo estándar. Certificación IP68 para resistencia total al polvo y sumersión. Diseño ligero con clip para casco y banda elástica ajustable. Incluye cargador rápido y cable USB-C.',
  85.00,
  NULL,
  (SELECT id FROM categories WHERE name = 'Iluminacion'),
  '/images/products/lampara-minera.jpg',
  NULL,
  true,
  'ILU-LAM-004'
);

-- Guantes de Trabajo Reforzados
INSERT INTO products (name, description, long_description, price, original_price, category_id, image_url, badge, in_stock, sku) VALUES
(
  'Guantes de Trabajo Reforzados',
  'Guantes con refuerzo en palma y dedos. Resistentes a abrasión y cortes.',
  'Guantes de trabajo profesionales diseñados para entornos mineros con refuerzo de doble capa en palma y dedos. Ofrecen resistencia nivel 5 contra cortes y nivel 4 contra abrasión según norma EN 388. El dorso transpirable permite ventilación mientras el cierre de velcro garantiza un ajuste seguro. Ideales para manejo de herramientas, cables y materiales abrasivos.',
  28.00,
  NULL,
  (SELECT id FROM categories WHERE name = 'Seguridad'),
  '/images/products/guantes-trabajo.jpg',
  NULL,
  true,
  'SEG-GUA-005'
);

-- Detector de Gas Portátil
INSERT INTO products (name, description, long_description, price, original_price, category_id, image_url, badge, in_stock, sku) VALUES
(
  'Detector de Gas Portátil',
  'Detector multigas con pantalla LCD. Detecta CH4, CO, O2 y H2S.',
  'Detector de gas portátil de 4 canales diseñado para ambientes mineros subterráneos. Detecta simultáneamente metano (CH4), monóxido de carbono (CO), oxígeno (O2) y sulfuro de hidrógeno (H2S). Pantalla LCD retroiluminada de alta visibilidad con indicadores gráficos en tiempo real. Alarmas sonoras (95dB), visuales (LED) y vibratorias. Certificación ATEX zona 0 para uso en atmósferas explosivas. Batería recargable con hasta 18 horas de uso continuo.',
  580.00,
  NULL,
  (SELECT id FROM categories WHERE name = 'Deteccion'),
  '/images/products/detector-gas.jpg',
  'Premium',
  true,
  'DET-GAS-006'
);

-- Pico Minero Profesional
INSERT INTO products (name, description, long_description, price, original_price, category_id, image_url, badge, in_stock, sku) VALUES
(
  'Pico Minero Profesional',
  'Pico de acero forjado con mango de madera de hickory. Peso equilibrado.',
  'Pico minero profesional fabricado en acero al carbono forjado y templado para máxima durabilidad. El mango de madera de hickory americano ofrece absorción de impactos y comodidad de agarre. Su peso equilibrado de 2.5kg permite uso prolongado sin fatiga excesiva. Cabeza de doble punta con filo de cincel en un extremo y punta en el otro para versatilidad en diferentes tipos de roca.',
  65.00,
  NULL,
  (SELECT id FROM categories WHERE name = 'Herramientas'),
  '/images/products/pico-minero.jpg',
  NULL,
  false,
  'HER-PIC-007'
);

-- Chaleco Reflectante Alta Visibilidad
INSERT INTO products (name, description, long_description, price, original_price, category_id, image_url, badge, in_stock, sku) VALUES
(
  'Chaleco Reflectante Alta Visibilidad',
  'Chaleco con bandas reflectantes 3M. Cumple normativa EN 20471 clase 2.',
  'Chaleco de alta visibilidad fabricado con tejido fluorescente de poliéster transpirable. Incorpora bandas reflectantes 3M Scotchlite de 50mm que garantizan visibilidad a 360 grados en condiciones de poca luz. Cumple estrictamente la normativa EN ISO 20471:2013 Clase 2. Cierre de velcro frontal para fácil colocación y ajuste. Múltiples bolsillos para herramientas y documentación.',
  22.00,
  NULL,
  (SELECT id FROM categories WHERE name = 'Seguridad'),
  '/images/products/chaleco-reflectante.jpg',
  NULL,
  true,
  'SEG-CHA-008'
);

-- ---------------------------------------------------------
-- 3. Product Specs
-- ---------------------------------------------------------

-- Specs for: Casco de Seguridad Industrial (SEG-CAS-001)
INSERT INTO product_specs (product_id, label, value) VALUES
  ((SELECT id FROM products WHERE sku = 'SEG-CAS-001'), 'Material', 'Polietileno de alta densidad'),
  ((SELECT id FROM products WHERE sku = 'SEG-CAS-001'), 'Norma', 'ANSI/ISEA Z89.1 Clase E'),
  ((SELECT id FROM products WHERE sku = 'SEG-CAS-001'), 'Suspensión', '4 puntos ajustable'),
  ((SELECT id FROM products WHERE sku = 'SEG-CAS-001'), 'Peso', '380g'),
  ((SELECT id FROM products WHERE sku = 'SEG-CAS-001'), 'Color', 'Amarillo');

-- Specs for: Broca de Perforación TC (HER-BRO-002)
INSERT INTO product_specs (product_id, label, value) VALUES
  ((SELECT id FROM products WHERE sku = 'HER-BRO-002'), 'Material', 'Carburo de tungsteno'),
  ((SELECT id FROM products WHERE sku = 'HER-BRO-002'), 'Diámetro', '76mm'),
  ((SELECT id FROM products WHERE sku = 'HER-BRO-002'), 'Rosca', 'R32'),
  ((SELECT id FROM products WHERE sku = 'HER-BRO-002'), 'Peso', '4.2kg'),
  ((SELECT id FROM products WHERE sku = 'HER-BRO-002'), 'Uso', 'Roca dura y semi-dura');

-- Specs for: Botas de Seguridad Minera (SEG-BOT-003)
INSERT INTO product_specs (product_id, label, value) VALUES
  ((SELECT id FROM products WHERE sku = 'SEG-BOT-003'), 'Punta', 'Acero (200J)'),
  ((SELECT id FROM products WHERE sku = 'SEG-BOT-003'), 'Suela', 'PU bidensidad antideslizante'),
  ((SELECT id FROM products WHERE sku = 'SEG-BOT-003'), 'Norma', 'EN ISO 20345:2011 S3'),
  ((SELECT id FROM products WHERE sku = 'SEG-BOT-003'), 'Tallas', '38 - 46'),
  ((SELECT id FROM products WHERE sku = 'SEG-BOT-003'), 'Material', 'Cuero flor hidrofugado');

-- Specs for: Lámpara Minera LED (ILU-LAM-004)
INSERT INTO product_specs (product_id, label, value) VALUES
  ((SELECT id FROM products WHERE sku = 'ILU-LAM-004'), 'Luminosidad', '10,000 lúmenes'),
  ((SELECT id FROM products WHERE sku = 'ILU-LAM-004'), 'Batería', 'Li-ion 6800mAh'),
  ((SELECT id FROM products WHERE sku = 'ILU-LAM-004'), 'Autonomía', 'Hasta 16 horas'),
  ((SELECT id FROM products WHERE sku = 'ILU-LAM-004'), 'Protección', 'IP68'),
  ((SELECT id FROM products WHERE sku = 'ILU-LAM-004'), 'Carga', 'USB-C carga rápida');

-- Specs for: Guantes de Trabajo Reforzados (SEG-GUA-005)
INSERT INTO product_specs (product_id, label, value) VALUES
  ((SELECT id FROM products WHERE sku = 'SEG-GUA-005'), 'Material', 'Nylon/Nitrilo reforzado'),
  ((SELECT id FROM products WHERE sku = 'SEG-GUA-005'), 'Norma', 'EN 388:2016'),
  ((SELECT id FROM products WHERE sku = 'SEG-GUA-005'), 'Corte', 'Nivel 5'),
  ((SELECT id FROM products WHERE sku = 'SEG-GUA-005'), 'Tallas', 'S, M, L, XL'),
  ((SELECT id FROM products WHERE sku = 'SEG-GUA-005'), 'Cierre', 'Velcro ajustable');

-- Specs for: Detector de Gas Portátil (DET-GAS-006)
INSERT INTO product_specs (product_id, label, value) VALUES
  ((SELECT id FROM products WHERE sku = 'DET-GAS-006'), 'Gases', 'CH4, CO, O2, H2S'),
  ((SELECT id FROM products WHERE sku = 'DET-GAS-006'), 'Certificación', 'ATEX Zona 0'),
  ((SELECT id FROM products WHERE sku = 'DET-GAS-006'), 'Alarmas', 'Sonora, visual, vibratoria'),
  ((SELECT id FROM products WHERE sku = 'DET-GAS-006'), 'Autonomía', '18 horas'),
  ((SELECT id FROM products WHERE sku = 'DET-GAS-006'), 'Pantalla', 'LCD retroiluminada');

-- Specs for: Pico Minero Profesional (HER-PIC-007)
INSERT INTO product_specs (product_id, label, value) VALUES
  ((SELECT id FROM products WHERE sku = 'HER-PIC-007'), 'Material cabeza', 'Acero al carbono forjado'),
  ((SELECT id FROM products WHERE sku = 'HER-PIC-007'), 'Mango', 'Madera de hickory'),
  ((SELECT id FROM products WHERE sku = 'HER-PIC-007'), 'Peso total', '2.5kg'),
  ((SELECT id FROM products WHERE sku = 'HER-PIC-007'), 'Largo mango', '90cm'),
  ((SELECT id FROM products WHERE sku = 'HER-PIC-007'), 'Tipo', 'Doble punta');

-- Specs for: Chaleco Reflectante Alta Visibilidad (SEG-CHA-008)
INSERT INTO product_specs (product_id, label, value) VALUES
  ((SELECT id FROM products WHERE sku = 'SEG-CHA-008'), 'Material', 'Poliéster fluorescente'),
  ((SELECT id FROM products WHERE sku = 'SEG-CHA-008'), 'Bandas', '3M Scotchlite 50mm'),
  ((SELECT id FROM products WHERE sku = 'SEG-CHA-008'), 'Norma', 'EN ISO 20471 Clase 2'),
  ((SELECT id FROM products WHERE sku = 'SEG-CHA-008'), 'Tallas', 'M, L, XL, XXL'),
  ((SELECT id FROM products WHERE sku = 'SEG-CHA-008'), 'Cierre', 'Velcro frontal');

COMMIT;
