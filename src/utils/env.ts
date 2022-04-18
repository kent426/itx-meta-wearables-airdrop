export function requiredEnv(name: string) {
  var og = process.env[name];
  var value = process.env[name];
  try {
    if (og) value = JSON.parse(og);
  } catch (e) {
    value = og;
  }

  if (!value) {
    throw new Error(
      'Missing "' + name + '" environment variable. Check your .env file'
    );
  }

  return value;
}
