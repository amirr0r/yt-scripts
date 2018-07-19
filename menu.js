const Nightmare = require('nightmare')
const readline  = require('readline-sync')
const ytdl      = require('ytdl-core')
const fs        = require('fs')

const nightmare = Nightmare()

const handleError = err => err
  ? console.error(err)
  : console.log('Saved !')

/*******************************************
 toMd : create md files with video titles  *     
********************************************/

const toMD = playlistName => nightmare
  .goto(playlistName)
  .evaluate(() => Array
    .from(document.querySelectorAll('#video-title'))
    .map(t => t.textContent.trim())
  )
  .end()
  .then(titles => titles
    .forEach((t, i) => fs.writeFile(`${i < 10 ? '0' + i : i} - ${t}.md`, `# ${t}`, handleError))
  )
  .catch(console.error)

/**************************************************
 howLong : give the total duration of the playlist 
**************************************************/
const addTime = (acc, current, i) => {
  const [hours, minutes, seconds] = current
  console.log(`Video ${i + 1} => hours: ${hours} minutes: ${minutes} seconds: ${seconds}`)
  acc.s += seconds
  acc.m += minutes
  acc.h += hours
  return acc
}

const sumTimes = times => {
  console.log(`${times.length} video(s) in the playlist.\n`)

  const total = times.reduce(addTime, { d: 0, h: 0, m: 0, s: 0 })
  let { d, h, m, s } = total

  let retainer = s - (s % 60)
  s -= retainer

  m += (retainer / 60)
  retainer = m - (m % 60)
  m -= retainer

  h += (retainer / 60)
  retainer = h - (h % 24)
  h -= retainer

  d = retainer / 24

  console.log(`\nDuration : ${d} day${d > 1 ? 's' : ''} ${h}h ${m}m ${s}s`)
}

const howLong = playlistName => nightmare
  .goto(playlistName)
  .wait(300)
  .evaluate(() => {
    const nbVideos = Array.from(document.querySelectorAll('#index')).pop().innerText

    const times = Array
      .from(document.querySelectorAll('.style-scope.ytd-thumbnail-overlay-time-status-renderer'))
      .slice(0, nbVideos + 1)
      .map(item => item.innerText.replace('↵', '').trim().split(':').map(Number))
      .map(t => t.length === 2 ? [0].concat(t) : t)
    
    return times
  })
  .end()
  .then(sumTimes)
  .catch(console.error)
  
/*******************************************
 download : download all videos into mp3/mp4 
********************************************/
// Shortest Playlist : https://www.youtube.com/playlist?list=PLHJH2BlYG-EEBtw2y1njWpDukJSTs8Qqx
  
const download = playlistName => nightmare
.goto(playlistName)
.wait(300)
.evaluate(() => Array
  .from(document.querySelectorAll('.yt-simple-endpoint.style-scope.ytd-playlist-video-renderer'))
  .map((a, i) => ({ i: i + 1, t: a.innerText.trim().split('\n')[1], l: a.href }))
)
.end()
.then(links => links
  .map(a => ytdl(a.l, { filter: (format) => format.container === 'mp4' })
    .pipe(fs.createWriteStream(`${a.i < 10 ? '0' + a.i : a.i} - ${a.t}.mp4`))
    .on('open', () => console.log(`${a.i < 10 ? '0' + a.i : a.i} - ${a.t}.mp4 is saved !`))
  )
).catch(console.error)

/************************************************
 menu : ask which function the user wants to run 
************************************************/
const goodChoice = choice => choice === '1' || choice === '2' || choice === '3'

const menu = (playlistName) => {
  let choice = process.argv[3] 

  while (!choice || !goodChoice(choice)) {
    choice = readline.question(`
    1) Get the total duration of a youtube playlist
    2) Create md files with video titles
    3) Download videos (mp3/mp4)
    4) Do all this

    Choose an option : `)
    if (!goodChoice(choice)) console.log('/!\\ Please enter a number between 1 & 4 !')
  }
  switch (Number(choice)) {
    case 1:
      console.log('Please wait a little bit...\n')
      howLong(playlistName)
      break;

    case 2:
      console.log('Please wait a little bit...\n')
      toMD(playlistName)
      break;
      
    case 3:
      console.log('Please wait...\n')
      download(playlistName)
      break;
      
    case 4:
      console.log('Please wait...\n')
      howLong(playlistName)
      toMD(playlistName)
      download(playlistName)
      break;

    default:
      break;
  }
}

/************************************************
 main
************************************************/
if (process.argv.length === 2) {
  console.log(`Usage : node script.js <youtube-playlist-url> [option]`)
} else {

  const regex_ytPlaylist = new RegExp(/^.*(youtu.com\/|list=)([^#\&\?]*).*/)
  const playlistName = process.argv[2]

  if (playlistName.match(regex_ytPlaylist)) {
    menu(playlistName)
  } else {
    console.error('Youtube Playlist URL invalid')
  }
}