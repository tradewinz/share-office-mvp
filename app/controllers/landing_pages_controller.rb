class LandingPagesController < ApplicationController

	def index
	end

	def home
	end

	def listings
		redirect_to offices_path
	end


	def owners
	end

end
