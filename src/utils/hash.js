import bcrypt from "bcrypt";

export async function hashPwd(password) {
  const saltRounds = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    // console.log("Password:", password);
    // console.log("Hash password:", hash);

    return hash;
  } catch (error) {
    console.log(err);
    throw err;
  }
}

export async function compareHashedPwd(password, hash) {
  try {
    const compare = await bcrypt.compare(password, hash);

    return compare;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
