import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="text-center p-4">

        {/* 404 NUMBER */}
        <h1 className="display-1 fw-bold text-primary">
          404
        </h1>

        {/* TITLE */}
        <h3 className="fw-bold mb-3">
          Page Not Found
        </h3>

        {/* DESCRIPTION */}
        <p className="text-muted mb-4">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* BUTTONS */}
        <div className="d-flex gap-2 justify-content-center">

          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>

          <button
            className="btn btn-outline-secondary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>

        </div>
      </div>
    </div>
  );
}