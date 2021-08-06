class Encrypter {
  async compare (value, hash) {
    return true
  }
}

function makeSut () {
  return new Encrypter()
}

describe('Encrypter', () => {
  it('should return true if bcryt returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })
})
