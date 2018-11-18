defmodule Spotifyrating.SongRatings do
  @moduledoc """
  The SongRatings context.
  """

  import Ecto.Query, warn: false
  alias Spotifyrating.Repo

  alias Spotifyrating.SongRatings.SongRating

  @doc """
  Returns the list of song_ratings.

  ## Examples

      iex> list_song_ratings()
      [%SongRating{}, ...]

  """
  def list_song_ratings do
    Repo.all(SongRating)
  end


  def get_average_by_song_id(song_id) do
    query = from sr in SongRating,
      where: sr.song_id == ^song_id
    Repo.aggregate(query, :avg, :stars)
  end

  @doc """
  Gets a single song_rating.

  Raises `Ecto.NoResultsError` if the Song rating does not exist.

  ## Examples

      iex> get_song_rating!(123)
      %SongRating{}

      iex> get_song_rating!(456)
      ** (Ecto.NoResultsError)

  """
  def get_song_rating!(id), do: Repo.get!(SongRating, id)

  @doc """
  Creates a song_rating.

  ## Examples

      iex> create_song_rating(%{field: value})
      {:ok, %SongRating{}}

      iex> create_song_rating(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_song_rating(attrs \\ %{}) do
    %SongRating{}
    |> SongRating.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a song_rating.

  ## Examples

      iex> update_song_rating(song_rating, %{field: new_value})
      {:ok, %SongRating{}}

      iex> update_song_rating(song_rating, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_song_rating(%SongRating{} = song_rating, attrs) do
    song_rating
    |> SongRating.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a SongRating.

  ## Examples

      iex> delete_song_rating(song_rating)
      {:ok, %SongRating{}}

      iex> delete_song_rating(song_rating)
      {:error, %Ecto.Changeset{}}

  """
  def delete_song_rating(%SongRating{} = song_rating) do
    Repo.delete(song_rating)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking song_rating changes.

  ## Examples

      iex> change_song_rating(song_rating)
      %Ecto.Changeset{source: %SongRating{}}

  """
  def change_song_rating(%SongRating{} = song_rating) do
    SongRating.changeset(song_rating, %{})
  end
end
