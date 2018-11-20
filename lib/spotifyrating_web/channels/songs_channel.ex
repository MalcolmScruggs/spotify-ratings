defmodule SpotifyratingWeb.SongsChannel do
  use SpotifyratingWeb, :channel

  alias Spotifyrating.SongRatings
  alias Spotifyrating.SongRatings.SongRating

  def join("song:" <> song_id, payload, socket) do
    if authorized?(payload) do
      {:ok, %{"join" => song_id}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("rate", %{"song_rating" => song_rating_params}, socket) do
    IO.inspect(song_rating_params)
    with {:ok, %SongRating{} = song_rating} <- SongRatings.create_song_rating(song_rating_params) do
      rating = SongRatings.get_average_by_song_id(song_rating.song_id)
      broadcast_from! socket, "new:msg", %{"song_id" => song_rating.song_id, "rating" => rating, "user_rating" => song_rating.stars}
      {:reply, {:ok, %{"song_id" => song_rating.song_id, "rating" => rating, "user_rating" => song_rating.stars}}, socket}
    end
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end