class ContactHost < ActionMailer::Base
  self.default :from => 'Intuit Spaces <spaces@intuit.com>'

  def contact_host(guest)
  	@guest = guest
  	@office = Office.find(guest.office_id)
  	mail(:to => @office.user.email, :subject => "Someone wants to rent your space!")
  end
end
