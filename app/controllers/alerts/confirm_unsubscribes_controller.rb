class Alerts::ConfirmUnsubscribesController < ApplicationController

  # GET /alerts/confirm_unsubscribes/new
  # GET /alerts/confirm_unsubscribes/new.json
  def new
    @alerts_confirm_unsubscribe = Alerts::ConfirmUnsubscribe.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @alerts_confirm_unsubscribe }
    end
  end

  # POST /alerts/confirm_unsubscribes
  # POST /alerts/confirm_unsubscribes.json
  def create
    @alerts_confirm_unsubscribe = Alerts::ConfirmUnsubscribe.new(params[:alerts_confirm_unsubscribe])

    respond_to do |format|
      if @alerts_confirm_unsubscribe.save
        format.html { redirect_to @alerts_confirm_unsubscribe, notice: 'Confirm unsubscribe was successfully created.' }
        format.json { render json: @alerts_confirm_unsubscribe, status: :created, location: @alerts_confirm_unsubscribe }
      else
        format.html { render action: "new" }
        format.json { render json: @alerts_confirm_unsubscribe.errors, status: :unprocessable_entity }
      end
    end
  end
end
