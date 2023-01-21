class CheckValidUserNameService {
  public async execute(userName: string): Promise<Boolean> {
    let regex = new RegExp(/^\w+$/);

    return regex.test(userName);
  }
}

export default CheckValidUserNameService
