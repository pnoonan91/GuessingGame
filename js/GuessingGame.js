function generateWinningNumber(){
    var winner = Math.random();
    
    if(winner > .01){
        return Math.trunc(winner * 100 + 1);
    } else{
        return 1;
    }
}

function shuffle(arr){
    var m = arr.length, t, i;
    
      // While there remain elements to shuffle…
      while (m) {
    
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
    
        // And swap it with the current element.
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
      }
    
      return arr;
}

var Game = function(){
    this.playersGuess = null,
    this.pastGuesses = [],
    this.winningNumber = generateWinningNumber()
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
    if(this.playersGuess - this.winningNumber > 0){
        return false;
    }else{
        return true;
    }
}

Game.prototype.playersGuessSubmission = function(guess){
    this.playersGuess = guess;

    if(guess < 1 || guess > 100 || typeof guess !== "number"){
        throw "That is an invalid guess.";
    }

    return this.checkGuess(guess);

}

Game.prototype.checkGuess = function(x){
    if(this.playersGuess === this.winningNumber){
        $('#headers h3').text("The winning number was: "+ this.winningNumber +"!Use the Reset button to play again!")
        $('#submit, #hint').prop('disabled', true);
        return "You Win!";
    }else if(this.pastGuesses.indexOf(this.playersGuess) !== -1){
        return "You have already guessed that number.";
    }else{
        this.pastGuesses.push(x);
        $('#guess-list li:nth-child('+this.pastGuesses.length+')').text(this.playersGuess);
    }

    if(this.pastGuesses.length === 5){
        $('#headers h3').text("The winning number was: "+ this.winningNumber +"! Use the Reset button to play again!")
        $('#submit, #hint').prop('disabled', true);
        return "You Lose.";
    }else if(this.difference() < 10){
        if(this.isLower()){
            $('#headers h3').text("Guess a higher number");
        }else{
            $('#headers h3').text("Guess a lower number");
        }
        return "You're burning up!";
    }else if(this.difference() < 25){
        if(this.isLower()){
            $('#headers h3').text("Guess a higher number");
        }else{
            $('#headers h3').text("Guess a lower number");
        }
        return "You're lukewarm.";
    }else if(this.difference() < 50){
        if(this.isLower()){
            $('#headers h3').text("Guess a higher number");
        }else{
            $('#headers h3').text("Guess a lower number");
        }
        return "You're a bit chilly.";
    }else{
        if(this.isLower()){
            $('#headers h3').text("Guess a higher number");
        }else{
            $('#headers h3').text("Guess a lower number");
        }
        return "You're ice cold!";
    }
}

function newGame(){
    return new Game;
}

Game.prototype.provideHint = function(){
    var returnArr = [];
    returnArr.push(this.winningNumber);
    returnArr.push(generateWinningNumber());
    returnArr.push(generateWinningNumber());
    return shuffle(returnArr);
}

function makeAGuess(game){
    var guess = $('#player-input').val();
    $('#player-input').val("");
    $('#main-title').text(game.playersGuessSubmission(parseInt(guess, 10)));
}

$(document).ready(function(){
    var game = new Game;

    $('#submit').on('click',function(){
        makeAGuess(game);
    });

    $('#player-input').keypress(function(e) {
        if(e.which == 13) {
            makeAGuess(game);
        }
    });

    $('#reset').on('click', function(){
        game = newGame();
        $('#submit, #hint').prop('disabled', false);
        $('#main-title').text("Spot the Sheep!");
        $('#headers h3').text("Guess how many sheep are in the field (1-100)");
        $('.guess').text("-");
    });

    $('#hint').on('click', function(){
        var hint = game.provideHint();
        $('#main-title').text("The winning number could be either " + hint[0] + ", " + hint[1] + ", or " + hint[2] +".");
    });

});