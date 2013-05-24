class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  attr_accessible :name, :phone, :fname, :lname, :company, :location, :connections, :description, :industry, :website, :photo

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates(:email, presence: true, format: { with: VALID_EMAIL_REGEX })
  validates(:name, presence: true)


  has_many :office

  def self.from_omniauth(auth)
    where(auth.slice(:provider, :uid)).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.nickname
      user.email = auth.info.email
      user.fname = auth.info.first_name
      user.lname = auth.info.last_name
      user.location = auth.info.location.name
      user.description = auth.info.description

      user.website = auth.info.urls.public_profile
      user.industry = auth.extra.raw_info.industry
      user.photo = auth.info.image

    end
  end

  # create an account automatically from the session data which contains user info
  def self.new_with_session(params, session)
    if session["devise.user_attributes"]
      new(session["devise.user_attributes"], without_protection: true) do |user|
        user.attributes = params
        user.valid?
      end
    else
      super
    end
  end

  # ignore password required if sign-in from linkedin or facebook
  def password_required?
    super && provider.blank?
  end

  # lets users update profile if they are from linkedin or facebook
  def update_with_password(params, *options)
    if encrypted_password.blank?
      update_attributes(params, *options)
    else
      super
    end
  end

end
