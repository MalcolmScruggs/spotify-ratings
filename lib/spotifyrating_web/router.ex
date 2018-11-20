defmodule SpotifyratingWeb.Router do
  use SpotifyratingWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug SpotifyratingWeb.Plugs.PutUserToken
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", SpotifyratingWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/my_song_ratings", PageController, :index
    get "/top_rated", PageController, :index

    get "/album", AlbumController, :index
    get "/profile", ProfileController, :index

    get "/authorize", AuthorizationController, :authorize
    get "/authenticate", AuthenticationController, :authenticate
    get "/logout", LogoutController, :logout
    get "/refresh", AuthenticationController, :refresh
  end


  scope "/api/v1", SpotifyratingWeb do
    pipe_through :api

    resources "/song_ratings", SongRatingController, except: [:new, :edit]
    get "/song/my_saved", SongController, :my_saved
    get "/song/my_ratings", SongController, :my_song_ratings
    get "/song/top_rated", SongController, :top_rated
  end
end
