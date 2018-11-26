defmodule Spotifyrating.Repo.Migrations.CreateSongRatings do
  use Ecto.Migration

  def change do
    create table(:song_ratings) do
      add :user_id, :string, null: false
      add :song_id, :string, null: false
      add :stars, :integer, null: false

      timestamps()
    end

    create index(:song_ratings, [:user_id, :song_id], unique: true)
  end
end
