ShareOfficeMvp::Application.routes.draw do
  namespace :alerts do
    resources :confirm_unsubscribes
  end


  resources :reserves


  resources :alerts


  devise_for :users, controllers: {omniauth_callbacks: "omniauth_callbacks"}

  mount RailsAdmin::Engine => '/admin', :as => 'rails_admin'

  match '/home', to: 'landing_pages#home'

  match '/listings', to: 'landing_pages#listings'

  match '/about', to: 'landing_pages#about'
  match '/confirm', to: 'offices#confirm'
  match '/reserve/:id', to:'offices#reserve'

  match '/alerts/:id/unsubscribe', to: 'alerts#unsubscribe', :as => :unsubscribe_alert

  resources :offices

  mount Attachinary::Engine => "/attachinary"

  match "/blog" => redirect("http://spacesblog.tumblr.com/"), :as => :blog
  match "/system/whatsup" => redirect("https://intuitspaces.geckoboard.com/loop/A25BE5157A61EC93"), :as => :whatsup

  # resources :users


  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'landing_pages#home'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
