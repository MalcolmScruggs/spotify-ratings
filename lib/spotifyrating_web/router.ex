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
    get "/album", AlbumController, :index
    get "/profile", ProfileController, :index

    get "/authorize", AuthorizationController, :authorize
    get "/authenticate", AuthenticationController, :authenticate
  end


  scope "/api/v1", SpotifyratingWeb do
    pipe_through :api

    resources "/song_ratings", SongRatingController, except: [:new, :edit]
    resources "/saved_songs", SavedSongsController, only: [:index]
  end

  # Other scopes may use custom stacks.
  # scope "/api", SpotifyratingWeb do
  #   pipe_through :api
  # end
end
