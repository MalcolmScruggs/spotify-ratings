defmodule SpotifyratingWeb.SongController do
  use SpotifyratingWeb, :controller
  plug SpotifyratingWeb.Plugs.Auth

  alias Spotifyrating.SongRatings, as: SongRatings

  action_fallback SpotifyratingWeb.FallbackController

  def my_saved(conn, %{"offset" => offset}) do
    {:ok, saved_tracks } = Spotify.Library.get_saved_tracks(conn, limit: 50, offset: offset)
    saved_tracks = saved_tracks.items
                   |> Enum.map(fn track ->
      Map.put(track, :rating, SongRatings.get_average_by_song_id(track.id))
    end)

    {:ok, user_id} = Spotify.Profile.me(conn)
    user_id = user_id.id
    render(conn, "index.json", songs: saved_tracks, user_id: user_id)
  end

  def my_song_ratings(conn, %{"offset" => offset}) do
    {:ok, user} = Spotify.Profile.me(conn)
    ratings = SongRatings.get_ratings_by_user_id(user.id, 50, offset)
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