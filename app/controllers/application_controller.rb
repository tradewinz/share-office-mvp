class ApplicationController < ActionController::Base
  protect_from_forgery
  around_filter :append_event_tracking_tags

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_path, :alert => exception.message
  end

  # optionally identify users
  def mixpanel_distinct_id
    current_user && current_user.id
  end

  def mixpanel_name_tag
    current_user && current_user.email
  end

end
