import {useEffect, useRef, useState} from "react";
import '../styles/App.css';
import { Requests } from "../requests/Requests";
import { Line } from "../types/Line";

export function App() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [lines, setLines] = useState<any>(null);
  const [received, setReceived] = useState<boolean>(false);

  useEffect(() => {
   Requests.lines().then(res => {
      if (res.err) {
         setLines([]);
      }
      else if (res.res) {
         setLines(res.res);
         setReceived(true)
      }
   });


    if (ref.current && received) {
      var ctx = ref.current.getContext('2d')

      lines.forEach( (line: Line) => {
        drawLine(ctx, line);
    });

    }
  }, [received])

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
