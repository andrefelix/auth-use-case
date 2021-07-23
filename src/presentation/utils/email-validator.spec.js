class EmailValidator {
  isValid () {
    return true
  }
}

function makeSut () {
  return new EmailValidator()
}

describe('EmailValidator', () => {
  it('should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@mail.com')
    expect(isEmailValid).toBe(true)
  })
})
