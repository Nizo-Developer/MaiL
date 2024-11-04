import { randint } from "./tool.js";

var pos = {};

export function addCircle() {
  var cle = 19;
  var rp = 0;

  for (let i = 0; i <= cle; i++) {
    let r1 = Math.round(Math.random());
    let r2 = Math.round(Math.random());
    // console.log(r1, r2)

    var pl = Object.values(pos).length
    if (pl > 0) {
      coor();
    } else {
      if (r1 == 0) {
        var x = randint(10, 140)
        if (41 < x < 59) {
          if (r2 == 0) {
            y = randint(0, 30)
          } else {
            y = randint(70, 100)
          }
        }
      } else {
        var y = randint(0, 100)
        if (41 < y < 59) {
          if (r2 == 0) {
            x = randint(10, 30)
          } else {
            x = randint(70, 100)
          }
        }
      }
    }

    function coor() {
      var check = []
      var id = []
      var m = 0
      for (let c = 0; c <= cle; c++) {
        id.push(c)
      }

      // console.log(pos)
      while (m == 0 || false in check) {
        m = 1
        if (r1 == 0) {
          let x = randint(10, 140)
          if (31 < x < 69) {
            if (r2 == 0) {
              y = randint(0, 30)
            } else {
              y = randint(70, 100)
            }
          }
        } else {
          let y = randint(0, 100)
          if (31 < y < 69) {
            if (r2 == 0) {
              x = randint(10, 40)
            } else {
              x = randint(70, 100)
            }
          }
        }

        // console.log('first', x, y)
    
        for (var p of id) {
          if (p in pos) {
            if (Math.round(Math.sqrt(Math.pow(pos[p].x - x, 2) + Math.pow(pos[p].y - y, 2))) <= 80) {
              check.push(false)
            } else {
              check.push(true)
              id.splice(p, 1)
            }
          }
        }
        // console.log(check)
        check = Array.from([])
      }
    }

    let corlocX = x - 50
    let corlocY = y - 50


    let sz = randint(2, 8);
    let dg = randint(0, 360);
  
    rp++
    // console.log(rp)
    // console.log((cle+1)*2)

    let gr = document.getElementById('particle');
    gr.innerHTML += `<img src="../asset/tri${i%2 == 0 ? 1 : 2}.svg" alt="tri" class="triangle">`
    const cir = gr.children[gr.children.length - 1]
    cir.setAttribute('style', `top: ${y}vh; left: ${x}vw; height: ${sz}vh;transform: rotate(${dg}deg);`);
    pos[i] = {x, y, corlocX, corlocY, sz}
  }
}

export function particle(event) {
  var mouseX = event.clientX;
  var mouseY = event.clientY;
  var sumbuX = window.innerWidth / 2;
  var sumbuY = window.innerHeight / 2;

  mouseX -= sumbuX
  mouseY -= sumbuY

  // console.log(mouseX, mouseY)
  const circles = document.querySelectorAll('.triangle')
  var ob = 0
  circles.forEach(function(circle, index) {
    // console.log(circle.style.backgroundColor);
    if (circle.style.backgroundColor == 'white') {
        ob = 500
    } else {
        ob = 0
    }
    // console.log(pos)
    // console.log(index)
    // console.log(pos[index])
    let lf = pos[index].x + mouseX * (pos[index].sz*10 / (2000 - ob)) + 'vw';
    let tp = pos[index].y + mouseY * (pos[index].sz*10 / (2000 - ob)) + 'vh';
    circle.style.left = lf
    circle.style.top = tp
  });
};

