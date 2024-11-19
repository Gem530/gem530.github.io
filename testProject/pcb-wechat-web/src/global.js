const globalData = {
  'platform': '',
  'windowWidth': 0,
  'windowHeight': '0px',
  'menuButtonInfo': {},
}
export function setGlobalData (key, val) {
  globalData[key] = val
}
export function getGlobalData (key) {
  return globalData[key]
}
