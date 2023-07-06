const imgsrcs = ["materials/gray_cat.png", "materials/orange_cat.png", "materials/blank.png"]
const gray_id = 0
const orange_id = 1
const empty_id = 2


let board_data = []
let dimension = 6
let max_num_bench = 8
let bench_count = []
let points_data = [0, 0]
let points_to_win = 5
let name1 = ""
let name2 = ""

const board = document.querySelector('#board')
const gray_bench = document.querySelector(`tr[data-bench="${gray_id}"]`)
const orange_bench = document.querySelector(`tr[data-bench="${orange_id}"]`)
const benches = [gray_bench, orange_bench]
const winnerDisplay = document.querySelector('#winner')
const form = document.querySelector('form')
const start_page = document.querySelector('.start_page')
const game_page = document.querySelector('.game_page')
const restart_button = document.querySelector('#restart')

function createBoard() {
    bench_count.push(max_num_bench)
    bench_count.push(max_num_bench)
    
    for(let i = 0; i < dimension; i++){
        const row = document.createElement('tr');
        row.setAttribute('class', 'row')
        let row_data = []
        for(let j = 0; j < dimension; j++){
            const cell = document.createElement('td')
            cell.dataset.row = i
            cell.dataset.col = j
            const img = document.createElement('img')
            img.src = imgsrcs[empty_id]
            row_data.push(empty_id)
            cell.appendChild(img)
            cell.addEventListener('click', placeKitten)
            cell.addEventListener('mouseover', indicatePushedKittens)
            cell.addEventListener('mouseout', removeBGColor)
            cell.addEventListener('click', removeBGColor) 
            row.appendChild(cell)
        }
        board_data.push(row_data)
        board.appendChild(row)
    }
    for(let i = 0; i < max_num_bench; i++){
        const td0 = document.createElement('td')
        td0.dataset.cell = i
        const gray_seat = document.createElement('img')
        gray_seat.src = imgsrcs[gray_id]
        td0.appendChild(gray_seat)
        benches[gray_id].appendChild(td0)

        const td1 = document.createElement('td')
        td1.dataset.cell = i
        const orange_seat = document.createElement('img')
        orange_seat.src = imgsrcs[orange_id]
        td1.appendChild(orange_seat)
        benches[orange_id].appendChild(td1)
    }
    diplayWhoPlaysNow()
}

let whos_turn = gray_id

function placeKitten(e){
    const row = this.dataset.row
    const col = this.dataset.col
    if(board_data[row][col] === empty_id && bench_count[whos_turn] > 0){
        //pull a kitten from the bench
        const cell = benches[whos_turn].querySelector(`td[data-cell='${bench_count[whos_turn]-1}']`)
        const img = cell.querySelector('img')
        img.src = imgsrcs[empty_id]
        --bench_count[whos_turn]
        //put the kitten to the board
        board_data[row][col] = whos_turn
        const imgElem = this.querySelector('img')
        imgElem.src = imgsrcs[whos_turn]
        playSound("placed_sound")
        pushAwayCats(row, col)
        setTimeout(check3Aligned, 2000);
        checkWinner()
        console.log("checked winner")       
        whos_turn = whos_turn == orange_id ? gray_id : orange_id
        diplayWhoPlaysNow()
    }
}

const dx = [-1, 0, 1, -1, 1, -1, 0, 1]
const dy = [-1, -1, -1, 0, 0, 1, 1, 1]

function pushAwayCats(centerRow, centerCol){
    for(let i = 0; i < dx.length; ++i){
        const from_row = parseInt(centerRow) + dy[i]
        const from_col = parseInt(centerCol) + dx[i]
        if(isInTable(from_row, from_col)){
            if(board_data[from_row][from_col] !== empty_id){
                const to_row = from_row + dy[i]
                const to_col = from_col + dx[i]

                const from_cell = board.querySelector(`td[data-row="${from_row}"][data-col="${from_col}"]`)
                const from_img = from_cell.querySelector('img')

                if(isInTable(to_row, to_col))
                {
                    if(board_data[to_row][to_col] === empty_id){
                        //handle data
                        board_data[to_row][to_col] = board_data[from_row][from_col]
                        board_data[from_row][from_col] = empty_id

                        //handle displaying the change
                        from_img.src = imgsrcs[empty_id]

                        const to_cell = board.querySelector(`td[data-row="${to_row}"][data-col="${to_col}"]`)
                        const to_img = to_cell.querySelector('img')
                        to_img.src = imgsrcs[board_data[to_row][to_col]]
                    }
                }
                else
                {
                    // to put back the kitten to the bench
                    const kitten_id = board_data[from_row][from_col]
                    const bench_seat = benches[kitten_id].querySelector(`td[data-cell='${bench_count[kitten_id]}']`)
                    const img_bench_seat = bench_seat.querySelector('img')
                    img_bench_seat.src = imgsrcs[kitten_id]

                    // to empty the cell
                    from_img.src = imgsrcs[empty_id]
                    board_data[from_row][from_col] = empty_id
                    ++bench_count[kitten_id]
                }
            }
            
        }
    }
}

function isInTable(i, j){
    return (i >= 0 && i < dimension && j >= 0 && j < dimension)
}

function check3Aligned(){
    let kittens_to_bench = new Set()
    let are_points_earned = false
    // check rows
    for(let i = 0; i < dimension; i++){
        for(let j = 0; j < dimension-2; j++){
            const cur = board_data[i][j]
            if(cur !== empty_id && cur === board_data[i][j+1] && board_data[i][j+2] === cur){
                ++points_data[cur]
                for(let k = 0; k < 3; k++){
                    kittens_to_bench.add(i.toString()+(j+k).toString())
                }
            }
        }
    }

    // check columns
    for(let i = 0; i < dimension-2; i++){
        for(let j = 0; j < dimension; j++){
            const cur = board_data[i][j]
            if(cur !== empty_id && board_data[i+1][j] === cur && board_data[i+2][j] === cur){
                ++points_data[cur]
                for(let k = 0; k < 3; k++){
                    kittens_to_bench.add((i+k).toString()+j.toString())
                }
            }
        }
    }

    //check diagonals
    for(let i = 0; i < dimension-2; i++){
        for(let j = 0; j < dimension-2; j++){
            const cur = board_data[i][j]
            if(cur !== empty_id && board_data[i+1][j+1] === cur && board_data[i+2][j+2] === cur){
                ++points_data[cur]
                for(let k = 0; k < 3; k++){
                    kittens_to_bench.add((i+k).toString()+(j+k).toString())
                }
            }
        }
    }

    // put kittens aligned to thier benches 
    for(const e of kittens_to_bench.values()){
        const row = parseInt(e[0])
        const col = parseInt(e[1])
        const kitten_id = board_data[row][col]

        const bench_seat = benches[kitten_id].querySelector(`td[data-cell='${bench_count[kitten_id]}']`)
        const img_bench_seat = bench_seat.querySelector('img')
        img_bench_seat.src = imgsrcs[kitten_id]

        // to empty the cell
        const cell = board.querySelector(`td[data-row="${row}"][data-col="${col}"]`)
        const img_cell = cell.querySelector('img')
        img_cell.src = imgsrcs[empty_id]
        board_data[row][col] = empty_id
        ++bench_count[kitten_id]
    }

    //display the points after the changes
    const gray_points_html = document.querySelector("#gray_point")
    const orange_points_html = document.querySelector("#orange_point")
    console.log(gray_points_html.innerHTML)
    gray_points_html.innerText = points_data[gray_id].toString()
    orange_points_html.innerText = points_data[orange_id].toString()
    console.log(gray_points_html.innerHTML)
    // sound effects
    if(kittens_to_bench.size > 0){
        console.log('points changed')
        console.log(`gray: ${points_data[gray_id]}, orange: ${points_data[orange_id]}`)
        playSound("earn_point_sound")
    }
}

function diplayWhoPlaysNow(){
    const player_now = document.querySelector("#play_now")
    const content = whos_turn === gray_id ? `${name1} (Gray)` : `${name2}(Orange)`
    player_now.innerText = content
    player_now.style.color = whos_turn === gray_id ? 'gray' : 'orange'
}

function checkWinner(){
    for(let i = 0; i < 2; i++){
        if(points_data[i] >= points_to_win){
            const content = i === gray_id ? `${name1}(Gray) Won!!` : `${name2}(Orange) Won!!`
            winnerDisplay.innerText = content + ` ${points_to_win} Points Reached.` 
            restart_button.style.display = 'block'
            break;
        }
        if(bench_count[i] <= 0){
            const content = i === orange_id ? `${name1}(Gray) Won!!` : `${name2}(Orange) Won!!`
            winnerDisplay.innerText = content + " The opponent ran out of kittens from their bench."
            restart_button.style.display = 'block'
            break;
        }
    }
}

function indicatePushedKittens(e){
    const centerRow = this.dataset.row
    const centerCol = this.dataset.col
    for(let i = 0; i < dx.length; ++i){
        const from_row = parseInt(centerRow) + dy[i]
        const from_col = parseInt(centerCol) + dx[i]
        if(isInTable(from_row, from_col)){
            if(board_data[from_row][from_col] !== empty_id){
                const to_row = from_row + dy[i]
                const to_col = from_col + dx[i]

                const from_cell = board.querySelector(`td[data-row="${from_row}"][data-col="${from_col}"]`)
                if(isInTable(to_row, to_col))
                {
                    if(board_data[to_row][to_col] === empty_id){
                        from_cell.style.backgroundColor = 'yellow'
                    }
                }
                else
                {
                    from_cell.style.backgroundColor = 'yellow'
                }
            }
        }
    }
}

function removeBGColor(){
    const centerRow = this.dataset.row
    const centerCol = this.dataset.col
    for(let i = 0; i < dx.length; ++i){
        const from_row = parseInt(centerRow) + dy[i]
        const from_col = parseInt(centerCol) + dx[i]
        if(isInTable(from_row, from_col)){
            const from_cell = board.querySelector(`td[data-row="${from_row}"][data-col="${from_col}"]`)
            from_cell.style.backgroundColor = ''
        }
    }
}

form.addEventListener("submit", (event) => {
    const inputs = form.elements
    name1 = inputs[0].value
    name2 = inputs[1].value
    points_to_win = inputs[2].value
    dimension = inputs[3].value
    max_num_bench = inputs[4].value

    
    start_page.style.display = 'none'
    game_page.style.display = 'block'
    
    const player1 = document.querySelector('#player1')
    player1.innerHTML = name1 + " " + player1.innerHTML
    const player2 = document.querySelector('#player2')
    player2.innerHTML = name2 + " " + player2.innerHTML
    createBoard()
    playSound("start_sound")
    event.preventDefault()
})

function playSound(id) {
    var sound = document.getElementById(id);
    sound.play();
}


restart_button.addEventListener('click', (e) => {
    board_data = []
    bench_count = []
    points_data = [0, 0]

    board.innerHTML = ''
    winnerDisplay.innerText = ''
    benches[gray_id].innerHTML = ''
    benches[orange_id].innerHTML = ''
    const gray_points_html = document.querySelector("#gray_point")
    const orange_points_html = document.querySelector("#orange_point")
    gray_points_html.innerText = '0'
    orange_points_html.innerText = '0'

    whos_turn = gray_id
    createBoard()
    e.preventDefault()
})