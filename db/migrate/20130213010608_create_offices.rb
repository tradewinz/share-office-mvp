class CreateOffices < ActiveRecord::Migration
  def change
    create_table :offices do |t|
      t.decimal :rent
      t.string :size
      t.string :title
      t.text :description
      t.date :availability
      t.boolean :insurance
      t.boolean :swap
      t.string :image1
      t.string :image2
      t.string :image3
      t.string :image4
      t.string :contact_name
      t.string :contact_picture
      t.text :company_desc
      t.string :company_url
      t.integer :years
      t.string :contact_email
      t.string :contact_phone

      t.timestamps
    end
  end
end
