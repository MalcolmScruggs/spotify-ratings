defmodule SpotifyratingWeb.HomeController do
  use SpotifyratingWeb, :controller

  def index(conn, _params) do
      render(conn, "index.html", user_id: nil)
  end
end
