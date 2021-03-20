const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream(process.argv[2]),
  output: process.stdout,
  console: false,
});

let control = (cx, cy, array) => {
  return !array.every(({ x, y }) => x != cx && y != cy);
};
let W,
  H,
  N,
  M,
  R,
  B = [],
  A = [];
count = 1;
readInterface.on("line", (line) => {
  if (count == 1) {
    [W, H] = line.split(" ").map((a) => +a);
  } else if (count == 2) {
    [N, M, R] = line.split(" ").map((a) => +a);
  } else if (count < N + 3) {
    B.push(line.split(" ").map((a) => +a)); //Bx, By, Bl, Bc
  } else if (count < N + M + 3) {
    A.push(line.split(" ").map((a) => +a)); //Ar, Ac
    if (count == N + M + 2) {
      A = A.map((a, i) => a.push(i)).sort((a, b) =>
        a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : a[0] > b[0] ? -1 : 1
      );

      let Ap = [],
        Pf = []; //Ap = [x,y] Pf=[x,y,[edifici],St]
      A.forEach((a, i) => {
        //a = [range,strength]
        let x = 0,
          y = 0;
        //posizione iniziale
        while (true) {
          if (control(x, y, Pf)) {
            if (x <= W - 1) {
              x++;
              continue;
            }
            if (x == W) {
              x = 0;
              y++;
              continue;
            }
          } else break;
        }
        //contare
        let somma = 0,
          edi = [],
          xv,
          yv;
        while (true) {
          let ediDentroProva = B.filter((a) => {
            return Math.abs(B[0] - x) + Math.abs(B[1] - y) <= A[0]
              ? true
              : false;
          });
          if (ediDentroProva.length == 0) {
            somma = 0;
            continue;
          }
          let sommaProva = ediDentroProva.reduce(
            (prev, edi) =>
              edi[3] * a[1] -
              edi[2] * (Math.abs(B[0] - x) + Math.abs(B[1] - y)) +
              prev
          );
          if (sommaProva > prova) {
            somma = sommaProva;
            edi = ediDentroProva;
            xv = x;
            yv = y;
          }
          while (true) {
            if (control(x, y, Pf)) {
              if (x <= W - 1) {
                x++;
                continue;
              }
              if (x == W) {
                x = 0;
                y++;
                if (y == H) {
                  y--;
                  break;
                }
                continue;
              }
            } else break;
          }
          if (x == W - 1 && y == H - 1) {
            break;
          }
        }
        B = B.filter((a) => {
          return !edi.any((c) => c == a);
        });
        Pf.push({ x: xv, y: yv, somma, pos: A[2] });
      });
      data = M;
      Pf.forEach((ent) => {
        data += "\n" + ent.pos + ent.x + ent.y;
      });

      fs.writeFile("output", data, "utf8", (err) => {
        if (err) {
          return console.log(err);
        }
      });
    }
  }
  count++;
});
