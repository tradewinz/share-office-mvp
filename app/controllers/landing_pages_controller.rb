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
      format.html # index.html.erb
      format.json { render json: @offices }
    end
	end

  def maps
    #	puts "**********redirecting to " + offices_path
    #	redirect_to offices_path
    @json = Office.all.to_gmaps4rails do |office, marker|

      marker.infowindow render_to_string(:partial => "/offices/infowindow", :locals => { :office => office})
      marker.title "#{office.title}"
      # marker.json({ :description => office.description})
      # marker.picture({:picture => "http://mapicons.nicolasmollet.com/     wp-content/uploads/mapicons/shape-default/color-3875d7/shapeco     lor-color/shadow-1/border-dark/symbolstyle-contrast/symbolshad     owstyle-dark/gradient-iphone/information.png",
      #               :width => 32,
      #               :height => 32})
    end
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @offices }
    end
  end

	def owners
	end

end
