class AddColumnsToAlerts < ActiveRecord::Migration
  def change
    add_column :alerts, :state, :string
    add_column :alerts, :address, :string
  end
end
