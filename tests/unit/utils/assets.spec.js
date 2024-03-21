import { injectAsset, injectAssets } from '@/utils/assets'

describe('assets.js', () => {
  it('should define a script form Pym with a specify id', () => {
    expect(window.pym).toBeUndefined()
    injectAsset('https://pym.nprapps.org/pym.v1.min.js', 'pym-js')
    expect(document.querySelectorAll('#pym-js').length).toBe(1)
  })

  it('should define a script form Pym with a specify id only once', () => {
    expect(window.pym).toBeUndefined()
    injectAsset('https://pym.nprapps.org/pym.v1.min.js', 'pym-js')
    injectAsset('https://pym.nprapps.org/pym.v1.min.js', 'pym-js')
    expect(document.querySelectorAll('#pym-js').length).toBe(1)
  })

  it('should define a script form Pym once', () => {
    expect(window.pym).toBeUndefined()
    injectAsset('https://pym.nprapps.org/pym.v1.min.js')
    expect(
      document.querySelectorAll(
        'script[src="https://pym.nprapps.org/pym.v1.min.js"]'
      ).length
    ).toBe(1)
    injectAsset('https://pym.nprapps.org/pym.v1.min.js')
    expect(
      document.querySelectorAll(
        'script[src="https://pym.nprapps.org/pym.v1.min.js"]'
      ).length
    ).toBe(1)
  })

  it('should define a script form Pym once, even if we pass an array with duplicates', () => {
    injectAssets([
      'https://pym.nprapps.org/pym.v1.min.js',
      'https://pym.nprapps.org/pym.v1.min.js'
    ])
    expect(
      document.querySelectorAll(
        'script[src="https://pym.nprapps.org/pym.v1.min.js"]'
      ).length
    ).toBe(1)
  })

  it('should define two scripts', () => {
    injectAssets([
      'https://pym.nprapps.org/pym.v1.min.js',
      'https://pym.nprapps.org/pym.v1.js'
    ])

    expect(
      document.querySelectorAll('script[src^="https://pym.nprapps.org/pym.v1"]')
        .length
    ).toBe(2)
  })

  it('should define two stylesheets', () => {
    injectAssets([
      'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css',
      'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.css'
    ])

    expect(document.querySelectorAll('link[rel=stylesheet]').length).toBe(2)
  })

  it('should define two stylesheets, even with duplicates', () => {
    injectAssets([
      'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css',
      'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.css',
      'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.css'
    ])

    expect(document.querySelectorAll('link[rel=stylesheet]').length).toBe(2)
  })
})
