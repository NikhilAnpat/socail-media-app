
// import { FaUserCircle } from "react-icons/fa";
// import { useState, useEffect } from "react";
// import { db } from "../../firebaseConfig";
// import { collection, getDocs, updateDoc, doc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
// import { auth } from "../../firebaseConfig"; // Import Firebase Auth
// import Footer from "./footer";

// export default function Friends() {
//     const [users, setUsers] = useState<any[]>([]);
//     const [currentUserId, setCurrentUserId] = useState<string>("");

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 // Get the current user ID from Firebase Auth
//                 const userId = auth.currentUser?.uid;
//                 if (!userId) {
//                     console.error("No user is logged in");
//                     return;
//                 }
//                 setCurrentUserId(userId); // Set the current user ID

//                 // Fetch all users from Firestore
//                 const querySnapshot = await getDocs(collection(db, "users"));
//                 const userList: any[] = [];
//                 querySnapshot.forEach((doc) => {
//                     userList.push({ id: doc.id, ...doc.data() });
//                 });

//                 // Filter out the logged-in user from the list
//                 const filteredUsers = userList.filter(user => user.id !== userId);
//                 setUsers(filteredUsers);
//             } catch (error) {
//                 console.error("Error fetching users: ", error);
//             }
//         };

//         fetchUsers();
//     }, []);

//     const handleFollowClick = async (userId: string) => {
//         try {
//             const userRef = doc(db, "users", userId);
//             const currentUserRef = doc(db, "users", currentUserId);

//             // Check if the current user's document exists
//             const currentUserDoc = await getDoc(currentUserRef);
//             if (!currentUserDoc.exists()) {
//                 console.error("Current user document does not exist.");
//                 return;
//             }

//             await updateDoc(userRef, {
//                 followers: arrayUnion(currentUserId)
//             });

//             await updateDoc(currentUserRef, {
//                 following: arrayUnion(userId)
//             });

//             setUsers(users.map(user => {
//                 if (user.id === userId) {
//                     return { ...user, followers: [...(user.followers || []), currentUserId] };
//                 }
//                 return user;
//             }));
//         } catch (error) {
//             console.error("Error following user: ", error);
//         }
//     };

//     const handleUnfollowClick = async (userId: string) => {
//         try {
//             const userRef = doc(db, "users", userId);
//             const currentUserRef = doc(db, "users", currentUserId);

//             // Check if the current user's document exists
//             const currentUserDoc = await getDoc(currentUserRef);
//             if (!currentUserDoc.exists()) {
//                 console.error("Current user document does not exist.");
//                 return;
//             }

//             await updateDoc(userRef, {
//                 followers: arrayRemove(currentUserId)
//             });

//             await updateDoc(currentUserRef, {
//                 following: arrayRemove(userId)
//             });

//             setUsers(users.map(user => {
//                 if (user.id === userId) {
//                     return { ...user, followers: (user.followers || []).filter((id: string) => id !== currentUserId) };
//                 }
//                 return user;
//             }));
//         } catch (error) {
//             console.error("Error unfollowing user: ", error);
//         }
//     };

//     return (
//         <div className="w-100 h-[100vh]">
//             <div className="w-100 h-100 p-4 overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
//                 {users.map((user, index) => (
//                     <div key={index} className="flex gap-2 w-100 p-2 mt-4 rounded-md bg-white shadow">
//                         <div className="w-[20%]">
//                             <FaUserCircle size={50} />
//                         </div>
//                         <div className="flex flex-col w-[80%]">
//                             <span>{user.name}</span>
//                             <div className="flex w-100 gap-2 w-[100%]">
//                                 {!(user.followers || []).includes(currentUserId) ? (
//                                     <span
//                                         onClick={() => handleFollowClick(user.id)}
//                                         className="px-4 w-[50%] flex justify-center py-1 bg-blue-300 text-white cursor-pointer rounded-md hover:bg-blue-600"
//                                     >
//                                         Follow
//                                     </span>
//                                 ) : (
//                                     <>
//                                         <span
//                                             className="px-4 w-[50%] flex justify-center py-1 bg-green-500 cursor-default rounded-md"
//                                         >
//                                             Following
//                                         </span>
//                                         <span
//                                             onClick={() => handleUnfollowClick(user.id)}
//                                             className="px-4 w-[50%] flex justify-center py-1 bg-red-500 text-white cursor-pointer rounded-md hover:bg-red-200"
//                                         >
//                                             Unfollow
//                                         </span>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             <Footer />
//         </div>

//     );
// }

import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, updateDoc, doc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { auth } from "../../firebaseConfig"; // Import Firebase Auth
import Footer from "./footer";
import Loader from "./loader";  // Assuming you have a Loader component

export default function Friends() {
    const [users, setUsers] = useState<any[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [loadingFollow, setLoadingFollow] = useState<{ [key: string]: boolean }>({}); // To track loading state of each button

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Get the current user ID from Firebase Auth
                const userId = auth.currentUser?.uid;
                if (!userId) {
                    console.error("No user is logged in");
                    return;
                }
                setCurrentUserId(userId); // Set the current user ID

                // Fetch all users from Firestore
                const querySnapshot = await getDocs(collection(db, "users"));
                const userList: any[] = [];
                querySnapshot.forEach((doc) => {
                    userList.push({ id: doc.id, ...doc.data() });
                });

                // Filter out the logged-in user from the list
                const filteredUsers = userList.filter(user => user.id !== userId);
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }, []);

    const handleFollowClick = async (userId: string) => {
        setLoadingFollow((prev) => ({ ...prev, [userId]: true })); // Set loading to true for this user

        try {
            const userRef = doc(db, "users", userId);
            const currentUserRef = doc(db, "users", currentUserId);

            // Check if the current user's document exists
            const currentUserDoc = await getDoc(currentUserRef);
            if (!currentUserDoc.exists()) {
                console.error("Current user document does not exist.");
                return;
            }

            await updateDoc(userRef, {
                followers: arrayUnion(currentUserId)
            });

            await updateDoc(currentUserRef, {
                following: arrayUnion(userId)
            });

            setUsers(users.map(user => {
                if (user.id === userId) {
                    return { ...user, followers: [...(user.followers || []), currentUserId] };
                }
                return user;
            }));
        } catch (error) {
            console.error("Error following user: ", error);
        } finally {
            setLoadingFollow((prev) => ({ ...prev, [userId]: false })); // Set loading to false once the action is complete
        }
    };

    const handleUnfollowClick = async (userId: string) => {
        setLoadingFollow((prev) => ({ ...prev, [userId]: true })); // Set loading to true for this user

        try {
            const userRef = doc(db, "users", userId);
            const currentUserRef = doc(db, "users", currentUserId);

            // Check if the current user's document exists
            const currentUserDoc = await getDoc(currentUserRef);
            if (!currentUserDoc.exists()) {
                console.error("Current user document does not exist.");
                return;
            }

            await updateDoc(userRef, {
                followers: arrayRemove(currentUserId)
            });

            await updateDoc(currentUserRef, {
                following: arrayRemove(userId)
            });

            setUsers(users.map(user => {
                if (user.id === userId) {
                    return { ...user, followers: (user.followers || []).filter((id: string) => id !== currentUserId) };
                }
                return user;
            }));
        } catch (error) {
            console.error("Error unfollowing user: ", error);
        } finally {
            setLoadingFollow((prev) => ({ ...prev, [userId]: false })); // Set loading to false once the action is complete
        }
    };

    return (
        <div className="w-100 h-[100vh]">
            <div className="w-100 h-100 p-4 overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
                {users.map((user, index) => (
                    <div key={index} className="flex gap-2 w-100 p-2 mt-4 rounded-md bg-white shadow">
                        <div className="w-[20%]">
                            <FaUserCircle size={50} />
                        </div>
                        <div className="flex flex-col w-[80%]">
                            <span>{user.name}</span>
                            <div className="flex w-100 gap-2 w-[100%]">
                                {!(user.followers || []).includes(currentUserId) ? (
                                    <div className="relative w-[50%]">
                                        <span
                                            onClick={() => handleFollowClick(user.id)}
                                            className="px-4 flex justify-center py-1 bg-blue-300 text-white cursor-pointer rounded-md hover:bg-blue-600"
                                        >
                                            {loadingFollow[user.id] ? "Loading" : "Follow"}
                                        </span>
                                        
                                    </div>
                                ) : (
                                    <>
                                        <span
                                            className="px-4 w-[50%] flex justify-center py-1 bg-green-500 cursor-default rounded-md"
                                        >
                                            Following
                                        </span>
                                        <div className="relative w-[50%]">
                                            <span
                                                onClick={() => handleUnfollowClick(user.id)}
                                                className="px-4 flex justify-center py-1 bg-red-500 text-white cursor-pointer rounded-md hover:bg-red-200"
                                            >
                                                {loadingFollow[user.id] ? 'Loading' : "Unfollow"}
                                            </span>
                                         
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}
