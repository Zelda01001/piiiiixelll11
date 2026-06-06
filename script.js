function get_result_from_cookie(){
    let cookies = document.cookie.split('; ')
    for (let i = 0; i < cookies.length; i += 1) {
        let cookie = cookies[i].split('=')
        if(cookie[0] == 'pixel-result'){
            return cookie[1]
        }
    }
    return '0' * 450
}
var IS_CLICKED = false
var CURRENT_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--current-color');
var CURRENT_COLORCODE = "1"
var DEFAULT_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--default-color');
var FILL_MODE = false
var COLORS = ['rgb(62, 62, 62)', 'rgb(255, 102, 46)', 'rgb(26, 218, 84)', 'rgb(83, 15, 255)', 'rgb(255, 236, 26)', 'rgb(142, 229, 255)', 'rgb(255, 171, 203)']

let field = document.querySelector('.field')
let temp_result = get_result_from_cookie()
if (temp_result != '0'){
    for (let i = 0; i < 450; i +=1){
        let cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('id', `${i}`)
        cell.dataset.color = temp_result[i]
        cell.style.backgroundColor = COLORS[parseInt(temp_result[i])]
        field.appendChild(cell)
    }
} else {
    for (let i = 0; i < 450; i +=1) {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('id', `${i}`)
        cell.dataset.color = '0'
        cell.style.backgroundColor = COLORS[0]
        field.appendChild(cell)
    }
}

document.addEventListener('mousedown', function(){
    IS_CLICKED = true
})
document.addEventListener('mouseup', function(){
    IS_CLICKED = false
})
let cells = document.querySelectorAll('.cell')
cells.forEach(cell => {
    cell.addEventListener('mouseover', function(){
        if (IS_CLICKED){
            anime({
                targets: cell,
                background: CURRENT_COLOR,
                duration: 200, 
                easing: 'linear'
            })
            cell.dataset.color = CURRENT_COLORCODE
        }
    })


cell.addEventListener('mousedown', function(){
    if (FILL_MODE){
        let cell_id = parseInt(cell.getAttribute('id'))
        FILL_MODE = !FILL_MODE
        anime({
            targets: '.cell',
            background: CURRENT_COLOR,
            easing: 'easeInOutQuad',
            duration: 500,
            delay: anime.stagger(50, {grid: [30, 15], from: cell_id}),
        })
        for (let i = 0; i <450; i += 1){
            cells[i].style.backgroundColor = CURRENT_COLORCODE
        }

    } else{
        anime({
            targets: cell,
            background: CURRENT_COLOR,
            duration: 500,
            easing: 'easeInOutQuad',
        })
        cell.style.backgroundColor = CURRENT_COLORCODE
    }
})
})
let color_cells = document.querySelectorAll('.color-cell')
color_cells.forEach (color_cell =>{
    color_cell.addEventListener('click', function(){
        FILL_MODE = false

        CURRENT_COLOR = getComputedStyle(color_cell).backgroundColor;
        CURRENT_COLORCODE = color_cell.dataset.colorcode

        document.documentElement.style.cssText = `--current-color: ${CURRENT_COLOR}`
        document.querySelector('.selected').classList.remove('selected')
        color_cell.classList.add('selected')
    })
})
let eraser = document.querySelector('.eraser')
eraser.addEventListener('click', function(){
    CURRENT_COLOR = DEFAULT_COLOR;
    CURRENT_COLORCODE = "0"
    document.documentElement.style.cssText= `--current-color: ${CURRENT_COLOR}`
    document.querySelector('.selected').classList.remove('selected')
    this.classList.add('selected')
})
let fill = document.querySelector('.fill-tool')
fill.addEventListener('click', function(){
    FILL_MODE = !FILL_MODE
    document.querySelector('.selected').classList.remove('selected')
    this.classList.add('selected')
})
document.querySelector('.save-tool').addEventListener('click', function(){
    domtoimage.toJpeg(field, {quality: 2})
    .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        let link = document.createElement('a');
        link.download = 'pixel.jpg';
        link.href = dataUrl;
        link.click();
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
})

setInterval(function(){
    result = ''
    let temp_cells = document.querySelectorAll('.cell')
    for (let i = 0; i < temp_cells.length; i += 1) {
        result += `${temp_cells[i].dataset.color}`
    }
    document.cookie = `pixel-result=${result};max-age=100000`
    console.log(document.cookie)
}, 60000)
