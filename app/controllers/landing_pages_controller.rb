class LandingPagesController < ApplicationController

	def index
	end

	def home
	end

	def listings
	#	puts "**********redirecting to " + offices_path
	#	redirect_to offices_path
    @offices = Office.order("created_at desc")
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
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @offices }
    end
  end

end
