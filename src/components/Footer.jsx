export default function Footer() {
  return (
    <footer className="mt-10 border-t border-purple-800 bg-purple-900">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-purple-100">
          © {new Date().getFullYear()} EduQuest. All rights reserved.
        </p>
        <p className="text-xs text-purple-300">
          Built with React, Tailwind CSS & JSON Server.
        </p>
      </div>
    </footer>
  );
}
