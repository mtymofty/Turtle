import {useEffect, useRef} from "react";
import '../styles/App.css';
import { Line } from "../types/Line";
import lines from "../lines.json"

export function App() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) {
      var ctx = ref.current.getContext('2d')
      lines.forEach( (line: Line) => {
        drawLine(ctx, line);
      });
    }
  })

  function drawLine(ctx: CanvasRenderingContext2D | null, line: Line) {
    if(!ctx) {
      return
    }

    ctx.strokeStyle = `rgba(
        ${line.color[1]},
        ${line.color[2]},
        ${line.color[3]},
        ${line.color[0]/100})`;

    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(line.from[0], line.from[1]);
    ctx.lineTo(line.to[0], line.to[1]);
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
