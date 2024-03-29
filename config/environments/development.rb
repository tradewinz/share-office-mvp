ShareOfficeMvp::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

 # Use smtp mail service
  config.action_mailer.delivery_method = :smtp

 # turn on/off email delivering
  config.action_mailer.perform_deliveries = true

  # specify what domain to use for mailer URLs
  config.action_mailer.default_url_options = { :host => "stage.spaces.intuit.com" }
  # specify what domain to use for mailer ASSETS
  config.action_mailer.asset_host = "stage.spaces.intuit.com"

  # If false, don't throw an exception if the mailer can't send
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # See everything in the log (default is :info)
  config.log_level = :debug

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin

  # Raise exception on mass assignment protection for Active Record models
  config.active_record.mass_assignment_sanitizer = :strict

  # Log the query plan for queries taking more than this (works
  # with SQLite, MySQL, and PostgreSQL)
  config.active_record.auto_explain_threshold_in_seconds = 0.5

  # Do not compress assets
  config.assets.compress = false

  # Expands the lines which load the assets
  config.assets.debug = false
  
  config.serve_static_assets = false

  # Mixpanel dev keys
  config.event_tracker.mixpanel_key="5457e4b5c3b5ec9501dc9bd9a40f2839"

end
