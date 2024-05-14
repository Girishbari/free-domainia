export default function generateID() {
  const universalString = "123456789qwertyuiopasdfghjklzxcvbnm";
  const length = 5;
  let id = "";
  for (let i = 0; i < length; i++) {
    id += universalString[Math.floor(Math.random() * universalString.length)];
  }
  return id;
}
