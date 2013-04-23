require 'test_helper'

class LandingPagesControllerTest < ActionController::TestCase
  test "should get home" do
    get :home
    assert_response :success
  end

  test "should get privacy" do
    get :privacy
    assert_response :success
  end

  test "should get addlisting" do
    get :addlisting
    assert_response :success
  end

  test "should get view" do
    get :view
    assert_response :success
  end

end
