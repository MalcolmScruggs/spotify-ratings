defmodule SpotifyratingWeb.MySongRatingController do
  use SpotifyratingWeb, :controller
  plug SpotifyratingWeb.Plugs.Auth

  alias Spotifyrating.SongRatings, as: SongRatings

  action_fallback SpotifyratingWeb.FallbackController

  def index(conn, _params) do
    {:ok, user} = Spotify.Profile.me(conn)
    ratings = SongRatings.get_ratings_by_user_id(user.id, 50)
    |> Map.new(fn x -> {x.song_id, x.stars} end)

    ids = Map.keys(ratings)
    |> Enum.join(",")

    {:ok, songs} = Spotify.Track.get_tracks(conn, ids: ids)
    songs = Enum.map(songs, fn track ->
      Map.put(track, :rating, Map.get(ratings, track.id, nil))
    end)
    songs = Enum.sort_by(songs, fn x -> -x.rating end)
    render(conn, "index.json", songs: songs, user_id: user.id)
  end
end