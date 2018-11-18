# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Spotifyrating.Repo.insert!(%Spotifyrating.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias Spotifyrating.Repo
alias Spotifyrating.SongRatings.SongRating

#Chum - Earl Sweatshirt
Repo.insert!(%SongRating{user_id: 1221915052, song_id: "6plT7nFGiXKSBP9HFSI4ef", stars: 4})
Repo.insert!(%SongRating{user_id: 123, song_id: "6plT7nFGiXKSBP9HFSI4ef", stars: 5})
Repo.insert!(%SongRating{user_id: 1234, song_id: "6plT7nFGiXKSBP9HFSI4ef", stars: 3})
Repo.insert!(%SongRating{user_id: 12345, song_id: "6plT7nFGiXKSBP9HFSI4ef", stars: 5})

#Hard Times - Asher Roth
Repo.insert!(%SongRating{user_id: 1221915052, song_id: "70tx7rxuCS7gtVlOfLd2p4", stars: 5})