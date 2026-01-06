declare module 'pym.js' {
  // type retrieved from : https://pym.nprapps.org/pym.v1.js
  type Parent = (id: string, url: string, config: any) => any
  export class Child {
    constructor(options: any)
    sendHeight(): void
  }
}
