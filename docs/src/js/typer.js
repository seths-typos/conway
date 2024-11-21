function typeString (str) {
  for (const LTR in str) {
    let char = str[LTR].toUpperCase();
    if (char == " ") {
      GAME.addSpace();      
    } else {
      GAME.typeLetter(LETTERS[char]);
    }
  }

  GAME.redrawWorld()
}