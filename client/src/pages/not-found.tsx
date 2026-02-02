import { Link } from "wouter";
import { HeartCrack } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-pink-50">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <HeartCrack className="h-24 w-24 text-primary opacity-50" />
        </div>
        <h1 className="text-4xl font-bold text-primary font-handwriting mb-4">404 Page Not Found</h1>
        <p className="text-muted-foreground mb-8">This page seems to have broken a heart...</p>
        
        <Link href="/" className="px-6 py-3 bg-white text-primary font-bold rounded-xl border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-xl">
          Return Home
        </Link>
      </div>
    </div>
  );
}
