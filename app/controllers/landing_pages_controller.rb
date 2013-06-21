class LandingPagesController < ApplicationController

	def home
    track_event("Visited Homepage")
  end

  def about
    track_event("Visited AboutUs")
  end

  #	handle finding listing here separately
	def listings

    #Paginated queries
    #@offices = Office.where("loc_zip = ?", params[:city]).page(params[:page])
    if (params[:city] != "")
      @offices = Office.near(params[:city], 20).page(params[:page])
      if (@offices.count == 0)
        @offices = Office.near(params[:city], 50).page(params[:page])
      end
    else
      @offices = Office.order('created_at DESC').page(params[:page])

    end

    @json = @offices.to_gmaps4rails do |office, marker|

      marker.infowindow render_to_string(:partial => "/offices/infowindow", :locals => { :office => office})
      marker.title "#{office.title}"
      marker.picture({ :picture => "/assets/office-building.png", :width =>32, :height => 32})

    end

    track_event("Viewed Search Results")
    respond_to do |format|
      format.html # listings.html.erb
      format.json { render json: @offices }
    end
	end


end
