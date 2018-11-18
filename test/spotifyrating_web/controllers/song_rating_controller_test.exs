defmodule SpotifyratingWeb.SongRatingControllerTest do
  use SpotifyratingWeb.ConnCase

  alias Spotifyrating.SongRatings
  alias Spotifyrating.SongRatings.SongRating

  @create_attrs %{
    song_id: 42,
    stars: 42,
    user_id: 42
  }
  @update_attrs %{
    song_id: 43,
    stars: 43,
    user_id: 43
  }
  @invalid_attrs %{song_id: nil, stars: nil, user_id: nil}

  def fixture(:song_rating) do
    {:ok, song_rating} = SongRatings.create_song_rating(@create_attrs)
    song_rating
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all song_ratings", %{conn: conn} do
      conn = get(conn, Routes.song_rating_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create song_rating" do
    test "renders song_rating when data is valid", %{conn: conn} do
      conn = post(conn, Routes.song_rating_path(conn, :create), song_rating: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.song_rating_path(conn, :show, id))

      assert %{
               "id" => id,
               "song_id" => 42,
               "stars" => 42,
               "user_id" => 42
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.song_rating_path(conn, :create), song_rating: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update song_rating" do
    setup [:create_song_rating]

    test "renders song_rating when data is valid", %{conn: conn, song_rating: %SongRating{id: id} = song_rating} do
      conn = put(conn, Routes.song_rating_path(conn, :update, song_rating), song_rating: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.song_rating_path(conn, :show, id))

      assert %{
               "id" => id,
               "song_id" => 43,
               "stars" => 43,
               "user_id" => 43
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, song_rating: song_rating} do
      conn = put(conn, Routes.song_rating_path(conn, :update, song_rating), song_rating: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete song_rating" do
    setup [:create_song_rating]

    test "deletes chosen song_rating", %{conn: conn, song_rating: song_rating} do
      conn = delete(conn, Routes.song_rating_path(conn, :delete, song_rating))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.song_rating_path(conn, :show, song_rating))
      end
    end
  end

  defp create_song_rating(_) do
    song_rating = fixture(:song_rating)
    {:ok, song_rating: song_rating}
  end
end
