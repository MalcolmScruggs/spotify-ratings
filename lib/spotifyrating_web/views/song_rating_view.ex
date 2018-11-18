defmodule SpotifyratingWeb.SongRatingView do
  use SpotifyratingWeb, :view
  alias SpotifyratingWeb.SongRatingView

  def render("index.json", %{song_ratings: song_ratings}) do
    %{data: render_many(song_ratings, SongRatingView, "song_rating.json")}
  end

  def render("show.json", %{song_rating: song_rating}) do
    %{data: render_one(song_rating, SongRatingView, "song_rating.json")}
  end

  def render("song_rating.json", %{song_rating: song_rating}) do
    %{id: song_rating.id,
      user_id: song_rating.user_id,
      song_id: song_rating.song_id,
      stars: song_rating.stars}
  end
end
