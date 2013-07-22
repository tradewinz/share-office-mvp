class CreateReserves < ActiveRecord::Migration
  def change
    create_table :reserves do |t|
      t.string :length
      t.string :email
      t.string :phone
      t.string :misc

      t.timestamps
    end
  end
end
