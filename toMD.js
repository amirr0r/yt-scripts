const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const fs        = require('fs')

const handleError = err => err 
  ? console.error(err)
  : console.log('Saved !')

if (process.argv.length === 2)
{
  console.log(`Usage : node script.js <youtube-playlist-url>`)
} else {
  
  const regex_ytPlaylist = new RegExp(/^.*(youtu.com\/|list=)([^#\&\?]*).*/)
  const playlistName = process.argv[2]

if (playlistName.match(regex_ytPlaylist))
{
  nightmare
    .goto(playlistName)
    .evaluate(() => Array
      .from(document.querySelectorAll('#video-title'))
      .map(t => t.textContent.trim())
    )
    .end()
    .then(titles => titles
      .forEach((t, i) => fs.writeFile(`${i < 10 ? '0' + i : i }-${t}.md`, `# ${t}`, handleError))
    )
    .catch(err => console.error('Search failed:', err))

  } else {
    console.error('Youtube Playlist URL invalid')
  }
}