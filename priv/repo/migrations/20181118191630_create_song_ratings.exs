defmodule Spotifyrating.Repo.Migrations.CreateSongRatings do
  use Ecto.Migration

  def change do
    create table(:song_ratings) do
      add :user_id, :integer
      add :song_id, :string
      add :stars, :integer

      timestamps()
    end

    create index(:song_ratings, [:user_id, :song_id], unique: true)
#    create constraint(:song_ratings, :song_rating_in_range, check: "stars >= 1 && ")
  end
end
