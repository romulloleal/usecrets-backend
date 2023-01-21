class PasswordCheckService {
  public async execute(password: string): Promise<Boolean> {
    return !!password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%* #+=\(\)\^?&])[A-Za-z\d$@$!%*_#+=\(\)\^?&]{3,}$/);
  }
}

export default PasswordCheckService;
