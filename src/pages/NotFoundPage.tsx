import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="empty-state">
      <SearchX size={44} aria-hidden="true" />
      <span className="eyebrow">404 · Lost particle</span>
      <h1>Такої сторінки немає</h1>
      <p>Можливо, посилання застаріло або матеріал отримав інший маршрут.</p>
      <Link className="button button-primary" to="/">
        <ArrowLeft size={17} /> До навчального центру
      </Link>
    </section>
  );
}
