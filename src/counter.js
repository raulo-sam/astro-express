export function setupCounter(element) {
  if(!element) return
  let counter = 0
  const setCounter = (count) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element?.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}
