/* global variables */

var cards = [];
var pos = 0;
var reachedEnd = false;
var hasFirstRowLabels = false;
var labels = [];

$(document).ready(function() {

  /* handle button clicks */

  $('#button-load-file').click( function () {
    console.log("Changed file input");
    if (! window.FileReader) {
      return alert( 'FileReader API is not supported by your browser.' );
    }
    var $i = $('#file-input'),
    input = $i[0];

    hasFirstRowLabels = $('#checkbox-1st-row-labels').is(':checked');
    console.log("Has first row labels: " + hasFirstRowLabels);
    
    if (input.files && input.files[0]) {
      file = input.files[0]; // The file
      fr = new FileReader(); // FileReader instance
      fr.readAsText(file);
      
      fr.onload = function () {
        cards = $.csv.toArrays(fr.result);
        if (hasFirstRowLabels) {
          labels = cards.splice(0, 1); // pop first element
          console.log(labels);
        }
        console.log(cards);
        pos = 0;
        reachedEnd = false;
        $('#section-load-deck').css('display','none');
        $('[id^=section-button-display]').css('display','initial');
        $('#button-choose-file').css('display','initial');
        $('#button-shuffle').addClass('button-shuffle-highlight');
        $('#card-output').prepend("<p class='output-info'>Loaded deck '" + escape(file.name) + "' in default order</p>");
      };
    } else {
      alert( "No file to read. If you've chosen a file, your browser may not be supported." )
    }
  }); 

  $('#button-shuffle').click( function () {
    console.log("Clicked shuffle button");
    cards = shuffle(cards);
    console.log(cards);
    $('#button-draw').css('display','initial').css('visibility','inherit');
    $('#card-output').prepend("<p class='output-info'>Shuffled deck</p>");
  });

  $('#button-draw').click( function () {
    console.log("Clicked draw button");
    checkReachedEnd();

    if (!reachedEnd) {
      card = drawCard();
      console.log(card);

      if (hasFirstRowLabels) {
        cardText = "";
        for (i = 0; i < card.length; i++) {
          if (i < labels[0].length) {
            cardText += "<strong>" + labels[0][i] + "</strong>: " + card[i] + "<br/>";
          }
          else {
            cardText += card[i] + "<br/>";
          }  
        }
        
        console.log(cardText);
        $('#card-output').prepend("<p id='card-at-pos-" + pos + "' class='output-card'>"
          + cardText + "</p>");
      } else {
        $('#card-output').prepend("<p id='card-at-pos-" + pos + "' class='output-card'>" + card + "</p>");
      }
      
      if (pos > 0) {
        previousCard = '#card-at-pos-' + (pos-1);
        $(previousCard).addClass('output-card-visited');
        $('#button-restart').css('display','initial');
      }
    } else {
      console.log("Reached end of deck");
      $('#button-draw').css('visibility','hidden');
    }
  }); // end button-draw

  $('#button-restart').click( function () {
    console.log("Clicked restart button");
    $('#button-draw').css('display','initial').css('visibility','inherit');
    $('#card-output').prepend("<p class='output-info'>Restarted deck with current shuffle order</p>");
    pos = 0;
    reachedEnd = false;
  });

  $('#button-stats').click( function () {
    console.log("Clicked stats button");
    $('#card-output').prepend("<p class='output-info'>Deck has " + cards.length + " cards. You've drawn " 
      + pos + (pos === 1 ? " card" : " cards") + " so far.</p>");
  });

  $('#button-choose-file').click( function () {
    console.log("Clicked choose file button");
    $('#section-load-deck').css('display','initial');
    $('#button-choose-file').css('display','none');
  });

  $('#button-clear').click( function () {
    console.log("Clicked clear button");
    $('#card-output').empty();
  });

  $('#button-create-log').click( function () {
    console.log("Clicked create log button");
    newWindow = window.open('', 'csv-shuffle log', 'width = 500, height = 500')
    newWindowContent = $('#card-output').html();
    $(newWindow.document.body).html(newWindowContent);
  });  
}) // end document ready

/* helpers */

function checkReachedEnd() {
  if (pos >= cards.length) {
    reachedEnd = true;
    $('#card-output').prepend("<p class='output-info'>Reached end of deck - shuffle or restart</p>");
    $('#button-shuffle').addClass('button-shuffle-highlight');
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
    $('#button-shuffle').removeClass('button-shuffle-highlight');
    return array;  
};
