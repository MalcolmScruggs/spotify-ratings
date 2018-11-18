defmodule SpotifyratingWeb.ProfileController do
  use SpotifyratingWeb, :controller
  plug SpotifyratingWeb.Plugs.Auth

  def index(conn, _params) do
    {:ok, profile} = Spotify.Profile.me(conn)
    {:ok, another_profile} = Spotify.Profile.user(conn, "12182580077")

    render conn, "index.html", profile: profile, another_profile: another_profile
  end

end