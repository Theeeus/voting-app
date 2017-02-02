function showInput() {
    document.getElementById('voteNew').style.display = 'block';
}

function addInput() {
    var p = document.getElementById('newPollOptions');
    p.insertAdjacentHTML('beforeend', '<input class="inputNew" type="text" name="options" required/>');
}