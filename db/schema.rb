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

ActiveRecord::Schema.define(:version => 20130220203833) do

  create_table "listings", :force => true do |t|
    t.string   "description"
    t.string   "location"
    t.string   "headline"
    t.integer  "user_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
    t.string   "image"
  end

  create_table "offices", :force => true do |t|
    t.decimal  "rent"
    t.string   "size"
    t.string   "title"
    t.text     "description"
    t.date     "availability"
    t.boolean  "insurance"
    t.boolean  "swap"
    t.string   "image1"
    t.string   "image2"
    t.string   "image3"
    t.string   "image4"
    t.string   "contact_name"
    t.string   "contact_picture"
    t.text     "company_desc"
    t.string   "company_url"
    t.integer  "years"
    t.string   "contact_email"
    t.string   "contact_phone"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
    t.integer  "accomodate"
    t.text     "available"
    t.string   "company_name"
    t.string   "loc_addr1"
    t.string   "loc_addr2"
    t.string   "loc_city"
    t.string   "loc_state"
    t.text     "features"
    t.boolean  "on_site"
    t.string   "loc_zip"
  end

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "phone"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
