"""
📄 Fichier: alembic/env.py
📝 Description: Configuration Alembic pour DRSP
🎯 Usage: Gestion des migrations de base de données
"""

from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# ========================================
# ✅ IMPORTS NÉCESSAIRES POUR VOTRE PROJET
# ========================================
import sys
from pathlib import Path

# Ajouter le dossier backend au path Python
backend_path = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(backend_path))

# Importer vos configurations
from app.core.config import settings
from app.core.database import Base

# ========================================
# ✅ IMPORTER TOUS VOS MODÈLES ICI
# ========================================
# IMPORTANT : Tous les modèles doivent être importés pour que
# Alembic puisse détecter les changements automatiquement

from app.models.user import User
from app.models.maladie import Maladie
from app.models.district import District
from app.models.centre_sante import CentreSante
from app.models.cas import Cas
from app.models.alerte import Alerte
from app.models.intervention import Intervention

# Ajoutez ici tous vos autres modèles si vous en avez :
# from app.models.alerte import Alerte
# from app.models.intervention import Intervention
# etc.

# ========================================
# 🔧 CONFIGURATION ALEMBIC
# ========================================

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# ✅ UTILISER VOTRE DATABASE_URL DEPUIS LES SETTINGS
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ========================================
# ✅ CONFIGURER LES MÉTADONNÉES
# ========================================
# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        # ✅ Options supplémentaires recommandées
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            # ✅ Options supplémentaires recommandées
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
