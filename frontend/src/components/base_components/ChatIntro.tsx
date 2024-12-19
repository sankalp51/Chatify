import chatify from "../../images/chat.png";

export default function ChatIntro() {
  return (
    <>
      <img
        src={chatify}
        alt="chatify icon"
        className="w-1/2 md:w-1/4 lg:w-1/6 max-w-xs h-auto"
      />
      <p className="text-3xl font-sans">Select a user to start texting </p>
    </>
  );
}
