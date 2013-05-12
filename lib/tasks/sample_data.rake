namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do
    name  = Faker::Name.name
    email = "test2@intuit.com"
    User.create!(name: name,
                 email: email,
                 password: "intuit123"
                 )                 

    z =["94025","92131","94301","94121","94021"]
    5.times do |n|
      title  = Faker::Name.name
      description = "a nice office"
      Office.create!(title: title,
                   description: description,
                   loc_state: "California",
                   loc_zip: z[n],
                   user_id: 1)
    end
  end
end