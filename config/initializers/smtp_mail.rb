# Gmail settings
# ActionMailer::Base.smtp_settings = {
#  :address => "smtp.gmail.com",
#  :port => 587,
#  :domain => "intuit.com",
#  :authentication => :plain,
#  :user_name => "tradewinzintuit@gmail.com", # use full email address here
#  :password => "intuit123",
#  :enable_starttls_auto => true
#}

# Mandrill settings
 ActionMailer::Base.smtp_settings = {
  :address => "smtp.mandrillapp.com",
  :port => 587,
  :domain => "mandrillapp.com",
  :authentication => :plain,
  :user_name => "app14218737@heroku.com", # see Mandrill add-on in heroku
  :password => "oKMq7YcpJHq5IrfPbrNJtw",
  :enable_starttls_auto => true
}