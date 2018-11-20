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
    songs = fetch_and_sort_songs(conn, ratings)
    render(conn, "index.json", songs: songs, user_id: user.id)
  end

  def top_rated(conn, %{"offset" => offset}) do
    {:ok, user} = Spotify.Profile.me(conn)
    ratings = SongRatings.get_top_ratings(50, offset)
    if (!Enum.empty?(ratings)) do
      songs = fetch_and_sort_songs(conn, ratings)
      render(conn, "index.json", songs: songs, user_id: user.id)
    else
      IO.inspect("please lord")
      SpotifyratingWeb.FallbackController.call(conn, {:error, :no_content})
    end
  end

  defp fetch_and_sort_songs(conn, ratings) do
    ratings = Map.new(ratings, fn x -> {x.song_id, x.stars} end)

    ids = Map.keys(ratings)
          |> Enum.join(",")

    if ids != "" do
      {:ok, songs} = Spotify.Track.get_tracks(conn, ids: ids)
      songs = Enum.map(songs, fn track ->
        Map.put(track, :rating, Map.get(ratings, track.id, nil))
      end)
      Enum.sort_by(songs, fn x -> x.rating end)
      |> Enum.reverse #how to handle inverting sort_by clause
    end
  end

end