for (let i = 10; i > 0; i--) {
    let block = document.createElement('div');
    block.setAttribute('class', 'block animate');
    block.setAttribute('id', 'block' + i);
    document.getElementById('game').append(block);
}