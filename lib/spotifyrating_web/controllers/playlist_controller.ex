defmodule SpotifyratingWeb.PlaylistController do
  use SpotifyratingWeb, :controller
  plug SpotifyratingWeb.Plugs.Auth

  action_fallback SpotifyratingWeb.FallbackController

  def create_playlist(conn, params) do
    with {:ok, %Spotify.Playlist{} = _playlist} <- create(conn, params) do
      conn
      |> put_status(:created)
      |> put_view(SpotifyratingWeb.ErrorView)
      |> render(:"playlist created")
    end
  end

  defp create(conn, %{"title" => title, "songs" => songs}) do
    {:ok, user} = Spotify.Profile.me(conn)
    body = Poison.encode!(%{name: title, public: true})
    {:ok, playlist} = Spotify.Playlist.create_playlist(conn, user.id, body)
    track_body = Poison.encode!(%{uris: songs})
    Spotify.Playlist.add_tracks(conn, user.id, playlist.id, track_body, [])
  end
end