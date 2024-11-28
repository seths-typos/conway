function typeString (str) {
  for (const LTR in str) {
    let char = str[LTR];
    console.log(char,LETTERS[CUR_FONT])
    if (char == " ") {
      GAME.addSpace();      
    } else {
      GAME.typeLetter(LETTERS[CUR_FONT][char]);
    }
  }

  GAME.redrawWorld()
}
