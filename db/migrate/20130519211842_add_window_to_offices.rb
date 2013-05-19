class AddWindowToOffices < ActiveRecord::Migration
  def change
    add_column :offices, :window, :boolean
  end
end
