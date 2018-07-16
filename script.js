// const regex_ytPlaylist = new RegExp(/^.*(youtu.com\/|list=)([^#\&\?]*).*/)
const nbVideos = Array.from(document.querySelectorAll('#index')).pop().innerText

const times = Array
  .from(document.querySelectorAll('.style-scope.ytd-thumbnail-overlay-time-status-renderer'))
  .slice(1, nbVideos + 1)
  .map(item => item.innerText.replace('↵', '').trim().split(':').map(Number))
  .map(t => t.length === 2 ? [0].concat(t) : t)


const addTime = (acc, current, i) => {
  const [hours, minutes, seconds] = current
  console.log(`Video ${i + 1} => hours: ${hours} minutes: ${minutes} seconds: ${seconds}`)
  acc.s += seconds
  acc.m += minutes
  acc.h += hours
  return acc
}

const total = times.reduce(addTime, { h: 0, m: 0, s: 0 })
let { h, m, s } = total

let retainer = s - (s % 60)
s -= retainer

m += (retainer / 60)
retainer = m - (m % 60)
m -= retainer

h += (retainer / 60)
retainer = h - (h % 24)
h -= retainer

d = retainer / 24

console.log(`${d}d ${h}h ${m}m ${s}s`)
alert(`${d}d ${h}h ${m}m ${s}s`)
