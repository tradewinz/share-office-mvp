class AddNewFieldsToOfficeForm < ActiveRecord::Migration
   def change
   	add_column :offices, :address, :boolean
    add_column :offices, :quiet, :boolean, :default => false
    add_column :offices, :creative, :boolean, :default => false
    add_column :offices, :client, :boolean, :default => false
    add_column :offices, :team, :boolean, :default => false
    add_column :offices, :min_lease, :integer
    add_column :offices, :security, :boolean
    add_column :offices, :cleaning, :boolean
  end
end
