defmodule SpotifyratingWeb.PageController do
  use SpotifyratingWeb, :controller
  plug SpotifyratingWeb.Plugs.Auth

  alias Spotifyrating.SongRatings, as: SongRatings

  def index(conn, _params) do
    {:ok, saved_tracks } = Spotify.Library.get_saved_tracks(conn, limit: 10)
    saved_tracks = saved_tracks.items
    |> Enum.map(fn track ->
      Map.put(track, :rating, SongRatings.get_average_by_song_id(track.id))
    end)

    {:ok, user_id} = Spotify.Profile.me(conn)
    user_id = user_id.id

#    IO.inspect(saved_tracks)
#    IO.inspect(id)
    render(conn, "index.html", saved_tracks: saved_tracks, user_id: user_id)
  end
end
