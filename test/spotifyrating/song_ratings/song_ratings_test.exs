defmodule Spotifyrating.SongRatingsTest do
  use Spotifyrating.DataCase

  alias Spotifyrating.SongRatings

  describe "song_ratings" do
    alias Spotifyrating.SongRatings.SongRating

    @valid_attrs %{song_id: 42, stars: 42, user_id: 42}
    @update_attrs %{song_id: 43, stars: 43, user_id: 43}
    @invalid_attrs %{song_id: nil, stars: nil, user_id: nil}

    def song_rating_fixture(attrs \\ %{}) do
      {:ok, song_rating} =
        attrs
        |> Enum.into(@valid_attrs)
        |> SongRatings.create_song_rating()

      song_rating
    end

    test "list_song_ratings/0 returns all song_ratings" do
      song_rating = song_rating_fixture()
      assert SongRatings.list_song_ratings() == [song_rating]
    end

    test "get_song_rating!/1 returns the song_rating with given id" do
      song_rating = song_rating_fixture()
      assert SongRatings.get_song_rating!(song_rating.id) == song_rating
    end

    test "create_song_rating/1 with valid data creates a song_rating" do
      assert {:ok, %SongRating{} = song_rating} = SongRatings.create_song_rating(@valid_attrs)
      assert song_rating.song_id == 42
      assert song_rating.stars == 42
      assert song_rating.user_id == 42
    end

    test "create_song_rating/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = SongRatings.create_song_rating(@invalid_attrs)
    end

    test "update_song_rating/2 with valid data updates the song_rating" do
      song_rating = song_rating_fixture()
      assert {:ok, %SongRating{} = song_rating} = SongRatings.update_song_rating(song_rating, @update_attrs)
      assert song_rating.song_id == 43
      assert song_rating.stars == 43
      assert song_rating.user_id == 43
    end

    test "update_song_rating/2 with invalid data returns error changeset" do
      song_rating = song_rating_fixture()
      assert {:error, %Ecto.Changeset{}} = SongRatings.update_song_rating(song_rating, @invalid_attrs)
      assert song_rating == SongRatings.get_song_rating!(song_rating.id)
    end

    test "delete_song_rating/1 deletes the song_rating" do
      song_rating = song_rating_fixture()
      assert {:ok, %SongRating{}} = SongRatings.delete_song_rating(song_rating)
      assert_raise Ecto.NoResultsError, fn -> SongRatings.get_song_rating!(song_rating.id) end
    end

    test "change_song_rating/1 returns a song_rating changeset" do
      song_rating = song_rating_fixture()
      assert %Ecto.Changeset{} = SongRatings.change_song_rating(song_rating)
    end
  end
end
