"""Added an Order model.

Revision ID: 7465b417ce97
Revises: 1f6747e93457
Create Date: 2024-10-19 22:14:34.566598

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7465b417ce97'
down_revision = '1f6747e93457'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('orders',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_orders_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('order_products',
    sa.Column('product_id', sa.Integer(), nullable=True),
    sa.Column('order_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['order_id'], ['orders.id'], name=op.f('fk_order_products_order_id_orders')),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], name=op.f('fk_order_products_product_id_products'))
    )
    op.drop_table('user_products')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_products',
    sa.Column('user_id', sa.INTEGER(), nullable=True),
    sa.Column('product_id', sa.INTEGER(), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], name='fk_user_products_product_id_products'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='fk_user_products_user_id_users')
    )
    op.drop_table('order_products')
    op.drop_table('orders')
    # ### end Alembic commands ###
