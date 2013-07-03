class AddFeaturedToOffices < ActiveRecord::Migration
  def change
    add_column :offices, :featured, :boolean, :default => false
  end
end
