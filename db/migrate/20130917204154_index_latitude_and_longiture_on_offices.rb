class IndexLatitudeAndLongitureOnOffices < ActiveRecord::Migration
  def up
  	add_index :offices, [:latitude, :longitude]
  end

  def down
  	remove_index :offices, [:latitude, :longitude]
  end
end
