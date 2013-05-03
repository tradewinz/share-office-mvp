class AddGmapsToOffices < ActiveRecord::Migration
  def change
    add_column :offices, :gmaps, :boolean
  end
end
