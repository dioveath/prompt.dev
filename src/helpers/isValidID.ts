function isValidID(id: string | undefined) {
  if (!id) return false;
  // simply match the id from regular expression
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  } else {
    return false;
  }
}

export { isValidID };
