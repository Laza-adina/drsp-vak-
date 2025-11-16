-- ========================================
-- 🗺️ AJOUT DES COORDONNÉES GPS AUX CAS EXISTANTS
-- ========================================

-- 1. Mettre à jour les coordonnées des districts
UPDATE districts SET latitude = -19.8502, longitude = 46.8467, population = 350000 WHERE id = 1;
UPDATE districts SET latitude = -19.9000, longitude = 47.0000, population = 280000 WHERE id = 2;
UPDATE districts SET latitude = -19.8334, longitude = 46.8500, population = 180000 WHERE id = 3;

-- 2. Mettre à jour les coordonnées des centres de santé
UPDATE centres_sante SET latitude = -19.8502, longitude = 46.8467 WHERE id = 1;
UPDATE centres_sante SET latitude = -19.9000, longitude = 47.0000 WHERE id = 2;
UPDATE centres_sante SET latitude = -19.8334, longitude = 46.8500 WHERE id = 3;

-- 3. Ajouter des coordonnées GPS aux cas existants
-- (Variation autour du centre de santé associé)

-- Cas ID 2 (District 1, Centre 1)
UPDATE cas SET latitude = -19.8510, longitude = 46.8470 WHERE id = 2;

-- Cas ID 3 (District 3, Centre 2)
UPDATE cas SET latitude = -19.8340, longitude = 46.8510 WHERE id = 3;

-- Cas ID 4 (District 2, Centre 3)
UPDATE cas SET latitude = -19.9010, longitude = 47.0010 WHERE id = 4;

-- Cas ID 5 (District 2, Centre 3)
UPDATE cas SET latitude = -19.9020, longitude = 47.0020 WHERE id = 5;

-- Cas ID 9 (District 2, Centre 3)
UPDATE cas SET latitude = -19.9005, longitude = 47.0005 WHERE id = 9;

-- Cas ID 13 (District 3, Centre 2)
UPDATE cas SET latitude = -19.8350, longitude = 46.8520 WHERE id = 13;

-- Cas ID 14 (District 3, Centre 3)
UPDATE cas SET latitude = -19.8330, longitude = 46.8490 WHERE id = 14;

-- Cas ID 15 (District 3, Centre 2)
UPDATE cas SET latitude = -19.8360, longitude = 46.8530 WHERE id = 15;

-- Cas ID 16 (District 3, Centre 2)
UPDATE cas SET latitude = -19.8320, longitude = 46.8480 WHERE id = 16;

-- Cas ID 17 (District 3, Centre 2)
UPDATE cas SET latitude = -19.8345, longitude = 46.8515 WHERE id = 17;

-- Cas ID 18 (District 3, Centre 2)
UPDATE cas SET latitude = -19.8355, longitude = 46.8525 WHERE id = 18;

-- Cas ID 19 (District 2, Centre 3)
UPDATE cas SET latitude = -19.9015, longitude = 47.0015 WHERE id = 19;

-- ========================================
-- 4️⃣ VÉRIFICATION
-- ========================================

-- Compter les cas avec coordonnées
SELECT 
    'Total cas' as type,
    COUNT(*) as nombre
FROM cas
UNION ALL
SELECT 
    'Cas avec GPS' as type,
    COUNT(*) as nombre
FROM cas
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Statistiques par district
SELECT 
    d.nom as district,
    COUNT(c.id) as nombre_cas,
    d.latitude as district_lat,
    d.longitude as district_lon
FROM cas c
JOIN districts d ON c.district_id = d.id
WHERE c.latitude IS NOT NULL
GROUP BY d.id, d.nom, d.latitude, d.longitude
ORDER BY nombre_cas DESC;

-- Liste des cas avec coordonnées
SELECT 
    numero_cas,
    nom,
    statut,
    latitude,
    longitude,
    d.nom as district
FROM cas c
LEFT JOIN districts d ON c.district_id = d.id
WHERE c.latitude IS NOT NULL
ORDER BY c.id;
