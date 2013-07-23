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
        #send confirmation email?
        format.html { redirect_to home_path, notice: 'Alert was successfully created.' }
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
    # @alerts_confirm_unsubscribe = Alerts::ConfirmUnsubscribe.new
    respond_to do |format|
      format.html { render :confirm}
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
