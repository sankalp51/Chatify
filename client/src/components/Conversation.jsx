export default function Conversation() {
    return (
      <article className="flex gap-3 items-center hover:bg-primary hover:text-primary-content rounded-lg p-2 cursor-pointer transition-all">
        <div className="avatar online">
          <div className="w-12 rounded-full">
            <img src="https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png" alt="user avatar" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            <p className="font-bold">John Doe</p>
            <span className="text-xl">🍗</span>
          </div>
        </div>
      </article>
    );
  }
  