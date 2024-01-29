import { useState } from "react";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

//Button component with children
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

//app component
function App() {
  //add friend form hide and show state
  const [showAddFriend, setAddFriend] = useState(false);
  //friends state
  const [friends, setFriends] = useState(initialFriends);
  //selected friend state
  const [selectedFriend, setSelectFriend] = useState(null);
  //show add friend form
  function handleShowAddFriend() {
    setAddFriend((showAddFriend) => !showAddFriend);
    setSelectFriend(null);
  }
  //geting arrays of friends
  function handleAdFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    //hidding add friend
    setAddFriend(false);
    setSelectFriend(null);
  }

  //handle function selected friend
  function handleSelectedFriend(friend) {
    setSelectFriend((curSelected) =>
      curSelected?.id === friend.id ? null : friend
    );
    setAddFriend(false);
  }

  const handleSplitBill = (value) => {
    //spliting bills with friends
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelectedfriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAdFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

// friendl-list component
function FriendList({ friends, onSelectedfriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          selectedFriend={selectedFriend}
          key={friend.id}
          onSelectedfriend={onSelectedfriend}
        />
      ))}
    </ul>
  );
}

//friend component
function Friend({ friend, onSelectedfriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : null}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} #{Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you #{Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelectedfriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

//Add friend form
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  //submit function
  function handleSubmit(e) {
    e.preventDefault();

    //preventing form not to sumbmit empty
    if (!name || !image) return;
    //getting random id
    const id = crypto.randomUUID();
    //new friends details
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    //reseting the input field
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌄 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [yourExpenses, setExpenses] = useState("");
  // calculating friends bill from bill
  const friendExpenses = bill ? bill - yourExpenses : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bill || !yourExpenses) return;
    onSplitBill(whoIsPaying === "user" ? friendExpenses : -yourExpenses);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill vlaue</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♂️ Your expenses</label>
      <input
        type="text"
        value={yourExpenses}
        onChange={(e) =>
          setExpenses(
            Number(e.target.value) > bill
              ? yourExpenses
              : Number(e.target.value)
          )
        }
      />

      <label>👯 {selectedFriend.name}'s expenses</label>
      <input type="text" disabled value={friendExpenses} />

      <label>🤑 Who is payingthe bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

export default App;
