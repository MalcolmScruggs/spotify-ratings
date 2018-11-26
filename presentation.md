##Intro
Purpose: add ratings to songs

What API: Spotify

##Live Demo
Features:
- rate songs
- view saved songs
- view rated songs (ordered)
- view top rated songs (ordered)
- search
- create playlists (option and show in Spotify app)
- live updating (demo with multiple users/private channel)

##Features in depth
#####Rate songs:
- Songs fetched via API call w/ JSON
- Done via channels (public vs private)
```javascript
let channel = this.socket.channel(`song:${song.id}`);
channel.join();
```
- Tested and works well with hundreds of songs. Not sure how it will scale/potential problems in future.

#####Viewing Songs
- Database stores user_id, song_id
- Spotify API prevents storing song meta-data
- Must call API with each song id to get the information
- Have to load in 50's (so my API mirrors Spotify's offset)
- Some more complicated queries, (fetching globally top rated 50 songs)
```elixir
    query = from sr in SongRating,
      group_by: :song_id,
      select: %{song_id: sr.song_id, stars: avg(sr.stars)},
      order_by: [desc: 2], #second col (b/c group_by)
      limit: ^limit,
      offset: ^offset
    Repo.all(query)
```
- BENEFIT: results come back sorted
- Handling loading all songs (send response code with result)


#####Creating playlists
- 1 API to make the playlist (get back id)
- Add songs to playlist
- COMPLICATION: only 100 songs added max by Spotify, but I support many. 
- SOLUTION: chunk song id's by 100, and make multiple API calls


#####Creating reusable React component
- API call to load songs at construction (via props)
- Optional props to handle search
- PROBLEM: API calls/channel messages come to unmounted component
- SOLUTION: Leverage React life-cycle
   - componentDidMount: make API call and join channels
   - componentWillUnmount: cancel API calls and leave channels
   ```javacript
       constructor() {
            ...
           this.CancelToken = axios.CancelToken; //for canceling axios request
           this.source = this.CancelToken.source(); //for canceling axios request
           ...
       }
   
       componentWillUnmount() {
           this.source.cancel();
           this.channels.forEach((channel) => {
               channel.leave(); //leave any previously joined channels
           });
       }
   ```
   
#####Handling authentication
https://developer.spotify.com/assets/AuthG_AuthoriztionCode.png
```Elixir
#Authorization
defmodule SpotifyratingWeb.AuthorizationController do
  use SpotifyratingWeb, :controller

  def authorize(conn, _params) do
    redirect conn, external: Spotify.Authorization.url
  end
end


#Authentication
defmodule SpotifyratingWeb.AuthenticationController do
  use SpotifyratingWeb, :controller

  def authenticate(conn, params) do
    case Spotify.Authentication.authenticate(conn, params) do
      {:ok, conn } ->
        redirect conn, to: "/top_rated"
      {:error, _reason, conn} -> redirect conn, to: "/error"
    end
  end
end
```

#Questions?
