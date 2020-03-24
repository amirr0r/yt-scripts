// const regex_ytPlaylist = new RegExp(/^.*(youtu.com\/|list=)([^#\&\?]*).*/)
const nbVideos = Array.from(document.querySelectorAll('#index')).pop().innerText
//const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1

const times = Array
  .from(document.querySelectorAll('.style-scope.ytd-thumbnail-overlay-time-status-renderer'))
  .map(v => v.textContent)
  .map(item => item.replace('↵', '').trim().split(':').map(Number))
  .filter(t => t.length === 2 || t.length === 3)
  .map(t => t.length === 2 ? [0].concat(t) : t)


const addTime = (acc, current, i) => {
  const [hours, minutes, seconds] = current
  console.log(`Video ${i + 1} => hours: ${hours} minutes: ${minutes} seconds: ${seconds}`)
  acc.s += seconds
  acc.m += minutes
  acc.h += hours
  return acc
}

const total = times.reduce(addTime, { d: 0, h: 0, m: 0, s: 0 })
console.log(total)
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

console.log(`${d}day${d > 1 ? 's' : ''} ${h}h ${m}m ${s}s`)
alert(`${d}day${d > 1 ? 's' : ''} ${h}h ${m}m ${s}s`)
