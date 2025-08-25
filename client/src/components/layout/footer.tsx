import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-semibold text-lg">
            <span className="text-primary">漢</span>zi SRS
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Hanzi SRS. All rights reserved.
          </p>
          
          <nav className="flex gap-6 text-sm">
            <Link href="#" className="hover:text-primary transition-colors" data-testid="link-privacy">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors" data-testid="link-terms">
              Terms
            </Link>
            <Link href="#" className="hover:text-primary transition-colors" data-testid="link-contact">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
