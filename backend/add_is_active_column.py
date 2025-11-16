"""
📄 Fichier: backend/add_is_active_column.py
📝 Description: Script pour ajouter la colonne is_active
🎯 Usage: python add_is_active_column.py
"""

from sqlalchemy import text
from app.core.database import engine

def add_is_active_column():
    """Ajoute la colonne is_active aux tables qui en ont besoin"""
    
    with engine.connect() as conn:
        try:
            # Ajouter is_active à la table maladies
            conn.execute(text("""
                ALTER TABLE maladies 
                ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE NOT NULL;
            """))
            
            # Mettre à jour les lignes existantes
            conn.execute(text("""
                UPDATE maladies 
                SET is_active = TRUE 
                WHERE is_active IS NULL;
            """))
            
            conn.commit()
            print("✅ Colonne 'is_active' ajoutée à la table 'maladies' avec succès!")
            
        except Exception as e:
            print(f"❌ Erreur: {e}")
            conn.rollback()

if __name__ == "__main__":
    add_is_active_column()
