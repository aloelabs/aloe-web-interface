export function FormatAddress(address: string, characters: number = 4) {
  const maxChars = address.length / 2 - 2;
  if (characters > maxChars) {
    return address;
  }

  return `${address.substring(0, characters + 2)}...${address.substring(
    42 - characters
  )}`;
}

export function FormatAddressStart(address: string, characters: number = 4) {
  return `${address.substring(0, characters + 2)}...`;
}
