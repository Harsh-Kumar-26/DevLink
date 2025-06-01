export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 border-t border-gray-700 mt-20 py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm select-none">
      {/* Left info */}
      <div className="mb-4 md:mb-0 text-center md:text-left space-y-1">
        <p>© {new Date().getFullYear()} Harsh Kumar — All Rights Reserved</p>
        <p>
          Email:{" "}
          <a
            href="mailto:harshkumar010377@gmail.com"
            className="hover:text-purple-500 transition-colors"
          >
            harshkumar010377@gmail.com
          </a>
        </p>
        <p>
          {/* GitHub:{" "}
          <a
            href="https://github.com/Harsh-Kumar-26"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-500 transition-colors"
          >
            github.com/Harsh-Kumar-26
          </a> */}
        </p>
        <p>
          LinkedIn:{" "}
          <a
            href="https://www.linkedin.com/in/harsh-kumar-927aa3256?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-500 transition-colors"
          >
            linkedin.com/in/harsh-kumar
          </a>
        </p>
      </div>

      {/* Right brand */}
      <div className="text-xl font-bold cursor-default select-text">
        <span className="text-white">Dev</span>
        <span className="text-purple-500">Link</span>
      </div>
    </footer>
  );
}
