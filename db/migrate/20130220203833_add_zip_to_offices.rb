class AddZipToOffices < ActiveRecord::Migration
  def change
    add_column :offices, :loc_zip, :string
  end
end
