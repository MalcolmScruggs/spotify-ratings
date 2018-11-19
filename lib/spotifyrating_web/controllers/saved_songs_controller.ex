defmodule SpotifyratingWeb.SavedSongsController do
  use SpotifyratingWeb, :controller
  plug SpotifyratingWeb.Plugs.Auth

  alias Spotifyrating.SongRatings, as: SongRatings

  action_fallback SpotifyratingWeb.FallbackController

  def index(conn, %{"offset" => offset}) do
    {:ok, saved_tracks } = Spotify.Library.get_saved_tracks(conn, limit: 50, offset: offset)
    if Map.has_key?(saved_tracks, "error") do
#      redirect conn, to: "/authorize"
#      send_resp(conn, :error, "")
    else
      saved_tracks = saved_tracks.items
                     |> Enum.map(fn track ->
        Map.put(track, :rating, SongRatings.get_average_by_song_id(track.id))
      end)

      {:ok, user_id} = Spotify.Profile.me(conn)
      user_id = user_id.id

      #TODO channels for updating ratings
      #TODO top of all song ratings
      #TODO refactor controllers to make sense for various pages
      #TODO handle song pagenation
      #TODO better handling of user id
      render(conn, "index.json", saved_songs: saved_tracks, user_id: user_id)
    end
  end
end