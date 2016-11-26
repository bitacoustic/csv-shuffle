var cards = [];
var pos = 0;
var reachedEnd = false;

$(document).ready(function() {
  $('#button-file-load').click( function () {
    console.log("Clicked load button");
    if ( ! window.FileReader ) {
      return alert( 'FileReader API is not supported by your browser.' );
    }
    var $i = $('#file-input'),
    input = $i[0];
    if ( input.files && input.files[0] ) {
      file = input.files[0]; // The file
      fr = new FileReader(); // FileReader instance
      fr.readAsText(file);
      fr.onload = function () {
        cards = $.csv.toArrays(fr.result);
        console.log(cards);
        $('#section-card-display').css('display','initial');
        $('#card-output').prepend("<p class='output-info'>Loaded deck '" + escape(file.name) + "' in default order</p>");
      };

    } else {
      alert( "No file to read. If you've chosen a file, your browser may not be supported." )
    }
  }); // end $( '#file-load' ).click( function () { }

  $('#button-shuffle').click( function () {
    console.log("Clicked shuffle button");
    cards = shuffle(cards);
    console.log(cards);
    $('#button-draw').css('display','initial');
    $('#button-draw').css('visibility','inherit');
    $('#card-output').prepend("<p class='output-info'>Shuffled deck</p>");
  });

  $('#button-restart').click( function () {
    console.log("Clicked restart button");
    $('#button-draw').css('display','initial');
    $('#button-draw').css('visibility','inherit');
    $('#card-output').prepend("<p class='output-info'>Restarted deck with current shuffle order</p>");
    pos = 0;
    reachedEnd = false;
  });

  $('#button-stats').click( function () {
    console.log("Clicked stats button");
    $('#card-output').prepend("<p class='output-info'>Deck has " + cards.length + " cards. You've drawn " 
      + pos + (pos === 1 ? " card" : " cards") + " so far.</p>");
  });

  $('#button-draw').click( function () {
    console.log("Clicked draw button");
    checkReachedEnd();
    if (!reachedEnd) {
      card = drawCard();
      console.log(card);
      $('#card-output').prepend("<p id='card-at-pos-" + pos + "' class='output-card'>" + card + "</p>");
      if (pos > 0) {
        previousCard = '#card-at-pos-' + (pos-1);
        $(previousCard).addClass('output-card-visited');
        $('#button-restart').css('display','initial');
      }
    } else {
      console.log("Reached end of deck");
      $('#button-draw').css('visibility','hidden');
    }
  });

  $('#button-clear').click( function () {
    console.log("Clicked clear button");
    $('#card-output').empty();
  });

}) // end document ready

/* helpers */

function checkReachedEnd() {
  if (pos >= cards.length) {
    reachedEnd = true;
    $('#card-output').prepend("<p class='output-info'>Reached end of deck - shuffle or restart</p>");
  }
}

function drawCard() {
  console.log("Drawing card at position " + pos);
  return cards[pos++];  
}

function shuffle(array) {
    counter = array.length;

    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    reachedEnd = false;
    pos = 0;
    return array;  
};
