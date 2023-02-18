export const Follow = `
  transaction {
    prepare(acct: AuthAccount) {
      log("Hello from prepare")
    }
    execute {
      log("Hello from execute")
    }
  }
`;
