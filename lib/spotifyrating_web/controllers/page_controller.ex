defmodule SpotifyratingWeb.PageController do
  use SpotifyratingWeb, :controller
  plug SpotifyratingWeb.Plugs.Auth

  def index(conn, _params) do
    {:ok, user} = Spotify.Profile.me(conn)
    if Map.has_key?(user, "error") do
      IO.inspect(user);
      redirect conn, external: Spotify.Authorization.url
    else
      render(conn, "index.html", user_id: user.id)
    end
  end
end
