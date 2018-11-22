defmodule SpotifyratingWeb.SongRatingController do
  use SpotifyratingWeb, :controller

  alias Spotifyrating.SongRatings
  alias Spotifyrating.SongRatings.SongRating

  action_fallback SpotifyratingWeb.FallbackController

  def index(conn, _params) do
    song_ratings = SongRatings.list_song_ratings()
    render(conn, "index.json", song_ratings: song_ratings)
  end

  def create(conn, %{"song_rating" => song_rating_params}) do
    with {:ok, %SongRating{} = song_rating} <- SongRatings.create_song_rating(song_rating_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.song_rating_path(conn, :show, song_rating))
      |> render("show.json", song_rating: song_rating)
    end
  end

  def show(conn, %{"id" => id}) do
    song_rating = SongRatings.get_song_rating!(id)
    render(conn, "show.json", song_rating: song_rating)
  end

  def update(conn, %{"id" => id, "song_rating" => song_rating_params}) do
    song_rating = SongRatings.get_song_rating!(id)

    with {:ok, %SongRating{} = song_rating} <- SongRatings.update_song_rating(song_rating, song_rating_params) do
      render(conn, "show.json", song_rating: song_rating)
    end
  end

  def delete(conn, %{"id" => id}) do
    song_rating = SongRatings.get_song_rating!(id)

    with {:ok, %SongRating{}} <- SongRatings.delete_song_rating(song_rating) do
      send_resp(conn, :no_content, "")
    end
  end
end
