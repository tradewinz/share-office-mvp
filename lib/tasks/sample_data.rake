namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do
    Office.create!(title: "An Office",
                 description: "Very awesome office",
                 contact_email: "foobar@foo.com",
                 loc_zip: "94023")
    99.times do |n|
      title  = Faker::Name.name
      email = "example-#{n+1}@intuit.com"
      description = "a nice office"
      Office.create!(title: title,
                   contact_email: email,
                   description: description,
                   loc_zip: "94023")
    end
  end
end