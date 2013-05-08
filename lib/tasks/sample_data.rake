namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do
    Office.create!(title: "An Office",
                 description: "Very awesome office",
                 contact_email: "foobar@foo.com",
                 available: "Right away!",
                 company_desc: "Nice company",
                 loc_zip: "94023")
    z =["94025","92131","94301","94121","94021"]
    5.times do |n|
      title  = Faker::Name.name
      email = "example-#{n+1}@intuit.com"
      description = "a nice office"
      Office.create!(title: title,
                   contact_email: email,
                   description: description,
                   available: "Coming Soon",
                   company_desc: "Very good company",
                   loc_city: "",
                   loc_state: "California",
                   loc_zip: z[n])
    end
  end
end