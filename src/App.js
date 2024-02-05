import { useState } from "react";
import "./index.css";
// import { serialize } from "./Serialized";

const initialFriends = [];

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
  function handleAddFriend(friend) {
    const oweFriends = [];
    const newFriendList = [];
    const latestFriend = {
      name: friend.name,
      balance: 0,
      id: friend.id,
    };
    //getting owe friends
    friends.forEach((element) => {
      oweFriends.push({
        name: element.name,
        balance: 0,
        id: element.id,
      });
      element.owe.push(latestFriend);
      newFriendList.push(element);
      // console.log(element.owe);
    });
    friend.owe = oweFriends;
    setFriends([...newFriendList, friend]);
    //hidding add friend form
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
    // setSelectFriend(null);
  };

  return (
    <>
      <h1 className="">Eat N Split Bill App</h1>
      <div className="app">
        <div className="sidebar">
          <FriendList
            friends={friends}
            onSelectedfriend={handleSelectedFriend}
            selectedFriend={selectedFriend}
          />

          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add Friend"}
          </Button>
        </div>
        {selectedFriend && (
          <FormSplitBill
            upDateFriendInfo={(e) => setFriends(e)}
            friends={friends}
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
          />
        )}
      </div>
    </>
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
  // const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className="seleted" onClick={() => onSelectedfriend(friend)}>
      <div>
        <div className="colums">
          <img src={friend.image} alt={friend.name} />
          <h3 style={{ textTransform: "capitalize" }}>{friend.name}</h3>
        </div>
        <div style={{ marginTop: "8px" }}>
          <div>
            {friend.owe.map((fr, ind) => (
              <div key={ind}>
                {fr.balance > 0 && (
                  <p>
                    <div
                      className="red "
                      style={{ width: "320px", padding: "3px 0" }}
                    >
                      you owe {fr.name} ${fr.balance}
                    </div>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <Button onClick={() => onSelectedfriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button> */}
      {/* {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>} */}
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
    const id = Math.floor(Math.random() * Math.random() * 1000000) + 1;

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
        autoFocus
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
function FormSplitBill({ friends, upDateFriendInfo }) {
  const [bill, setBill] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredUsers = friends.filter(
      (user) => user.id === parseInt(whoIsPaying)
    );

    if (!whoIsPaying) {
      alert("Please select who is paying the bill.");
      return;
    }

    const figure = bill / (filteredUsers[0].owe.length + 1);
    const eachAmountToPay = parseFloat(figure.toFixed(2));
    const holdFriends = [];
    friends.forEach((element) => {
      if (element.id === parseInt(whoIsPaying)) {
        const holdingOweArray = [];
        element.owe.forEach((owelist) => {
          if (owelist.balance > 0) {
            const clearedBalance = owelist.balance - eachAmountToPay;
            if (clearedBalance > 0) {
              owelist.balance = clearedBalance;
            } else {
              owelist.balance = 0;
            }
            holdingOweArray.push(owelist);
          } else {
            holdingOweArray.push(owelist);
          }
          element.owe = holdingOweArray;
        });
        holdFriends.push(element);
      } else {
        const newPay = [];
        const owingAmount = filteredUsers[0].owe.filter(
          (x) => x.id === parseInt(element.id)
        );

        element.owe.forEach((el) => {
          if (el.id === parseInt(whoIsPaying)) {
            const cleared = eachAmountToPay - owingAmount[0].balance;
            console.log(cleared);
            el.balance = cleared;
            newPay.push(el);
          } else {
            newPay.push(el);
          }
        });
        element.owe = newPay;
        holdFriends.push(element);
      }
    });
    upDateFriendInfo(holdFriends);
    // console.log(holdFriends);

    if (isNaN(bill) || bill <= 0) {
      alert("Please enter a valid bill amount.");
      return;
    }
  };

  return (
    <form
      className="form-split-bill"
      name="pee"
      onSubmit={(e) => handleSubmit(e)}
    >
      <h2>Split a bill with Friends</h2>

      <label>💰 Bill </label>
      <input
        type="text"
        value={bill}
        name="bill"
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🤑 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="">Select</option>
        {friends.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
        {/* <option value={selectedFriend.name}>{selectedFriend.name}</option> */}
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

export default App;

// const holdFriends = [];
//     friends.forEach((element) => {
//       if (element.id === parseInt(whoIsPaying)) {
//         const holdingOweArray = [];
//         element.owe.forEach((owelist) => {
//           if (owelist.balance > 0) {
//             const clearedBalance = owelist.balance - eachAmountToPay;
//             if (clearedBalance > 0) {
//               owelist.balance = clearedBalance;
//             } else {
//               owelist.balance = 0;
//             }
//             holdingOweArray.push(owelist);
//           } else {
//             holdingOweArray.push(owelist);
//           }
//           element.owe = holdingOweArray;
//         });
//         holdFriends.push(element);
//       } else {
//         const newPay = [];
//         const owingAmount = filteredUsers[0].owe.filter(
//           (x) => x.id === parseInt(element.id)
//         );

//         element.owe.forEach((el) => {
//           if (el.id === parseInt(whoIsPaying)) {
//             const cleared = eachAmountToPay - owingAmount[0].balance;
//             console.log(cleared);
//             el.balance = cleared;
//             newPay.push(el);
//           } else {
//             newPay.push(el);
//           }
//         });
//         element.owe = newPay;
//         holdFriends.push(element);
//       }
//     });
//     upDateFriendInfo(holdFriends);
