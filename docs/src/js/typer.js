function typeString (str) {
  GAME.reset()
  for (const LTR in str) {
    let char = str[LTR];

    if (char == " ") {
      GAME.addSpace();      
    } else if (/[\n]/.test(char)) {
      GAME.carriageReturn();
    } else if (/[\-]/.test(char)){
        GAME.typeLetter(LETTERS[CUR_FONT]["-"], "m");
    } else if (/[\']/.test(char)){
        GAME.typeLetter(LETTERS[CUR_FONT]["Quote"], "t");    
    } else if (/[\"]/.test(char)){
        GAME.typeLetter(LETTERS[CUR_FONT]["DoubleQuote"], "t");    
    } else if (/[*^]/.test(char)){
        GAME.typeLetter(LETTERS[CUR_FONT][char], "t");    
    } else if (/[\d]/.test(char)){
        GAME.typeLetter(LETTERS[CUR_FONT]["Digit" + char]);    
    } else {
      GAME.typeLetter(LETTERS[CUR_FONT][char]);
    }
  }

  GAME.redrawWorld()
}
