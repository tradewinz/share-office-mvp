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
    #@offices = Office.order("created_at desc")
    @offices = Office.order('created_at DESC').page(params[:page])

    track_event("Viewed ListView")
    respond_to do |format|
      format.html # listings.html.erb
      format.json { render json: @offices }
    end
	end

  def maps
    #	redirect_to offices_path
    @json = Office.all.to_gmaps4rails do |office, marker|

      marker.infowindow render_to_string(:partial => "/offices/infowindow", :locals => { :office => office})
      marker.title "#{office.title}"
      marker.picture({ :picture => "/assets/office-building.png", :width =>32, :height => 32})

    end
    track_event("Viewed MapView")
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @offices }
    end
  end

end
