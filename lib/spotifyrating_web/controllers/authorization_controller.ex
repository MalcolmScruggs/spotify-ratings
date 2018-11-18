defmodule SpotifyratingWeb.AuthorizationController do
  use SpotifyratingWeb, :controller

  def authorize(conn, _params) do
    redirect conn, external: Spotify.Authorization.url
  end
end