class AuthUseCase {
  async auth (email) {
    if (!email) {
      throw new Error()
    }
  }
}

function makeSut () {
  return new AuthUseCase()
}

describe('Auth Use Case', () => {
  it('should throw Error if no email is provided', async () => {
    const sut = makeSut()
    await expect(sut.auth()).rejects.toThrow()
  })
})
