require 'test_helper'

class Alerts::ConfirmUnsubscribesControllerTest < ActionController::TestCase
  setup do
    @alerts_confirm_unsubscribe = alerts_confirm_unsubscribes(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:alerts_confirm_unsubscribes)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create alerts_confirm_unsubscribe" do
    assert_difference('Alerts::ConfirmUnsubscribe.count') do
      post :create, alerts_confirm_unsubscribe: { email: @alerts_confirm_unsubscribe.email }
    end

    assert_redirected_to alerts_confirm_unsubscribe_path(assigns(:alerts_confirm_unsubscribe))
  end

  test "should show alerts_confirm_unsubscribe" do
    get :show, id: @alerts_confirm_unsubscribe
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @alerts_confirm_unsubscribe
    assert_response :success
  end

  test "should update alerts_confirm_unsubscribe" do
    put :update, id: @alerts_confirm_unsubscribe, alerts_confirm_unsubscribe: { email: @alerts_confirm_unsubscribe.email }
    assert_redirected_to alerts_confirm_unsubscribe_path(assigns(:alerts_confirm_unsubscribe))
  end

  test "should destroy alerts_confirm_unsubscribe" do
    assert_difference('Alerts::ConfirmUnsubscribe.count', -1) do
      delete :destroy, id: @alerts_confirm_unsubscribe
    end

    assert_redirected_to alerts_confirm_unsubscribes_path
  end
end
