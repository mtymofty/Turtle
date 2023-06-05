import {useEffect, useRef, useState} from "react";
import '../styles/App.css';
import { Requests } from "../requests/Requests";
import { Line } from "../types/Line";

export function App() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [lines, setLines] = useState<any>(null);

  useEffect(() => {
   Requests.lines().then(res => {
      if (res.err) {
         setLines([]);
      }
      else if (res.res) {
         setLines(res.res);
      }
   });


    if (ref.current && lines) {
      var ctx = ref.current.getContext('2d')
      for (let i = 0; i < lines.length; i++) {
        drawLine(ctx, lines[i]);
      }
    }
  })

  function drawLine(ctx: CanvasRenderingContext2D | null, line: Line) {
    if(!ctx) {
      return
    }

    ctx.strokeStyle = `rgb(
        ${line.color[0]},
        ${line.color[1]},
        ${line.color[2]})`;

    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(...line.from);
    ctx.lineTo(...line.to);
    ctx.stroke();
}

  return (
      <div className=" cont">
          <canvas ref={ref} className="canvas" width="500" height="500">
          </canvas>
      </div>
  );
}

export default App;
