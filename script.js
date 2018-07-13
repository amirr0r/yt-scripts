const regex_ytPlaylist = new RegExp(/^.*(youtu.com\/|list=)([^#\&\?]*).*/)
/* 
const url = "https://www.youtube.com/watch?v=pSEax6Rr-xI&list=PL2972E0D013FE7DE7aaa"
if (url.match(regex_ytPlaylist))
  console.log('match !')
else
  console.log('no match !')
*/

const nbVideos = Array.from(document.querySelectorAll('#index')).pop().innerText

const times = Array
  .from(document.querySelectorAll('.style-scope.ytd-thumbnail-overlay-time-status-renderer'))
  .slice(0, nbVideos)
  .map(item => item.innerText.replace('↵', '').trim().split(':').map(Number))
  .map(t => t.length === 2 ? [0].concat(t) : t)


const addTime = (acc, current) => {
  const [hours, minutes, seconds] = current
  console.log(`hours: ${hours} minutes: ${minutes} seconds: ${seconds}`)
  acc.s += seconds
  acc.m += minutes
  acc.h += hours
  return acc
}

const total = times.reduce(addTime, { h: 0, m: 0, s: 0 })
let { h, m, s } = total // { h: 1, m: 315, s: 713 }

let retainer = s - (s % 60) // 713 - (713 % 60)= 660
s -= retainer // 713 - 660 = 53

m += (retainer / 60) // 315 + (660 / 60) = 326
retainer = m - (m % 60) // 326 - (326 % 60)= 300
m -= retainer // 326 - 300 = 26

h += (retainer / 60) // 1 + (300 / 60) = 6

console.log(`${h}h ${m}m ${s}s`) // 6h 26m 53s
alert(`${h}h ${m}m ${s}s`) // 6h 26m 53s