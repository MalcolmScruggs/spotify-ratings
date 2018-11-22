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
    x = Enum.chunk_every(songs, 100) #max limit of 100 per request
    |> Enum.map(fn s -> add_to_playlist(conn, user, playlist, s) end)
    |> List.last()
    IO.inspect(x)
  end

  defp add_to_playlist(conn, user, playlist, s) do
    body = Poison.encode!(%{uris: s})
    {:ok, resp} = Spotify.Playlist.add_tracks(conn, user.id, playlist.id, body, [])
  end
end