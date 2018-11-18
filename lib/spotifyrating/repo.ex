defmodule Spotifyrating.Repo do
  use Ecto.Repo,
    otp_app: :spotifyrating,
    adapter: Ecto.Adapters.Postgres
end
