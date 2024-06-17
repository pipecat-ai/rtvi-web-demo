import Logo from "../logo";
import ExpiryTimer from "../Session/ExpiryTimer";

const aCx =
  "underline decoration-primary-400/0 hover:decoration-primary-400 underline-offset-4 transition-all duration-300";

function Header() {
  return (
    <header
      id="header"
      className="w-full flex self-start items-center p-[--app-padding] justify-between"
    >
      <div className="group flex gap-8">
        <span className="border border-primary-200 rounded-xl p-2 flex place-content-center transition-all bg-white shadow-short hover:shadow-mid">
          <Logo className="w-[42px] h-auto aspect-square [&>*:nth-child(5)]:invisible group-hover:[&>*:nth-child(5)]:visible group-hover:[&>*:nth-child(4)]:invisible group-hover:animate-wiggle" />
        </span>

        <nav className="pointer-events-none flex-row items-center gap-8 text-lg leading-7 hidden group-hover:flex group-hover:pointer-events-auto">
          <a href="https://git.new/ai" target="_blank" className={aCx}>
            GitHub
          </a>
          <a href="https://discord.gg/pipecat" target="_blank" className={aCx}>
            Discord
          </a>
        </nav>
      </div>
      <ExpiryTimer />
    </header>
  );
}

export default Header;
