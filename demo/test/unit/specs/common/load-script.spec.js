import loadScript from '@/common/js/utils/load-script'

describe('utils/load-script', () => {

  it('load single file', () => {
    const url = 'a.js'

    loadScript(url)

    const script = document.getElementsByTagName('script')[0]
    expect(script.src).toBe(`http://localhost/${url}`)

    // 清除script标签，不然影响之后的子集测试
    script.parentNode.removeChild(script)
  })

  it('load multiple files', () => {
    const urls = [
      'a.js',
      'b.js',
      'c.js'
    ]

    loadScript(urls)

    const scripts = document.getElementsByTagName('script')
    for (let i = 0, len = scripts.length; i < len; i++) {
      const script = scripts[i]
      expect(script.src).toBe(`http://localhost/${urls[i]}`)
    }
  })

  it('param format error', () => {
    return loadScript(
      { src: 'a.js' }
    ).catch(err => {
      expect(err).toBe('js path format error')
    })
  })
})