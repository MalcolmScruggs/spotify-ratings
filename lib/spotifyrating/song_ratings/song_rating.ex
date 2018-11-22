defmodule Spotifyrating.SongRatings.SongRating do
  use Ecto.Schema
  import Ecto.Changeset

  schema "song_ratings" do
    field :song_id, :string
    field :stars, :integer
    field :user_id, :string

    timestamps()
  end

  @doc false
  def changeset(song_rating, attrs) do
    song_rating
    |> cast(attrs, [:user_id, :song_id, :stars])
    |> validate_required([:user_id, :song_id, :stars])
    |> unique_constraint(:user_id, name: :song_ratings_user_id_song_id_index)
  end
end
