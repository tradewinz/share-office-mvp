class DropListingsTable < ActiveRecord::Migration
  def up
    drop_table :listings if self.table_exists?("listings")
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end

  def self.table_exists?(name)
    ActiveRecord::Base.connection.tables.include?(name)
  end
end
