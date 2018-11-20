defmodule SpotifyratingWeb.MySongRatingView do
  use SpotifyratingWeb, :view

  alias SpotifyratingWeb.SongView

  def render("index.json", %{songs: songs, user_id: user_id}) do
    %{data: render_many(songs, SongView, "song.json"), user_id: user_id}
  end

  def render("show.json", %{song: song}) do
    %{data: render_one(song, SongView, "song.json")}
  end

end