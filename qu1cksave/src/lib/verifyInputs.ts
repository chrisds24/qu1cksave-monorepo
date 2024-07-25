
// ---------- Passwords ----------
// https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
// - Minimum 8 chars, maximum of at least 64 chars
// https://stackoverflow.com/questions/98768/should-i-impose-a-maximum-length-on-passwords
// - Don't impose a limit. It's less secure
// - ME: I could probably just limit the amount of memory that can be used
//   in a request (Ex. I had a 2000 mb limit for the API), and just say
//   something about the request size being too big (or just say "Error
//   Processing Request", since most users wouldn't even reach this size
//   unless they're purposely trying to test the limits of the app)