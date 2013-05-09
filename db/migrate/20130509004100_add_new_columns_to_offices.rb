class AddNewColumnsToOffices < ActiveRecord::Migration
  def change
    add_column :offices, :wifi, :boolean
    add_column :offices, :confroom, :boolean
    add_column :offices, :kitchen, :boolean
    add_column :offices, :parking, :boolean
    add_column :offices, :ac, :boolean
    add_column :offices, :printer, :boolean
    add_column :offices, :office_type, :integer
    add_column :offices, :rent_type, :integer
  end
end
