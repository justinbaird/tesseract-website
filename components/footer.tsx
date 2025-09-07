export function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-gray-400">
          <a href="mailto:justin@justinbaird.com" className="hover:text-white transition-colors">
            justin@justinbaird.com
          </a>
          <span className="hidden sm:block">•</span>
          <a href="tel:+61893434" className="hover:text-white transition-colors">
            +61 893 434
          </a>
          <span className="hidden sm:block">•</span>
          <span>© 2024 Justin Baird</span>
        </div>
      </div>
    </footer>
  )
}
