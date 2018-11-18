defmodule SpotifyratingWeb.AuthenticationController do
  use SpotifyratingWeb, :controller

  def authenticate(conn, params) do
    case Spotify.Authentication.authenticate(conn, params) do
      {:ok, conn } ->
        IO.inspect(conn)
        #TODO redirect
        redirect conn, to: "/"
      {:error, _reason, conn} -> redirect conn, to: "/error"
    end
  end
end