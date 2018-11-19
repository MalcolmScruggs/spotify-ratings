defmodule SpotifyratingWeb.PageController do
  use SpotifyratingWeb, :controller
  plug SpotifyratingWeb.Plugs.Auth

  alias Spotifyrating.SongRatings, as: SongRatings

  def index(conn, _params) do
#    {:ok, saved_tracks } = Spotify.Library.get_saved_tracks(conn, limit: 50)
#    saved_tracks = saved_tracks.items
#    |> Enum.map(fn track ->
#      Map.put(track, :rating, SongRatings.get_average_by_song_id(track.id))
#    end)
#
#    {:ok, user_id} = Spotify.Profile.me(conn)
#    user_id = user_id.id

    #TODO channels for updating ratings
    #TODO top of all song ratings
    #TODO refactor controllers to make sense for various pages
    #TODO handle song pagenation
#    render(conn, "index.html", saved_tracks: saved_tracks, user_id: user_id)
    render(conn, "index.html")
  end
end
