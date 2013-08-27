class OfficesController < ApplicationController
  before_filter :authenticate_user!, except: [:index, :show]

  # GET /offices
  # GET /offices.json
  def index
    @offices = Office.where("user_id = ?", current_user).order('created_at DESC').page(params[:page])
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @offices }
    end
  end

  # GET /offices/1
  # GET /offices/1.json
  def show
    @office = Office.find(params[:id])
    #@reserf = Reserve.new

    # make sure next and prev are only found when searching; if not search, clear session - if not clear session, what would happen?
    if (session[:query] and session[:search_results] and session[:query].include? @office.id and (request.referer.present? and (request.referer.include? "offices/" or request.referer.include? "listings")))
      @next_office = @office.next(session[:query])
      @prev_office = @office.previous(session[:query])
    else
      session[:search_results] = nil
    end 

    if (session[:query] and session[:featured] and session[:query].include? @office.id and (request.referer.present? and (request.referer.include? "offices/" or Rails.application.routes.recognize_path(request.referrer)==Rails.application.routes.recognize_path(home_path))))
      @next_office = @office.next(session[:query])
      @prev_office = @office.previous(session[:query])
    else
      session[:featured] = nil
    end 

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

  def publish
    @office = Office.find(params[:id])
    authorize! :update, @office
    
    @office.active_flag = 1

    track_event("Published Listing");

    respond_to do |format|
      if @office.save
        format.html { redirect_to confirm_path(:id => @office.id) }
        format.json { head :no_content }

        # send email to user and us on successful listing create
        OfficeMailer.add_listing_confirm(@office).deliver

        track_event("Added Listing");

        # send email to users who have set alerts
        @alerts = Alert.where("lower(city) = ?", @office.loc_city.downcase)
        @alerts.each do |alert|
          AlertMailer.match_found(@office,alert).deliver
        end
      else
        flash[:error] = 'Your office could not be published. Please check that all required fields are filled out correctly and try again.'
        format.html { render action: "edit" }
        format.json { render json: @office.errors, status: :unprocessable_entity }
      end
    end
  end


  # POST /offices
  # POST /offices.json
  def create
    @office = Office.new(params[:office])
    @office.user = current_user

    respond_to do |format|
      if @office.save
        track_event("Added Listing Address");
        format.html { redirect_to edit_office_path(:id => @office.id)}
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

        case @office.active_flag
        when 0
          format.html { redirect_to office_path(@office) }
          format.json { head :no_content }

        when 2
          # send email to us on successful listing edit
          OfficeMailer.edit_listing_confirm(@office).deliver
          format.html { redirect_to office_path(@office), notice: "Your listing has been successfully edited!" }
          format.json { head :no_content }

          track_event("Updated Listing");
        end

      else
        format.html { render action: "edit" }
        format.json { render json: @office.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /offices/1
  # DELETE /offices/1.json
  def disable
    @office = Office.find(params[:id])
    authorize! :update, @office
    
    @office.active_flag = 0

    track_event("Disabled Listing");

    respond_to do |format|
      if @office.save
        format.html { redirect_to office_path(@office), notice: "This listing has been successfully disabled." }
        format.json { head :no_content }
      else 
        flash[:error] = 'Your office could not be disabled. Please contact us at spaces@intuit.com for assistance.'
        format.html { redirect_to office_path(@office) }
        format.json { head :no_content }
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
