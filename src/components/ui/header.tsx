import ExpiryTimer from "../Session/ExpiryTimer";

export function Header() {
  return (
    <header
      id="header"
      className="w-full flex self-start items-center p-[--app-padding] justify-between"
    >
      <div className="group flex gap-8">&nbsp;</div>
      <ExpiryTimer />
    </header>
  );
}

export default Header;
