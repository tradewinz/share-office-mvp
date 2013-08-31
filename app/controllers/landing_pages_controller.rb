class LandingPagesController < ApplicationController

	def home
    # must be true for staging and "true" for local
    @featured_offices = Office.where(featured:true)
    if (@featured_offices.length % 2 != 0)
      @featured_offices.pop
    end
    session[:query] = @featured_offices.map(&:id)
    session[:featured] = home_path
    track_event("Visited Homepage")
    @alert = Alert.new
  end

  def about
    track_event("Visited AboutUs")
  end

  #	handle finding listing here separately
	def listings
    @alert = Alert.new

    #Paginated queries
    #@offices = Office.where("loc_zip = ?", params[:city]).page(params[:page])
    @search_string = params[:city]
    @sort = params[:sort]
    @direction = params[:dir]
    @rentto = params[:rentto]
    @rentfrom = params[:rentfrom]
    
    if (@rentto == nil)  
      @rentto = '10000' 
    end 
    if(@rentfrom == nil) 
      @rentfrom = '0' 
    end
    
    activefilter = 'active_flag != 0'
    rentfilter = 'rent >=  ? AND rent <= ?'

    #@offices = Office.near(@search_string, 20, :order => 'rent IS NULL, rent > 0, rent ASC').where(activefilter).where(rentfilter, @rentfrom, @rentto).page(params[:page])
    
    if (@search_string != "")
         @offices = Office.near(@search_string, 20).where(rentfilter, @rentfrom, @rentto).where(activefilter).page(params[:page])
    else    
        @offices =  Office.order('created_at DESC').where(rentfilter, @rentfrom, @rentto).where(activefilter).page(params[:page])
    end

    session[:query] = @offices.map(&:id)
    session[:search_results] = request.url

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
