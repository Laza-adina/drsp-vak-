-- ========================================
-- 🔧 MODIFICATION DE LA TABLE MALADIES
-- ========================================

-- 1. Supprimer les colonnes inutiles
ALTER TABLE maladies 
DROP COLUMN IF EXISTS periode_incubation_min,
DROP COLUMN IF EXISTS periode_incubation_max,
DROP COLUMN IF EXISTS mode_transmission,
DROP COLUMN IF EXISTS symptomes;

-- 2. Ajouter les colonnes pour les seuils d'alerte
ALTER TABLE maladies 
ADD COLUMN IF NOT EXISTS seuil_alerte INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS seuil_epidemie INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS code VARCHAR(10);

-- 3. Mettre à jour les valeurs par défaut pour les maladies existantes
UPDATE maladies SET seuil_alerte = 5, seuil_epidemie = 15 WHERE nom = 'covid19';
UPDATE maladies SET seuil_alerte = 3, seuil_epidemie = 10 WHERE nom = 'dengue';

-- 4. Vérifier la structure
\d maladies

-- 5. Voir les données
SELECT id, nom, code, seuil_alerte, seuil_epidemie, priorite_surveillance, is_active 
FROM maladies 
ORDER BY id;
