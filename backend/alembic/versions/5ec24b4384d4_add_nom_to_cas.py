"""add_nom_to_cas

Revision ID: xxxxx
Revises: xxxxx
Create Date: 2025-11-16 18:27:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'xxxxx'
down_revision = 'xxxxx'
branch_labels = None
depends_on = None


def upgrade():
    # Ajouter la colonne nom à la table cas
    op.add_column('cas', sa.Column('nom', sa.String(length=200), nullable=True))


def downgrade():
    # Supprimer la colonne nom si on revient en arrière
    op.drop_column('cas', 'nom')
