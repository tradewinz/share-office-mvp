class OfficesController < ApplicationController
  before_filter :authenticate_user!, except: [:index, :show]

  # GET /offices
  # GET /offices.json
  def index
    @offices = Office.order("created_at desc")

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @offices }
    end
  end

  # GET /offices/1
  # GET /offices/1.json
  def show
    @office = Office.find(params[:id])
    @json = @office.to_gmaps4rails

    track_event("Viewed Details");

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @office }
    end
  end


  # GET /offices/new
  # GET /offices/new.json
  def new
    @office = Office.new

    track_event("Viewed AddListing")

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @office }
    end
  end

  # GET /offices/1/edit
  def edit
    @office = Office.find(params[:id])

    track_event("Viewed EditListing")
  end

  # POST /offices
  # POST /offices.json
  def create
    @office = Office.new(params[:office])
    @office.user = current_user

    respond_to do |format|
      if @office.save
        # send email to user and us on successful listing create
        OfficeMailer.add_listing_confirm(@office).deliver

        track_event("Added Listing");

        format.html { redirect_to confirm_path(:id => @office.id), notice: 'Listing was successfully posted.' }
        format.json { render json: @office, status: :created, location: @office }
      else
        format.html { render action: "new" }
        format.json { render json: @office.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /offices/1
  # PUT /offices/1.json
  def update
    @office = Office.find(params[:id])
   
    authorize! :update, @office

    respond_to do |format|
      if @office.update_attributes(params[:office])
        # send email to us on successful listing edit
        OfficeMailer.edit_listing_confirm(@office).deliver

        track_event("Updated Listing");

        format.html { redirect_to confirm_path(:id => @office.id), notice: 'Listing was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @office.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /offices/1
  # DELETE /offices/1.json
  def destroy
    @office = Office.find(params[:id])

    authorize! :destroy, @office
    
    @office.destroy

    track_event("Deleted Listing");

    respond_to do |format|
      format.html { redirect_to offices_url }
      format.json { head :no_content }
    end
  end

  def reserve
    # Create a booking entity and link with this office
    @office = Office.find(params[:id])
    @current_user = current_user

    OfficeMailer.reserve_listing_confirm(@office, @current_user).deliver
    OfficeMailer.request_reserve_confirm(@office, @current_user).deliver

    track_event("Completed ContactUs")

  end

  def confirm
    @office = Office.find(params[:id])

  end
end
