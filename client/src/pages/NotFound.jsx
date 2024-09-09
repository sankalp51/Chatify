import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function NotFound() {
    return (
        <main className="bg-base-200 h-screen flex flex-col items-center justify-center text-center p-6">
            <h2 className="text-7xl md:text-9xl font-extrabold mb-4 text-primary">404</h2>
            <h3 className="text-xl md:text-3xl font-bold mb-2">Page Not Found</h3>
            <p className="text-base md:text-lg text-base-content mb-6">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link to="/" className="mt-4">
                <Button
                    name="Go Home"
                    className="btn btn-primary rounded-full px-6 py-2 transition-all duration-300"
                />
            </Link>
        </main>
    );
}
