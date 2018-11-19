defmodule SpotifyratingWeb.SavedSongsView do
  use SpotifyratingWeb, :view
#  alias SpotifyratingWeb.SavedSongsView

  def render("index.json", %{saved_songs: saved_songs, user_id: user_id}) do
    %{songs: render_many(saved_songs, SpotifyratingWeb.SavedSongsView, "saved_song.json"), user_id: user_id}
  end

  def render("show.json", %{saved_song: saved_song}) do
    %{data: render_one(saved_song, SpotifyratingWeb.SavedSongsView, "saved_song.json")}
  end

  def render("saved_song.json", %{saved_songs: song}) do
    artists = song.artists
    |> Enum.map_join(", ", &(Map.fetch!(&1, "name")))
    album = song.album
    |> Map.fetch!("name")

    %{id: song.id,
      name: song.name,
      artists: artists,
      album: album,
      rating: song.rating}
  end
end