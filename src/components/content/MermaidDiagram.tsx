import { AlertTriangle, Maximize2 } from "lucide-react";
import { useEffect, useId, useState } from "react";

let mermaidInitialized = false;

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const reactId = useId();
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let active = true;

    import("mermaid")
      .then(async ({ default: mermaid }) => {
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "strict",
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
            themeVariables: {
              background: "#0c0f1c",
              primaryColor: "#272044",
              primaryTextColor: "#f6f4ff",
              primaryBorderColor: "#8e7dff",
              lineColor: "#8da5c4",
              secondaryColor: "#102b39",
              tertiaryColor: "#24172e",
              edgeLabelBackground: "#0c0f1c",
              clusterBkg: "#111626",
              clusterBorder: "#38415d",
              fontSize: "15px",
            },
            flowchart: {
              curve: "basis",
              htmlLabels: true,
            },
          });
          mermaidInitialized = true;
        }

        const diagramId = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
        const result = await mermaid.render(diagramId, chart.trim());
        if (active) {
          setSvg(result.svg);
          setError(false);
        }
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => {
      active = false;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <div className="diagram-error">
        <AlertTriangle size={20} aria-hidden="true" />
        <div>
          <strong>Схему не вдалося відобразити</strong>
          <pre>{chart}</pre>
        </div>
      </div>
    );
  }

  return (
    <figure className={`mermaid-figure${expanded ? " is-expanded" : ""}`}>
      <figcaption>
        <span>Інтерактивна схема</span>
        <button
          type="button"
          className="icon-button"
          onClick={() => setExpanded((current) => !current)}
          aria-label={expanded ? "Зменшити схему" : "Розгорнути схему"}
        >
          <Maximize2 size={17} />
        </button>
      </figcaption>
      {svg ? (
        <div
          className="mermaid-canvas"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="diagram-loading">
          <span />
          <span />
          <span />
        </div>
      )}
    </figure>
  );
}

