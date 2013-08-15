class ReservesController < ApplicationController

  # POST /reserves
  # POST /reserves.json
  def create
    @office = Office.find(params[:office_id])
    @reserf = @office.reserve.create(params[:reserve])

    respond_to do |format|
      if @reserf.save
        format.html { redirect_to :back }
        format.json { render json: @reserf, status: :created, location: @reserf}
        ContactHost.contact_host(@reserf).deliver
      else
        flash[:error] = 'Your message could not be sent due to an invalid email address. Please try again.'
        format.html { redirect_to :back }
        format.json { render json: @reserf.errors, status: :unprocessable_entity }
      end
    end
  end
end
