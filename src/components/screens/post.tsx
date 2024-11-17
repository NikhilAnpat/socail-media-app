import { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Footer from "../screens/footer";
import { FaCheckCircle } from "react-icons/fa";
import Loader from "./loader";

const Post: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [tags, setTags] = useState<{ uid: string, name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [friendsList, setFriendsList] = useState<string[]>([]);
    const [followersDetails, setFollowersDetails] = useState<any[]>([]);

    const handlePostSubmit = async () => {
        if (!text) {
            toast.error('Please enter text.');
            return;
        }

        setLoading(true);

        try {
            const user = auth.currentUser;
            if (user) {
                // Update the user's document directly to add the post's text to the `posts` array
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    posts: arrayUnion({
                        text,
                        tags: tags.length > 0 ? tags : [], // Save the tags (empty array if no tags)
                        createdAt: new Date(),
                    }),
                });

                setLoading(false);
                toast.success('Post successfully uploaded!');
                setText(''); // Reset the text input
                setTags([]); // Reset the tags
            }
        } catch (error) {
            setLoading(false);
            toast.error('Error saving the post data.');
            console.error(error);
        }
    };

    const handleTagClick = async (userId: string, userName: string) => {
        setTags((prevTags) => {
            if (!prevTags.some((tag) => tag.uid === userId)) {
                return [...prevTags, { uid: userId, name: userName }];
            }
            return prevTags;
        });
    };

    const handleTagButtonClick = async () => {
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const following = userDoc.data().following || [];
                setFriendsList(following);

                const followersData = await Promise.all(
                    following.map(async (userId: string) => {
                        const userDetailsRef = doc(db, 'users', userId);
                        const userDetailsDoc = await getDoc(userDetailsRef);
                        if (userDetailsDoc.exists()) {
                            return userDetailsDoc.data();
                        }
                        return null;
                    })
                );
                setFollowersDetails(followersData.filter((user) => user !== null));
            }
        }
    };

    return (
        <div className="" >
            <div className="flex flex-col items-center mt-10" style={{ height: 'calc(100vh - 60px)' }}>
                <h2 className="text-2xl mb-4">Create a Post</h2>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your post here..."
                    className="border p-2 mb-4 w-80 rounded h-40"
                />

                <div className="flex space-x-2 mb-4">
                    <button
                        onClick={handleTagButtonClick}
                        className="bg-gray-300 text-black p-2 rounded"
                    >
                        Tag friends
                    </button>
                </div>

                {/* Display Following Users */}
                {friendsList.length > 0 && (
                    <div>
                        <h6 className="text-xl mb-2">Tag friends:</h6>
                        <ul>
                            {followersDetails.map((user, index) => (
                                <li
                                    key={index}
                                    className="mb-2 px-2 py-2 rounded-md shadow bg-gray-50 cursor-pointer"
                                    onClick={() => handleTagClick(user.uid, user.name)} // Add tag on click
                                >
                                    <div className="flex items-center">
                                        <strong>{user.name}</strong>

                                        {tags.some((tag) => tag.uid === user.uid) && (
                                            <FaCheckCircle className="ml-2 text-green-500" />
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    onClick={handlePostSubmit}
                    disabled={loading}
                    className="bg-blue-500 text-white p-2 w-80 mt-2 rounded"
                >
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default Post;
