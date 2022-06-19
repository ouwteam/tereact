export function env(key: string): string {
  var output = process.env[key] ? process.env[key] : "";
  if (output == undefined) {
    return "";
  }

  return output.toString();
}
