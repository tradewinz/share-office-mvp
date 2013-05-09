class RemoveObsoleteColumnsFromOffices < ActiveRecord::Migration
  def up
    remove_column :offices, :availability
    remove_column :offices, :company_name
    remove_column :offices, :insurance
    remove_column :offices, :swap
    remove_column :offices, :contact_name
    remove_column :offices, :contact_picture
    remove_column :offices, :company_desc
    remove_column :offices, :company_url
    remove_column :offices, :years
    remove_column :offices, :contact_email
    remove_column :offices, :contact_phone
    remove_column :offices, :features
    remove_column :offices, :on_site
  end

  def down
    add_column :offices, :on_site, :boolean
    add_column :offices, :features, :text
    add_column :offices, :contact_phone, :string
    add_column :offices, :contact_email, :string
    add_column :offices, :years, :integer
    add_column :offices, :company_url, :string
    add_column :offices, :company_desc, :text
    add_column :offices, :contact_picture, :string
    add_column :offices, :contact_name, :string
    add_column :offices, :swap, :boolean
    add_column :offices, :insurance, :boolean
    add_column :offices, :company_name, :string
    add_column :offices, :availability, :string
  end
end
