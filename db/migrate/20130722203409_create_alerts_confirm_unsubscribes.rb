class CreateAlertsConfirmUnsubscribes < ActiveRecord::Migration
  def change
    create_table :alerts_confirm_unsubscribes do |t|
      t.string :email

      t.timestamps
    end
  end
end
