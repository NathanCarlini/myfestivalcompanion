export default function Footer() {
  return (
    <footer>
      <div className="flex flex-row w-[100vw] justify-evenly items-center max-h-[10vh]">
        <p>© 2025 My Festival Companion</p>
        <div className="flex flex-col gap-2">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}
