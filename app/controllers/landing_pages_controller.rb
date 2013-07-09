class LandingPagesController < ApplicationController

	def home
    @featured_offices = Office.where("featured = ?", "true");
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
    @sort = params[:sort]
    @direction = params[:dir]

    if (@search_string != "")
      @mappable_offices = Office.near(@search_string, 20)
      if (@mappable_offices.count == 0)
        @mappable_offices = Office.near(@search_string, 50)
      end
    else     
      @mappable_offices = Office.order('created_at DESC')
    end

    if(@sort == "rent")
      if(@direction == "asc")
        @offices = @mappable_offices.order('rent IS NULL, rent ASC')
      else
        @offices = @mappable_offices.order('rent IS NULL, rent DESC')
      end
    else
      @offices = @mappable_offices
    end

    @offices = @offices.page(params[:page])
    session[:query] = @offices.map(&:id)
    session[:search_results] = request.url

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
