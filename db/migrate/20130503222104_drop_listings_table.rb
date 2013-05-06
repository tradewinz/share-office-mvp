class DropListingsTable < ActiveRecord::Migration
  def up
    #drop_table :listings
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
