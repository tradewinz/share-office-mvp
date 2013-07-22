class AddOfficeIdToReserves < ActiveRecord::Migration
  def change
    add_column :reserves, :office_id, :integer
  end
end
