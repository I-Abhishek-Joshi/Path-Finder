let container = document.querySelector(".container");
let grid = document.querySelector(".grid");
let prevBoxId = "none";
let startBoxId = 'box_0_0';
let targetBoxId = 'box_29_29';

let dist = [];
let visited = [];
let par = [];
let cnt = 0;
let pathFinding = 0;
let pathSearching = 0;
let resetDone = 1;
let temp_cnt = 0;

let currentAlgorithm = "Dijkstra's algorithm";
let currentSpeed = 3;

let start = document.querySelector('#start');
let reset = document.querySelector('#reset');

let selectAlgorithms = document.querySelector('#selectAlgorithms')
let algorithms = document.querySelector('#algorithms')
let algoOptions = document.querySelectorAll('.algoOptions')

let selectSpeeds = document.querySelector('#selectSpeeds')
let speeds = document.querySelector('#speeds')
let speedOptions = document.querySelectorAll('.speedOptions')


let wrapUp = (container, tempClass) => {
    document.querySelector(`${tempClass} .up`).classList.add('hide');
    document.querySelector(`${tempClass} .down`).classList.remove('hide');
    container.classList.add('hide');
 }

selectAlgorithms.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('.dropdown-algorithms .down').classList.toggle('hide');
    document.querySelector('.dropdown-algorithms .up').classList.toggle('hide');
    algorithms.classList.toggle('hide');
})
for(let cityOption of algoOptions){
    cityOption.addEventListener('click', (e) => {
        e.stopPropagation();
        let tempAlgo = cityOption.children[0].innerText;
        selectAlgorithms.children[0].innerText = tempAlgo;
        currentAlgorithm = tempAlgo;
        wrapUp(algorithms, '.dropdown-algorithms');
    })
}

selectSpeeds.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('yes');

    document.querySelector('.dropdown-speeds .down').classList.toggle('hide');
    document.querySelector('.dropdown-speeds .up').classList.toggle('hide');
    speeds.classList.toggle('hide');
})
for(let speed of speedOptions){
    speed.addEventListener('click', (e) => {
        e.stopPropagation();
        let tempspeed = speed.children[0].innerText;
        selectSpeeds.children[0].innerText = tempspeed;
        if(tempspeed === 'Slow'){
            currentSpeed = 15;
        }else if(tempspeed == 'Medium'){
            currentSpeed = 7;
        }else{
            currentSpeed = 2;
        }
        console.log(currentSpeed);
        wrapUp(speeds, '.dropdown-speeds');
    })
}

window.addEventListener('click', () => {
    wrapUp(algorithms, '.dropdown-algorithms');
    wrapUp(speeds, '.dropdown-speeds');
})




let initialize = () => {
    
    for(let i = 0; i < 30; i++)
    {
        dist[i] = [10];
        par[i] = [10];
        visited[i] = [10]
        for(let j = 0; j < 30; j++){
            dist[i][j] = Number.POSITIVE_INFINITY;
            visited[i][j] = false;
            par[i][j] = 'box_-1_-1';

        }
    }

    for(let i = 0; i < 30; i++){
        let newRow = document.createElement('DIV');
        newRow.classList = 'row';
        for(let j = 0; j < 30; j++){
            let newBox = document.createElement('DIV');
            newBox.classList = 'box';
            newBox.id = 'box' + '_' +  i + '_' + j;
            if(i == 0 && j == 0){
                newBox.classList += ' start';
            }
            else if(i == 29 && j == 29){
                newBox.classList += ' target';
            }

            newRow.appendChild(newBox);
        }
        grid.appendChild(newRow);
    }
}
initialize();

let isStart = false, isTarget = false;
grid.addEventListener('dragstart', (e) => {
    let currBoxId = e.target.id;
    if(currBoxId === startBoxId){
        isStart = true;
    }else if(currBoxId === targetBoxId){
        isTarget = true;
    }
})
grid.addEventListener('dragover', (e) => {
    let currBoxId = e.target.id;
    if(isStart === true){
        if(currBoxId != targetBoxId){
            let prevBox = document.getElementById(startBoxId);
            prevBox.classList.remove('start');
            startBoxId = currBoxId;
            e.target.classList.add('start');
            e.target.classList.remove('wall');
        }
        
    }else if(isTarget === true){
        if(currBoxId !== startBoxId){
            let prevBox = document.getElementById(targetBoxId);
            prevBox.classList.remove('target');
            targetBoxId = currBoxId;
            e.target.classList.add('target');
            e.target.classList.remove('wall');
        }
            
    }else{
        if(currBoxId !== startBoxId && currBoxId != targetBoxId && prevBoxId !== currBoxId){
            prevBoxId = currBoxId;
            e.target.classList.toggle('wall');
        }
    }
        
})
grid.addEventListener('dragend', (e) => {
    isStart = false;
    isTarget = false;
})
grid.addEventListener('click', (e) => {
    let currBoxId = e.target.id;
    if(currBoxId == startBoxId){
        console.log('YES');
    }
    if(!e.target.classList.contains('start') && !e.target.classList.contains('target')){
        e.target.classList.toggle('wall');
    }
})

let getCordinates = (s) => {
    let pos = 4;
    let fst = "", snd = "";
    while(s[pos] >= '0' && s[pos] <= '9' || s[pos] == '-'){
        fst += s[pos];
        pos++;
    }
    pos++;
    while(pos < s.length){
        snd += s[pos];
        pos++;
    }
    return [parseInt(fst), parseInt(snd)];
}

class MinHeap {
    heap = [];
    constructor () {
        this.heap = [null]
    }
    getMin () {
        return this.heap[1]
    }
    insert (node) {
        this.heap.push(node)
        
        if (this.heap.length > 1) {
            let current = this.heap.length - 1
            while (current > 1 && this.heap[Math.floor(current/2)][0] > this.heap[current][0]) {
                [this.heap[Math.floor(current/2)], this.heap[current]] = [this.heap[current], this.heap[Math.floor(current/2)]]
                current = Math.floor(current/2)
            }
        }
    }
    remove() {
        if(this.heap.length > 2){
            this.heap[1] = this.heap[this.heap.length - 1];
            this.heap.splice(this.heap.length - 1); 

            let current = 1;
            let leftIndex = 2 * current, rightIndex = 2 * current + 1;

            while(true){
                if(leftIndex < this.heap.length && rightIndex < this.heap.length 
                    && this.heap[leftIndex] < this.heap[current] || this.heap[rightIndex] < this.heap[current]){
                        if(this.heap[leftIndex][0] <= this.heap[rightIndex][0]){
                            [this.heap[current], this.heap[leftIndex]] = [this.heap[leftIndex], this.heap[current]];
                            current = leftIndex;
                        }else{
                            [this.heap[current], this.heap[rightIndex]] = [this.heap[rightIndex], this.heap[current]];
                            current = rightIndex;
                        }
                    }
                else if(leftIndex < this.heap.length && this.heap[leftIndex][0] < this.heap[current][0]){
                    [this.heap[current], this.heap[leftIndex]] = [this.heap[leftIndex], this.heap[current]];
                    current = leftIndex;
                }else{
                    break;
                }

                leftIndex = 2 * current;
                rightIndex = 2 * current + 1;
            } 
        }else if(this.heap.length == 2){
            this.heap.splice(1, 1);
        }
    }
    getSize() {
        return this.heap.length - 1;
    }

}

class Queue {
    collection = [];
    constructor() {
        this.collection = [];
    }
    enqueue(node){
        this.collection.push(node);
    }
    dequeue(){
        this.collection.shift();
    }
    front(){
        return this.collection[0];
    }
    size(){
        return this.collection.length;
    }
    isEmpty(){
        return (this.collection.length == 0);
    }
}

let canVisit = (arr, dist, val) => {
    
    if(!(arr[0] >= 0 && arr[0] <= 29 && arr[1] >= 0 && arr[1] <= 29)) return false;
    let box = document.getElementById(`box_${arr[0]}_${arr[1]}`);
    if(box.classList.contains('wall')) return false;
    if(dist[arr[0]][arr[1]] <= val) return false;
    
    return true; 
}
let found = 0;
let djkastra = () => {
    let startC = getCordinates(startBoxId);
    dist[startC[0]][startC[1]] = 0;

    let heap = new MinHeap();
    heap.insert([0, 0, startC[0], startC[1]]);
    

    while(heap.getSize()){
        let arr = heap.getMin();
        heap.remove();
        let temp = `box_${arr[2]}_${arr[3]}`;
        let currentBox = document.getElementById(temp);
        if(!currentBox.classList.contains('start') && !currentBox.classList.contains('target')){
            setTimeout(() => {
                currentBox.classList.remove('boxSearching')
                currentBox.classList.add('boxVisited')
            }, currentSpeed * cnt) ;
        }

        let row = [-1, 0, 1, 0], col = [0, 1, 0, -1];
        let done = 0;
        for(let i = 0; i < 4; i++){
            if(    canVisit( [arr[2] + row[i], arr[3] + col[i]] , dist , arr[0] + 1   )   ){
                cnt++;
                dist[arr[2] + row[i]][arr[3] + col[i]] = arr[0] + 1;

                heap.insert([arr[0] + 1, cnt, arr[2] + row[i], arr[3] + col[i]]);

                let nextBox = document.getElementById(`box_${arr[2] + row[i]}_${arr[3] + col[i]}`);
                
                if(nextBox.classList.contains('target')){
                    done = 1;
                    found = 1;
                    
                    while(heap.getSize()){
                        let a = heap.getMin();
                        heap.remove();
                        let boxID = `box_${a[2]}_${a[3]}`;

                        let currentBoxToRemove = document.getElementById(boxID);
                        if(!currentBoxToRemove.classList.contains('start') && !currentBoxToRemove.classList.contains('target')){
                            setTimeout(() => {
                                currentBoxToRemove.classList.remove('boxSearching')
                                currentBoxToRemove.classList.add('boxVisited')
                            }, currentSpeed * cnt) ;
                        }
                    }
                    break;
                }
                setTimeout(() => {
                    nextBox.classList.add('boxSearching');
                }, currentSpeed * cnt);
            }
        }
        if(done){
            break;
        }
    }
}   
let isValidPathTrack = (newX, newY, curr, dist) => {
    if(!(newX >= 0 && newX <= 29 && newY >= 0 && newY <= 29)) return false;
    if(dist[newX][newY] !== curr - 1) return false;
    return true;
}
let getPath = (dist) =>{
    let targetC = getCordinates(targetBoxId);
    let x = targetC[0], y = targetC[1], curr = dist[targetC[0]][targetC[1]];
    let row = [-1, 0, 1, 0], col = [0, 1, 0, -1];
    while(curr){
        for(let i = 0; i < 4; i++){
            let newX = x + row[i], newY = y + col[i];
            if(isValidPathTrack(newX, newY, curr, dist)){
                prev = curr;
                curr = curr - 1;
                
                x = newX; y = newY;

                let temp = `box_${newX}_${newY}`;
                let currentBox = document.getElementById(temp);
                
                if(!currentBox.classList.contains('start')){
                    setTimeout(() => {
                        currentBox.classList.remove('boxVisited')
                        currentBox.classList.add('boxShortestPath')
                    }, 30 * temp_cnt) ;
                }

                temp_cnt++;
                break;
            }
        }
    }
}

let canVisitforBfs = (arr, visited) => {
    
    if(!(arr[0] >= 0 && arr[0] <= 29 && arr[1] >= 0 && arr[1] <= 29)) return false;
    let box = document.getElementById(`box_${arr[0]}_${arr[1]}`);
    if(box.classList.contains('wall')) return false;
    if(visited[arr[0]][arr[1]] === true) return false;
    
    return true; 
}
let BFS = () => {
    let startC = getCordinates(startBoxId);

    let q = new Queue();
    q.enqueue([startC[0], startC[1]]);
    visited[startC[0]][startC[1]] = true;

    while(!q.isEmpty()){
        let arr = q.front();
        q.dequeue();
        let temp = `box_${arr[0]}_${arr[1]}`;
        let currentBox = document.getElementById(temp);
        if(!currentBox.classList.contains('start') && !currentBox.classList.contains('target')){
            setTimeout(() => {
                currentBox.classList.remove('boxSearching')
                currentBox.classList.add('boxVisited')
            }, currentSpeed * cnt) ;
        }


        let row = [-1, 0, 1, 0], col = [0, 1, 0, -1];
        let done = 0;
        for(let i = 0; i < 4; i++){
            if(    canVisitforBfs( [arr[0] + row[i], arr[1] + col[i]] , visited)   ){
                cnt++;
                par[arr[0] + row[i]][arr[1] + col[i]] = temp;
                q.enqueue([arr[0] + row[i], arr[1] + col[i]]);
                visited[arr[0] + row[i]][arr[1] + col[i]] = true;
                let nextBox = document.getElementById(`box_${arr[0] + row[i]}_${arr[1] + col[i]}`);
                if(nextBox.classList.contains('target')){
                    done = 1;
                    found = 1;
                    
                    while(!q.isEmpty()){
                        let a = q.front();
                        q.dequeue();
                        let boxID = `box_${a[0]}_${a[1]}`;

                        let currentBoxToRemove = document.getElementById(boxID);
                        if(!currentBoxToRemove.classList.contains('start') && !currentBoxToRemove.classList.contains('target')){
                            setTimeout(() => {
                                currentBoxToRemove.classList.remove('boxSearching')
                                currentBoxToRemove.classList.add('boxVisited')
                            }, currentSpeed * cnt) ;
                        }
                    }
                    break;
                }
                setTimeout(() => {
                    nextBox.classList.add('boxSearching');
                }, currentSpeed * cnt);
            }
        }
        if(done){
            break;
        }
    }
}

let getPathforBFS = () => {
    let targetC = getCordinates(targetBoxId);
    let x = targetC[0], y = targetC[1];
    let row = [-1, 0, 1, 0], col = [0, 1, 0, -1];
    while(getCordinates(par[x][y])[0] !== -1){
        for(let i = 0; i < 4; i++){
            let newX = x + row[i], newY = y + col[i];
            let parC = getCordinates(par[x][y]);
            if(parC[0] === newX && parC[1] == newY){
                x = newX; y = newY;

                let temp = `box_${newX}_${newY}`;
                let currentBox = document.getElementById(temp);
                
                if(!currentBox.classList.contains('start')){
                    setTimeout(() => {
                        currentBox.classList.remove('boxVisited')
                        currentBox.classList.add('boxShortestPath')
                    }, 30 * temp_cnt) ;
                }

                temp_cnt++;
                break;
            }
        }
    }
}

start.addEventListener('click', () => {
    if(pathSearching == 0 && pathFinding == 0 && resetDone == 1)
    {
        pathFinding = 1;
        pathSearching = 1;
        resetDone = 0;
        if(currentAlgorithm === "Dijkstra's algorithm"){
            djkastra();
        }else{
            BFS();
        }
        
        setTimeout(() => {
            pathFinding = 0;
            if(found === 1){
                if(currentAlgorithm === "Dijkstra's algorithm"){
                    getPath(dist);
                }else if(currentAlgorithm === "BFS algorithm"){
                    getPathforBFS();
                }

                setTimeout(() => {
                    pathSearching = 0;
                }, temp_cnt * 30);
            }else{
                pathSearching = 0;
                console.log(currentAlgorithm);
            }
        }, currentSpeed * cnt);
    }
    
})

reset.addEventListener('click', () =>{
    if(pathFinding == 0 && pathSearching == 0){
        cnt = 0;
        temp_cnt = 1;
        resetDone = 1;
        for(let i = 0; i < 30; i++)
        {
            for(let j = 0; j < 30; j++){
                dist[i][j] = Number.POSITIVE_INFINITY;
                visited[i][j] = false;
                par[i][j] = 'box_-1_-1';
                let temp = `box_${i}_${j}`;
                let currentBox = document.getElementById(temp);
                currentBox.classList = 'box';
                
                if(i == 0 && j == 0){
                    currentBox.classList += ' start';
                }
                else if(i == 29 && j == 29){
                    currentBox.classList += ' target';
                }
                
            }
        }
        startBoxId = 'box_0_0';
        targetBoxId = 'box_29_29';
    }
    
})

let changeBox = (arr, str) =>{
    let currentBox = document.getElementById(`box_${arr[1]}_${arr[2]}`);
    currentBox.classList.add(str);
}
