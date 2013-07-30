class AddIndexToOfficeIdInReserves < ActiveRecord::Migration
  def up
    add_index :reserves, :office_id
  end

  def down
  	remove_index :reserves, :office_id
  end

end
