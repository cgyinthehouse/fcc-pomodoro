import figlet from "figlet";
import ansi from "figlet/importable-fonts/ANSI Shadow";

figlet.parseFont("ANSI Shadow", ansi as string);

const fl = (text: string, font: figlet.Fonts) => {
  let output: string | undefined;

  figlet.text(
    text,
    {
      font,
    },
    function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      output = data;
    }
  );
  return output;
};
export default function Header() {
  return (
    <header>
      <pre>{fl("POMODORO", "ANSI Shadow")}</pre>
    </header>
  );
}
