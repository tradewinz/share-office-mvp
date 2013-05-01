class AddUseridToOffices < ActiveRecord::Migration
  def change
    add_column :offices, :user_id, :integer
  end
end
