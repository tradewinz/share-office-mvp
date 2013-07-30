class ReservesController < ApplicationController
  # GET /reserves/new
  # GET /reserves/new.json
  def new
    @reserf = Reserve.new
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @reserf }
    end
  end

  # POST /reserves
  # POST /reserves.json
  def create
    @reserf = Reserve.new(params[:reserve])
    logger.debug "reserve: #{@reserf}"


    respond_to do |format|
      if @reserf.valid?
        format.html { redirect_to :back, notice: 'Your message has been sent! The host will contact you directly to talk details and answer any questions you may have.' }
        format.json { render json: @reserf, status: :created, location: @reserf }
        ContactHost.contact_host(@reserf).deliver
        logger.debug "valid"
      else
        format.html { render action: "new" }
        format.json { render json: @reserf.errors, status: :unprocessable_entity }
        logger.debug "fail"
      end
    end
    logger.debug "yay!"
  end
end