class AlertsController < ApplicationController
  # GET /alerts
  # GET /alerts.json
  def index
    @alerts = Alert.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @alerts }
    end
  end

  # GET /alerts/new
  # GET /alerts/new.json
  def new
    @alert = Alert.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @alert }
    end
  end

  # POST /alerts
  # POST /alerts.json
  def create
    @alert = Alert.new(params[:alert])

    respond_to do |format|
      if @alert.save
        #send confirmation email
        AlertMailer.confirm(@alert).deliver
        track_event("Added Alert");

        format.html { redirect_to :back, notice: "Alert was successfully created. We\'ll notify you when there are new listings in #{@alert.city}." }
        format.json { render json: @alert, status: :created, location: @alert }
      else
        format.html { render action: "new"}
        format.json { render json: @alert.errors, status: :unprocessable_entity }
      end
    end
  end


  # DELETE /alerts/1
  # DELETE /alerts/1.json
  def unsubscribe
    @alert = Alert.find(params[:id])
    @offices = Office.where("lower(loc_city) = ?", @alert.city.downcase)

    respond_to do |format|
      format.html
      format.json { head :no_content }
    end
  end

  # DELETE /alerts/1
  # DELETE /alerts/1.json
  def destroy
    @alert = Alert.find(params[:id])
    @alert.destroy

    respond_to do |format|
      format.html { redirect_to home_url, notice: 'Alert was successfully deleted.'  }
      format.json { head :no_content }
    end
  end
end
