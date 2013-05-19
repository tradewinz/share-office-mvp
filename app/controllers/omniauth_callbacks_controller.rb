class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def all
    # Use only to debug the auth hash
    # raise request.env["omniauth.auth"].to_yaml
    user = User.from_omniauth(request.env["omniauth.auth"])

    if user.persisted?
      # if user found in our database, let them in
      flash.notice = "Signed in!"
      sign_in_and_redirect user
    else
      # when user hasn’t been persisted create a new user
      # but pass user info to model by saving user’s attributes in a session
      session["devise.user_attributes"] = user.attributes
      redirect_to new_user_registration_url
    end
  end
  # add other providers here but all callback actions will be same
  alias_method :linkedin_oauth2, :all
end