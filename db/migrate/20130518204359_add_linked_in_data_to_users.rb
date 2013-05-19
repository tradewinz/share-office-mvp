class AddLinkedInDataToUsers < ActiveRecord::Migration
  def change
    add_column :users, :fname, :string
    add_column :users, :lname, :string
    add_column :users, :connections, :string
    add_column :users, :industry, :string
    add_column :users, :company, :string
    add_column :users, :photo, :string
    add_column :users, :website, :string
    add_column :users, :location, :string
    add_column :users, :description, :string
  end
end
