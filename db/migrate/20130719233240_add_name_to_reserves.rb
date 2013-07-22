class AddNameToReserves < ActiveRecord::Migration
  def change
    add_column :reserves, :name, :string
  end
end
