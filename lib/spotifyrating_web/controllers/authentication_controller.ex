defmodule SpotifyratingWeb.AuthenticationController do
  use SpotifyratingWeb, :controller

  def authenticate(conn, params) do
    case Spotify.Authentication.authenticate(conn, params) do
      {:ok, conn } ->
        redirect conn, to: "/"
      {:error, _reason, conn} -> redirect conn, to: "/error"
    end
  end

  def refresh(conn, _params) do
    case Spotify.Authentication.refresh(conn) do
      {:ok, conn } ->
        IO.inspect(conn)
        #TODO redirects when token expires
        redirect conn, to: "/"
      {:unauthorized, _reason, conn} -> redirect conn, to: "/authorize"
      end
    end
end