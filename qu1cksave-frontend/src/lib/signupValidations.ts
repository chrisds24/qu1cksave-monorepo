// Based on https://firebase.google.com/docs/auth/web/password-auth#policy
const specialChars = new Set([
  '^','$','*','.','[',']','{','}','(',')','?','"','!','@','#','%','&','/','\\',
  ',', '>', '<', "'", ':', ';', '|', '_', '~'
]);

export function validatePassword(password: string) {
  if (!password) { // Check if empty
    return false;
  }

  // According to NIST, minimum w/o MFA should be 15 while maximum should be
  //   64+ (inclusive)  
  const length = password.length;
  if (length < 15 || length > 64) {
    return false;
  }

  // Do not allow whitespace in beginning and end of a password
  // - Firebase doesn't enforce this, but I'll just enforce it in my
  //   frontend
  if (password[0] === ' ' || password[length - 1] === ' ') {
    return false;
  }

  // Enforce at least one of each:
  // 1.) lowercase
  // 2.) uppercase
  // *** The two above imply at least one alphabetic char
  // 3.) numeric
  // 4.) special char (where only those in the specialChars set satisfies
  //     the requirement)
  // Note that other characters are still allowed such as + (plus sign) or a
  //   whitespace, it's just that they won't satisfy the special char req
  let hasLower = false;
  let hasUpper = false;
  let hasNumber = false;
  let hasSpecial = false;

  for (let i = 0; i < length; i++) {
    if (password[i] >= 'a' && password[i] <= 'z') {
      hasLower = true;
    } else if (password[i] >= 'A' && password[i] <= 'Z') {
      hasUpper = true;
    } else if (password[i] >= '0' && password[i] <= '9') {
      hasNumber = true;
    } else if (specialChars.has(password[i])) {
      hasSpecial = true;
    }
  }

  return hasLower && hasUpper && hasNumber && hasSpecial;
}

export function validateName(name: string) {
  if (!name) {
    return false;
  }

  const length = name.length;
  if (length > 255) {
    return false;
  }

  // Name cannot start with a space nor end with a space
  // - This guarantees that if stringAvatar receives a name, the first initial
  //   would be the beginning of this string and the second initial would be
  //   the first non-empty string after the first word when split is called
  // - When stringAvatar calls split, it keeps going
  //   through split's result until it finds a non-empty string
  //   -- Ex. If I call split on "h  yo", the resulting array becomes
  //      ["h", "", "yo"]. I want to make sure I get "yo"
  //   -- Kinda scuffed since the ideal stringAvatar should be able to tell
  //      when the last name starts, but I don't store last names :(
  if (name[0] === ' ' || name[length - 1] === ' ') {
    return false
  }

  // Name must contain at least two words. The condition above ensures that
  //   there's at least a non-empty string "word" at the end.
  const words = name.split(" ");
  if (words.length < 2) {
    return false;
  }

  return true;
}