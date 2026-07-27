import {
  ArrowRight,
  Braces,
  CircleHelp,
  FlaskConical,
  Lightbulb,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Link } from "react-router-dom";
import {
  evaluateMaterialCurve,
  type MaterialCurveSettings,
  type MaterialOperation,
} from "../lib/materialMath";

const operationCopy: Record<
  MaterialOperation,
  { title: string; expression: string; description: string }
> = {
  remap: {
    title: "Remap",
    expression: "OutMin + ((X − InMin) / (InMax − InMin)) × (OutMax − OutMin)",
    description:
      "Переносить значення з одного діапазону в інший. Основа для керування масками, dissolve та emissive.",
  },
  power: {
    title: "Power",
    expression: "pow(saturate(X), Exponent)",
    description:
      "Змінює контраст і розподіл градієнта. Exponent > 1 стискає світлі значення; < 1 розширює їх.",
  },
  smoothstep: {
    title: "Smoothstep",
    expression: "t² × (3 − 2t), де t = saturate((X − Edge0) / (Edge1 − Edge0))",
    description:
      "Створює м’який контрольований перехід між 0 та 1 без різкого порогу.",
  },
};

function CurveCanvas({ settings }: { settings: MaterialCurveSettings }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const width = rect.width;
      const height = rect.height;
      const padding = 34;
      const plotWidth = width - padding * 2;
      const plotHeight = height - padding * 2;

      context.clearRect(0, 0, width, height);
      const background = context.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, "#111223");
      background.addColorStop(1, "#090b14");
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(164, 173, 221, 0.11)";
      context.lineWidth = 1;
      for (let index = 0; index <= 4; index += 1) {
        const offset = (index / 4) * plotWidth;
        context.beginPath();
        context.moveTo(padding + offset, padding);
        context.lineTo(padding + offset, height - padding);
        context.stroke();

        const verticalOffset = (index / 4) * plotHeight;
        context.beginPath();
        context.moveTo(padding, padding + verticalOffset);
        context.lineTo(width - padding, padding + verticalOffset);
        context.stroke();
      }

      context.fillStyle = "rgba(202, 207, 236, 0.55)";
      context.font = "11px Inter, system-ui, sans-serif";
      context.fillText("1.0", 8, padding + 4);
      context.fillText("0.0", 8, height - padding + 4);
      context.fillText("input →", width - 78, height - 10);

      const glow = context.createLinearGradient(padding, 0, width - padding, 0);
      glow.addColorStop(0, "#8d7aff");
      glow.addColorStop(0.55, "#60e6ff");
      glow.addColorStop(1, "#ffbf69");
      context.beginPath();

      for (let index = 0; index <= 180; index += 1) {
        const xValue = index / 180;
        const yValue = evaluateMaterialCurve(xValue, settings);
        const x = padding + xValue * plotWidth;
        const y =
          height - padding - Math.max(-0.2, Math.min(1.2, yValue)) * plotHeight;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      context.save();
      context.shadowBlur = 16;
      context.shadowColor = "#6adfff";
      context.strokeStyle = glow;
      context.lineWidth = 3;
      context.stroke();
      context.restore();
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [settings]);

  return (
    <canvas
      ref={canvasRef}
      className="curve-canvas"
      aria-label={`Графік операції ${operationCopy[settings.operation].title}`}
    />
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="lab-range">
      <span>
        <strong>{label}</strong>
        <output>{value.toFixed(2)}</output>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function MaterialLabPage() {
  const [operation, setOperation] = useState<MaterialOperation>("remap");
  const [inputMin, setInputMin] = useState(0.2);
  const [inputMax, setInputMax] = useState(0.8);
  const [outputMin, setOutputMin] = useState(0);
  const [outputMax, setOutputMax] = useState(1);
  const [exponent, setExponent] = useState(2);
  const [edge0, setEdge0] = useState(0.25);
  const [edge1, setEdge1] = useState(0.75);
  const [probe, setProbe] = useState(0.5);

  const settings = useMemo<MaterialCurveSettings>(
    () => ({
      operation,
      inputMin,
      inputMax,
      outputMin,
      outputMax,
      exponent,
      edge0,
      edge1,
    }),
    [
      operation,
      inputMin,
      inputMax,
      outputMin,
      outputMax,
      exponent,
      edge0,
      edge1,
    ],
  );
  const result = evaluateMaterialCurve(probe, settings);

  return (
    <div className="page-stack material-lab">
      <header className="page-header">
        <span className="eyebrow">
          <FlaskConical size={15} />
          Інтерактивна лабораторія
        </span>
        <h1>Material Math Lab</h1>
        <p>
          Рухай параметри й дивись, як математична операція змінює градієнт.
          Потім відтвори ту саму схему вузлами в Unreal Material Editor.
        </p>
      </header>

      <div className="lab-workbench">
        <section className="panel lab-controls">
          <span className="eyebrow">Операція</span>
          <div className="segmented-control" role="tablist" aria-label="Material operation">
            {(Object.keys(operationCopy) as MaterialOperation[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={operation === key}
                className={operation === key ? "is-active" : ""}
                onClick={() => setOperation(key)}
              >
                {operationCopy[key].title}
              </button>
            ))}
          </div>

          <div className="control-stack">
            {operation === "remap" && (
              <>
                <RangeControl label="Input Min" value={inputMin} min={-1} max={1} step={0.05} onChange={setInputMin} />
                <RangeControl label="Input Max" value={inputMax} min={0} max={2} step={0.05} onChange={setInputMax} />
                <RangeControl label="Output Min" value={outputMin} min={-1} max={1} step={0.05} onChange={setOutputMin} />
                <RangeControl label="Output Max" value={outputMax} min={0} max={3} step={0.05} onChange={setOutputMax} />
              </>
            )}
            {operation === "power" && (
              <RangeControl label="Exponent" value={exponent} min={0.1} max={6} step={0.1} onChange={setExponent} />
            )}
            {operation === "smoothstep" && (
              <>
                <RangeControl label="Edge 0" value={edge0} min={0} max={1} step={0.01} onChange={setEdge0} />
                <RangeControl label="Edge 1" value={edge1} min={0} max={1} step={0.01} onChange={setEdge1} />
              </>
            )}
          </div>
        </section>

        <section className="panel lab-graph">
          <div className="graph-heading">
            <div>
              <span className="eyebrow">Live curve</span>
              <h2>{operationCopy[operation].title}</h2>
            </div>
            <Braces size={25} aria-hidden="true" />
          </div>
          <CurveCanvas settings={settings} />
          <code className="formula">{operationCopy[operation].expression}</code>
        </section>
      </div>

      <section className="probe-panel panel">
        <div>
          <span className="eyebrow">Перевір конкретне значення</span>
          <h2>Input → Output</h2>
          <p>{operationCopy[operation].description}</p>
        </div>
        <label className="probe-control">
          <span>Input X</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={probe}
            onChange={(event) => setProbe(Number(event.target.value))}
          />
          <strong>{probe.toFixed(2)}</strong>
        </label>
        <div className="probe-result">
          <small>Output</small>
          <strong>{result.toFixed(3)}</strong>
          <span
            className="value-swatch"
            style={{ "--value": Math.max(0, Math.min(1, result)) } as CSSProperties}
            aria-hidden="true"
          />
        </div>
      </section>

      <section className="lab-learning-grid">
        <article className="panel learning-card">
          <Lightbulb size={23} />
          <span className="eyebrow">Практичний цикл</span>
          <h2>Не просто дивись на графік</h2>
          <ol>
            <li>Передбач форму кривої до зміни параметра.</li>
            <li>Зміни одне значення й поясни результат уголос.</li>
            <li>Збери еквівалент у Material Editor.</li>
            <li>Перевір на grayscale-текстурі та масці dissolve.</li>
          </ol>
        </article>
        <article className="panel learning-card">
          <CircleHelp size={23} />
          <span className="eyebrow">Де це в курсі</span>
          <h2>Пов’язані уроки</h2>
          <p>
            Лабораторія доповнює блоки Materials I–II. Почни з фундаменту
            Material Editor, потім повертайся сюди для розвитку інтуїції.
          </p>
          <Link className="button button-secondary" to="/course#block-03">
            Відкрити Materials I <ArrowRight size={16} />
          </Link>
        </article>
      </section>
    </div>
  );
}

