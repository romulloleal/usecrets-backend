class CheckValidEmailService {
  public async execute(email: string): Promise<Boolean> {
    let validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if(email.match(validEmail)) return true
    else return false
  }
}

export default CheckValidEmailService
