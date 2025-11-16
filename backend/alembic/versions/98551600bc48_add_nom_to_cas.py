"""add_nom_to_cas

Revision ID: 98551600bc48
Revises: 5ec24b4384d4
Create Date: 2025-11-16 18:29:01.042091

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '98551600bc48'
down_revision: Union[str, Sequence[str], None] = '5ec24b4384d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
