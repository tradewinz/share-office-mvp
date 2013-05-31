class OfficeMailer < ActionMailer::Base
  default from: "Intuit Spaces <spaces@intuit.com>"
  
  def add_listing_confirm(office)
  	@office = office
  	mail(:to => office.user.email, :subject => "Your listing was posted with Intuit Spaces")
    mail(:to => "kaushik_ghosh@intuit.com", :subject => "High-Five! Someone just added a listing @ Spaces")
  end

  def edit_listing_confirm(office)
    @office = office
    mail(:to => "kaushik_ghosh@intuit.com", :subject => "Someone just edited their listing")
  end

  def reserve_listing_confirm(office, current_user)
    @office = office
    @current_user = current_user
    mail(:to => office.user.email, :subject => "Someone just reserved your listing! ")
    mail(:to => "kaushik_ghosh@intuit.com", :subject => "High-Five! Someone just added reserved a listing")
  end
end
