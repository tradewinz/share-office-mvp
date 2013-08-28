class AddNewFieldsToOfficeForm < ActiveRecord::Migration
   def change
   	add_column :offices, :loc_address, :string
    add_column :offices, :private, :boolean, :default => false
    add_column :offices, :creative, :boolean, :default => false
    add_column :offices, :counseling, :boolean, :default => false
    add_column :offices, :treatment, :boolean, :default => false
    add_column :offices, :min_lease, :integer
    add_column :offices, :security, :boolean
    add_column :offices, :cleaning, :boolean
    add_column :offices, :active_flag, :integer, :default => 1
  end
end
