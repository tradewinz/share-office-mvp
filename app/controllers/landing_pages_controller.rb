class LandingPagesController < ApplicationController

	def index
	end

	def home
	end

	def listings
		puts "**********redirecting to " + offices_path
		redirect_to offices_path
	end


	def owners
	end

end
