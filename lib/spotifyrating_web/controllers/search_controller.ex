defmodule SpotifyratingWeb.SearchController do
  use SpotifyratingWeb, :controller
  plug SpotifyratingWeb.Plugs.Auth

  alias Spotifyrating.SongRatings, as: SongRatings

  action_fallback SpotifyratingWeb.FallbackController

  def search(conn, %{"query" => query, "offset" => offset}) do
    {:ok, search} = Spotify.Search.query(conn, q: query, type: "track", limit: 50, offset: offset)
    if (search && !Enum.empty?(search.items)) do
      search = search.items
      |> Enum.map(fn track ->
        Map.put(track, :rating, SongRatings.get_average_by_song_id(track.id))
      end)
      conn
      |> put_view(SpotifyratingWeb.SongView)
      |> render("index.json", songs: search)
    else
      SpotifyratingWeb.FallbackController.call(conn, {:error, :no_content})
    end
  end
end