class AlertMailer < ActionMailer::Base
  self.default :from => 'Intuit Spaces <spaces@intuit.com>'

  def match_found(office,alert)
  	@office = office
  	@alert = alert
  	mail(:to => alert.email, :subject => "Alert: space was found!")
  end

end
