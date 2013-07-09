class LandingPagesController < ApplicationController

	def home
    @featured_offices = Office.where("featured = ?", true).limit(4);

    track_event("Visited Homepage")
  end

  def about
    track_event("Visited AboutUs")
  end

  #	handle finding listing here separately
	def listings

    #Paginated queries
    #@offices = Office.where("loc_zip = ?", params[:city]).page(params[:page])
    @search_string = params[:city]

    if (@search_string != "")
      @offices = Office.near(@search_string, 20).page(params[:page])
      @mappable_offices = Office.near(@search_string, 20)
      if (@offices.count == 0)
        @offices = Office.near(@search_string, 50).page(params[:page])
        @mappable_offices = Office.near(@search_string, 50)
      end
    else
      @offices = Office.order('created_at DESC').page(params[:page])
      @mappable_offices = Office.all
    end
    session[:query] = @offices.map(&:id)


    @json = @mappable_offices.to_gmaps4rails do |office, marker|
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
