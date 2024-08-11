import Input from "../components/Input";

export default function Home() {
  return (
    <main className="flex h-screen">
      <aside className="bg-white w-1/3 p-4 border-r">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <ul>
          <li className="p-2 hover:bg-gray-200 cursor-pointer">User 1</li>
          <li className="p-2 hover:bg-gray-200 cursor-pointer">User 2</li>
          <li className="p-2 hover:bg-gray-200 cursor-pointer">User 3</li>
        </ul>
      </aside>
      <div className="bg-blue-50 w-2/3 p-4 flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4">
          <div className="p-2">
            
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message here"
            className="bg-white border p-[15px] flex-grow rounded-md shadow-sm"
          />
          <button className="bg-blue-500 p-4 text-white rounded-md shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
