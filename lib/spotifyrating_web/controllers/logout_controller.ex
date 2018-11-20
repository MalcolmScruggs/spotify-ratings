defmodule SpotifyratingWeb.LogoutController do
  use SpotifyratingWeb, :controller

  import Plug.Conn

  def logout(conn, params) do
    conn
    |> configure_session(drop: true)
    Phoenix.Controller.redirect conn, external: "https://accounts.spotify.com/en/logout"
  end
end