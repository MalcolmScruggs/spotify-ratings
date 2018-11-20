defmodule SpotifyratingWeb.SongView do
  use SpotifyratingWeb, :view

  def render("index.json", %{songs: songs}) do
    %{data: render_many(songs, SpotifyratingWeb.SongView, "song.json")}
  end

  def render("show.json", %{song: song}) do
    %{data: render_one(song, SpotifyratingWeb.SongView, "song.json")}
  end

  def render("song.json", %{song: song}) do
    artists = song.artists
    |> Enum.map_join(", ", &(Map.fetch!(&1, "name")))
    album = song.album
    |> Map.fetch!("name")

#    IO.inspect(song)
    %{id: song.id,
      name: song.name,
      artists: artists,
      album: album,
      rating: song.rating}
  end
end