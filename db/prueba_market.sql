-- Crear tablas
CREATE TABLE usuario (
                         id SERIAL PRIMARY KEY,
                         nombre_completo VARCHAR(100),
                         email VARCHAR(100),
                         password VARCHAR(100)
);

CREATE TABLE categoria (
                           id SERIAL PRIMARY KEY,
                           nombre VARCHAR(50) NOT NULL,
                           descripcion TEXT
);

CREATE TABLE estado_anuncio (
                                id SERIAL PRIMARY KEY,
                                nombre VARCHAR(50) NOT NULL
);

CREATE TABLE anuncio (
                         id SERIAL PRIMARY KEY,
                         titulo VARCHAR(100) NOT NULL,
                         descripcion TEXT NOT NULL,
                         precio NUMERIC(10,2) NOT NULL,
                         usuario_id INTEGER NOT NULL,
                         categoria_id INTEGER,
                         estado_id INTEGER
);

CREATE TABLE imagen (
                        id SERIAL PRIMARY KEY,
                        nombre TEXT NOT NULL,
                        path TEXT NOT NULL,
                        temporal BOOLEAN DEFAULT false,
                        fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        anuncio_id INTEGER
);

CREATE TABLE anuncio_guardado (
                                  id SERIAL PRIMARY KEY,
                                  usuario_id INTEGER NOT NULL,
                                  anuncio_id INTEGER NOT NULL,
                                  fecha_guardado TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE conversacion (
                              id SERIAL PRIMARY KEY,
                              anuncio_id INTEGER NOT NULL,
                              interesado_id INTEGER NOT NULL,
                              anunciante_id INTEGER NOT NULL,
                              CONSTRAINT no_misma_persona CHECK (interesado_id <> anunciante_id)
);

CREATE TABLE mensaje (
                         id SERIAL PRIMARY KEY,
                         contenido TEXT NOT NULL,
                         fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                         emisor_id INTEGER NOT NULL,
                         receptor_id INTEGER NOT NULL,
                         conversacion_id INTEGER NOT NULL
);

-- Insertar datos de ejemplo
INSERT INTO usuario (id,nombre_completo, email, password) VALUES
                                                           (1,'hola', 'hola@gmail.com', '1234'),
                                                           (2,'analia', 'analia@gmail.com', '123456'),
                                                           (3,'thiago armando', 'piki@gmail.com', 'piki2025'),
                                                           (4,'Leonardo', 'lv21@gmail.com', 'leo2023'),
                                                           (5,'Andres Quintanilla', 'andresq@gmail.com', 'andres25');

INSERT INTO categoria (id,nombre, descripcion) VALUES
                                                (1,'vapes', ''),
                                                (2,'tecnologias', ''),
                                                (3,'vehiculos', 'Categoria para autos, motos y todo tipo de vehiculos'),
                                                (4,'electrodomestico', 'Categoria de lavadoras, licuadoras, microondas etc.');

INSERT INTO estado_anuncio (id,nombre) VALUES
                                        (1,'Inactivo'),
                                        (2,'Activo');

INSERT INTO anuncio (id,titulo, descripcion, precio, usuario_id, categoria_id, estado_id) VALUES
                                                                                           (1,'Mercedes Benz AMG', 'Un coche de alto rendimiento que ofrece una experiencia inolvidable de conducción a cielo abierto', 4800000.00, 5, 10, 1),
                                                                                           (2,'Bentley 2024', 'automóvil de lujo fabricado por Bentley Motors', 296.00, 6, 10, 1),
                                                                                           (3,'iphone 16', 'iphone prueba', 800.00, 3, 3, 1),
                                                                                           (4,'Laptop ASUS ROG 2025', 'laptop asus gamer RTX 4080', 27000.00, 3, 3, 1);

INSERT INTO imagen (id,nombre, path, temporal, fecha_subida, anuncio_id) VALUES
                                                                          (1,'Apple_iPhone_16_Pro_Max.png', '/uploads/1750917844674.png', false, '2025-06-26 02:04:04.744156', 1),
                                                                          (2,'asus_g6143u.png', '/uploads/1751181834185.png', false, '2025-06-29 03:23:54.262247', 2),
                                                                          (3,'ASUS-ROG-Strix-G18-G814.png', '/uploads/1751181834190.png', false, '2025-06-29 03:23:54.312881', 2),
                                                                          (4,'MB_AMG_Training-Center_33.png', '/uploads/1751427662879.png', false, '2025-07-01 23:41:02.949373', 3),
                                                                          (5,'mercedes-Benz-AMG.jpg', '/uploads/1751427662889.jpg', false, '2025-07-01 23:41:03.001759', 3),
                                                                          (6,'bentley-2024.jpg', '/uploads/1751434248483.jpg', false, '2025-07-02 01:30:48.547884', 4),
                                                                          (7,'bentley.png', '/uploads/1751434248484.png', false, '2025-07-02 01:30:48.595264', 4);

INSERT INTO anuncio_guardado (id,usuario_id, anuncio_id, fecha_guardado) VALUES
    (1,2, 4, '2025-06-27 02:45:20.314982');

INSERT INTO conversacion (id,anuncio_id, interesado_id, anunciante_id) VALUES
                                                                        (1,3, 2, 3),
                                                                        (2,4, 2, 5);

INSERT INTO mensaje (id,contenido, fecha_envio, emisor_id, receptor_id, conversacion_id) VALUES
                                                                                          (1,'hola esta disponible el iphone?', '2025-06-26 02:05:31.850355', 2, 3, 1),
                                                                                          (2,'hola como te va?, sigue disponible', '2025-06-27 01:51:25.191656', 3, 2, 1),
                                                                                          (3,'a cuanto esta?', '2025-06-27 12:55:24.872126', 2, 3, 1),
                                                                                          (4,'7000bs miamolllll', '2025-06-27 15:59:14.424581', 3, 2, 1),
                                                                                          (5,'muchas gracias!', '2025-06-30 17:23:46.958955', 2, 3, 1),
                                                                                          (6,'hola buenas tarde, a cuanto tu carcacha?', '2025-07-01 15:18:49.029624', 2, 5, 2);

-- Ajustar secuencias
SELECT setval('usuario_id_seq', COALESCE((SELECT MAX(id) FROM usuario), 1), true);
SELECT setval('categoria_id_seq', COALESCE((SELECT MAX(id) FROM categoria), 1), true);
SELECT setval('estado_anuncio_id_seq', COALESCE((SELECT MAX(id) FROM estado_anuncio), 1), true);
SELECT setval('anuncio_id_seq', COALESCE((SELECT MAX(id) FROM anuncio), 1), true);
SELECT setval('imagen_id_seq', COALESCE((SELECT MAX(id) FROM imagen), 1), true);
SELECT setval('anuncio_guardado_id_seq', COALESCE((SELECT MAX(id) FROM anuncio_guardado), 1), true);
SELECT setval('conversacion_id_seq', COALESCE((SELECT MAX(id) FROM conversacion), 1), true);
SELECT setval('mensaje_id_seq', COALESCE((SELECT MAX(id) FROM mensaje), 1), true);
