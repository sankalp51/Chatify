import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function NotFound() {
    return (
        <main className="bg-blue-50 h-screen flex flex-col items-center justify-center text-center p-6">
            <h2 className="text-6xl font-bold mb-4 text-blue-600">404</h2>
            <h3 className="text-2xl font-bold mb-2">Page Not Found</h3>
            <p className="text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="mt-4">
                <Button
                    name="Go Home"
                    className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 transition-all duration-300"
                />
            </Link>
        </main>
    );
}
