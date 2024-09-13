export function assertInRange(from: string, to: string, value: string): boolean {
    let _value = toNum(value)
    if (Number(_value) > Number(from)) {
      if (Number(_value) < Number(to)) {
        return true
      }  
    }
    return false
  }
  export function toNum(numString: string): number {
    let postString = String(numString).split('EUR')
    let matches = String(postString[0].match(/\d+/g))
    return Number(matches)
  }