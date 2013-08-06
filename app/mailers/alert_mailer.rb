class AlertMailer < ActionMailer::Base
  self.default :from => 'Intuit Spaces <spaces@intuit.com>'

  def confirm(alert)
  	@alert = alert
  	mail(:to => alert.email, :subject => "Thank you for signing up for #{alert.city} alerts!")
  end


  def match_found(office,alert)
  	@office = office
  	@alert = alert
  	mail(:to => alert.email, :subject => "Alert: space was found!")
  end

end
