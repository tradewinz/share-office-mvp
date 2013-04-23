class AddContactFieldsToOffices < ActiveRecord::Migration
  def change
    add_column :offices, :accomodate, :integer
    add_column :offices, :available, :text
    add_column :offices, :company_name, :string
    add_column :offices, :loc_addr1, :string
    add_column :offices, :loc_addr2, :string
    add_column :offices, :loc_city, :string
    add_column :offices, :loc_state, :string
    add_column :offices, :features, :text
    add_column :offices, :on_site, :boolean
  end
end
