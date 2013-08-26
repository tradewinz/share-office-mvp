# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130826045910) do

  create_table "alerts", :force => true do |t|
    t.string   "city"
    t.string   "email"
    t.string   "misc"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.string   "state"
    t.string   "address"
  end

  create_table "attachinary_files", :force => true do |t|
    t.integer  "attachinariable_id"
    t.string   "attachinariable_type"
    t.string   "scope"
    t.string   "public_id"
    t.string   "version"
    t.integer  "width"
    t.integer  "height"
    t.string   "format"
    t.string   "resource_type"
    t.datetime "created_at",           :null => false
    t.datetime "updated_at",           :null => false
  end

  add_index "attachinary_files", ["attachinariable_type", "attachinariable_id", "scope"], :name => "by_scoped_parent"

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "offices", :force => true do |t|
    t.decimal  "rent"
    t.string   "size"
    t.string   "title"
    t.text     "description"
    t.string   "image1"
    t.string   "image2"
    t.string   "image3"
    t.string   "image4"
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
    t.integer  "accomodate"
    t.text     "available"
    t.string   "loc_addr1"
    t.string   "loc_addr2"
    t.string   "loc_city"
    t.string   "loc_state"
    t.string   "loc_zip"
    t.integer  "user_id"
    t.float    "latitude"
    t.float    "longitude"
    t.boolean  "gmaps"
    t.boolean  "wifi"
    t.boolean  "confroom"
    t.boolean  "kitchen"
    t.boolean  "parking"
    t.boolean  "ac"
    t.boolean  "printer"
    t.integer  "office_type"
    t.integer  "rent_type"
    t.boolean  "window"
    t.boolean  "featured",    :default => false
    t.boolean  "address"
    t.boolean  "quiet",       :default => false
    t.boolean  "creative",    :default => false
    t.boolean  "client",      :default => false
    t.boolean  "team",        :default => false
    t.integer  "min_lease"
    t.boolean  "security"
    t.boolean  "cleaning"
  end

  create_table "rails_admin_histories", :force => true do |t|
    t.text     "message"
    t.string   "username"
    t.integer  "item"
    t.string   "table"
    t.integer  "month",      :limit => 2
    t.integer  "year",       :limit => 5
    t.datetime "created_at",              :null => false
    t.datetime "updated_at",              :null => false
  end

  add_index "rails_admin_histories", ["item", "table", "month", "year"], :name => "index_rails_admin_histories"

  create_table "reserves", :force => true do |t|
    t.string   "length"
    t.string   "email"
    t.string   "phone"
    t.string   "misc"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "office_id"
    t.string   "name"
  end

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "phone"
    t.datetime "created_at",                                :null => false
    t.datetime "updated_at",                                :null => false
    t.string   "encrypted_password",     :default => "",    :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "provider"
    t.string   "uid"
    t.string   "fname"
    t.string   "lname"
    t.string   "connections"
    t.string   "industry"
    t.string   "company"
    t.string   "photo"
    t.string   "website"
    t.string   "location"
    t.string   "description"
    t.boolean  "admin",                  :default => false
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
