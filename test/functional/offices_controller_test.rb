require 'test_helper'

class OfficesControllerTest < ActionController::TestCase
  setup do
    @office = offices(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:offices)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create office" do
    assert_difference('Office.count') do
      post :create, office: { availability: @office.availability, company_desc: @office.company_desc, company_url: @office.company_url, contact_email: @office.contact_email, contact_name: @office.contact_name, contact_phone: @office.contact_phone, contact_picture: @office.contact_picture, description: @office.description, image1: @office.image1, image2: @office.image2, image3: @office.image3, image4: @office.image4, insurance: @office.insurance, rent: @office.rent, size: @office.size, swap: @office.swap, title: @office.title, years: @office.years }
    end

    assert_redirected_to office_path(assigns(:office))
  end

  test "should show office" do
    get :show, id: @office
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @office
    assert_response :success
  end

  test "should update office" do
    put :update, id: @office, office: { availability: @office.availability, company_desc: @office.company_desc, company_url: @office.company_url, contact_email: @office.contact_email, contact_name: @office.contact_name, contact_phone: @office.contact_phone, contact_picture: @office.contact_picture, description: @office.description, image1: @office.image1, image2: @office.image2, image3: @office.image3, image4: @office.image4, insurance: @office.insurance, rent: @office.rent, size: @office.size, swap: @office.swap, title: @office.title, years: @office.years }
    assert_redirected_to office_path(assigns(:office))
  end

  test "should destroy office" do
    assert_difference('Office.count', -1) do
      delete :destroy, id: @office
    end

    assert_redirected_to offices_path
  end
end
