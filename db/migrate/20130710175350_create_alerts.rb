class CreateAlerts < ActiveRecord::Migration
  def change
    create_table :alerts do |t|
      t.string :city
      t.string :email
      t.string :misc

      t.timestamps
    end
  end
end
