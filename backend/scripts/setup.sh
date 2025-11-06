#!/bin/bash

# Script de configuration automatique du projet DRSP
# Usage: bash setup.sh

echo "=========================================="
echo "🏥 Configuration DRSP Backend"
echo "=========================================="
echo ""

# Créer la structure de dossiers
echo "📁 Création de la structure..."
mkdir -p app/core
mkdir -p app/models
mkdir -p app/schemas
mkdir -p app/api/v1/endpoints
mkdir -p app/crud
mkdir -p app/services
mkdir -p app/utils
mkdir -p tests
mkdir -p scripts
mkdir -p alembic/versions
mkdir -p reports
mkdir -p exports

# Créer tous les __init__.py
echo "📝 Création des fichiers __init__.py..."
touch app/__init__.py
touch app/core/__init__.py
touch app/models/__init__.py
touch app/schemas/__init__.py
touch app/api/__init__.py
touch app/api/v1/__init__.py
touch app/api/v1/endpoints/__init__.py
touch app/crud/__init__.py
touch app/services/__init__.py
touch app/utils/__init__.py
touch tests/__init__.py
touch scripts/__init__.py

# Créer le fichier .env
if [ ! -f .env ]; then
    echo "🔐 Création du fichier .env..."
    cat > .env << EOF
DATABASE_URL=postgresql://postgres@localhost/sante_db
SECRET_KEY=monsecret123-changez-moi-en-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
API_V1_STR=/api/v1
PROJECT_NAME=DRSP Analamanga - Surveillance Épidémiologique
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
EOF
    echo "✅ Fichier .env créé (pensez à changer SECRET_KEY !)"
else
    echo "⚠️  Fichier .env existe déjà, ignoré"
fi

# Créer .gitignore
echo "📋 Création du .gitignore..."
cat > .gitignore << 'EOF'
__pycache__/
*.py[cod]
venv/
.env
.env.local
.vscode/
.idea/
*.log
*.db
*.sqlite3
.pytest_cache/
.coverage
reports/*.pdf
exports/*.xlsx
exports/*.csv
EOF

echo ""
echo "✅ Structure créée avec succès !"
echo ""
echo "📦 Prochaines étapes :"
echo "1. Créer un environnement virtuel : python -m venv venv"
echo "2. L'activer : source venv/bin/activate (Linux/Mac) ou venv\Scripts\activate (Windows)"
echo "3. Installer les dépendances : pip install -r requirements.txt"
echo "4. Créer la base PostgreSQL : createdb sante_db"
echo "5. Initialiser les données : python -m scripts.seed_data"
echo "6. Lancer le serveur : uvicorn app.main:app --reload"
echo ""
echo "📖 Consultez QUICK_START.md pour plus de détails"
echo ""