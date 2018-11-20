defmodule SpotifyratingWeb.SavedSongsView do
  use SpotifyratingWeb, :view

  alias SpotifyratingWeb.SongView

  def render("index.json", %{saved_songs: saved_songs, user_id: user_id}) do
    %{data: render_many(saved_songs, SongView, "song.json"), user_id: user_id}
  end

  def render("show.json", %{saved_song: saved_song}) do
    %{data: render_one(saved_song, SongView, "song.json")}
  end

end