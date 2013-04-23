class CreateListings < ActiveRecord::Migration
  def change
    create_table :listings do |t|
      t.string :description
      t.string :location
      t.string :headline
      t.integer :user_id

      t.timestamps
    end
  end
end
