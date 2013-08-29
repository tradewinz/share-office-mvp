class AddNewFieldsToOfficeForm < ActiveRecord::Migration
   def change
    add_column :offices, :type_office, :integer, :default => 1
    add_column :offices, :min_lease, :integer, :default => 1
    add_column :offices, :security, :boolean
    add_column :offices, :cleaning, :boolean
    add_column :offices, :active_flag, :integer, :default => 2
  end
end
