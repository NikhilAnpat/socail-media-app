import { FaUserCircle } from "react-icons/fa";
import { MdGridOn } from "react-icons/md";
import { RiFolderUserFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, DocumentData, getDocs, collection } from "firebase/firestore";
import Footer from "./footer";
import { Navigate, useNavigate } from 'react-router-dom';
import Loader from "./loader";

const db = getFirestore();

export default function UserProfile() {

    const navigate = useNavigate();
    const [activeIcon, setActiveIcon] = useState("grid");
    const [userData, setUserData] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);

    const userId = sessionStorage.getItem('userID');
    useEffect(() => {
        const fetchUserDetails = async () => {
            const userDetailsRef = doc(db, "users", userId || '');
            try {
                const docSnap = await getDoc(userDetailsRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (err) {
                console.error("Error fetching document:", err);
            } finally {
                setLoading(false); // Stop loading once data is fetched
            }
        };

        if (userId) {
            fetchUserDetails();
        }

    }, [userId]);


    const [matchingTagIds, setMatchingTagIds] = useState<string[]>([]);
    const [matchingPosts, setMatchingPosts] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const matchingTags: string[] = [];
                const matchingPostsArray: any[] = [];

                querySnapshot.forEach((doc) => {
                    const userDataAll = doc.data();
                    if (userDataAll.posts && userDataAll.posts.length > 0) {
                        userDataAll.posts.forEach((post: any) => {
                            if (post.tags && post.tags.length > 0) {
                                post.tags.forEach((tag: any) => {
                                    if (tag.uid === userId) {
                                        matchingTags.push(tag.uid); // Add matching tag id to the array
                                        matchingPostsArray.push(post); // Store the post that contains the matching tag
                                    }
                                });
                            }
                        });
                    }
                });

                setMatchingTagIds(matchingTags);
                setMatchingPosts(matchingPostsArray);

            } catch (error) {
            }
        };

        if (userId) {
            fetchUsers();
        }

    }, [userId]);

    if (loading) {
        return <div><Loader/></div>;
    }

    const toogleLogOut = () => {
        sessionStorage.removeItem('userID');
            navigate('/login');

    }

    return (
        <div className="w-full h-[100vh] bg-gray-100">
            {/* Navigation Bar */}
            <div className="overflow-y-auto" style={{ height: "calc(100% - 60px)" }}>
                <nav className="border-b px-4 py-2 bg-white">
                    <div className="flex flex-wrap items-center justify-between md:justify-around">
                        <img className="h-10" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/150px-Instagram_logo.svg.png" alt="Instagram" />
                        <div className="space-x-4">
                            <span className="inline-block bg-blue-500 px-2 py-1 text-white font-semibold text-sm rounded" onClick={toogleLogOut}>Logout</span>
                            <span className="inline-block text-blue-500 font-semibold text-sm">Sign Up</span>
                        </div>
                    </div>
                </nav>

                <main className="bg-gray-100 bg-opacity-25">
                    <div className="lg:w-8/12 lg:mx-auto mb-8">

                        {/* Header Section */}
                        <header className="flex items-center p-2">
                            <div className="w-[30%]">
                                <img className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full border-2 border-pink-600 p-1" src={"https://via.placeholder.com/150"} alt="profile" />
                            </div>
                            <div className="w-[70%]">
                                <div>
                                    <span className="text-[22px]">{userData?.name || "User Name"}</span>
                                </div>
                                <ul className="flex space-x-8 mb-4">
                                    <li>
                                        <span className="font-medium  text-[16px] pr-3">{userData?.posts?.length || 0}</span>
                                        <span className="font-medium  text-[16px]">posts</span>
                                    </li>
                                    <li>
                                        <span className="font-medium  text-[16px] pr-3">{userData?.following?.length || 0}</span>
                                        <span className="font-medium  text-[16px]">following</span>
                                    </li>
                                </ul>
                            </div>
                        </header>

                        {/* Icon Navigation */}
                        <div className="flex justify-center bg-white py-2 shadow-sm">
                            <button
                                className={`px-4 py-2 mx-2 flex items-center space-x-2 ${activeIcon === "grid" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                                onClick={() => setActiveIcon("grid")}
                            >
                                <MdGridOn size={24} />
                                <span>Grid</span>
                            </button>
                            <button
                                className={`px-4 py-2 mx-2 flex items-center space-x-2 ${activeIcon === "folder" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                                onClick={() => setActiveIcon("folder")}
                            >
                                <RiFolderUserFill size={24} />
                                <span>Tagged</span>
                            </button>
                        </div>

                        {/* Content Section */}
                        <div className="p-4">
                            {activeIcon === "grid" && (
                                <div className="grid grid-cols-3 gap-4">
                                    {userData?.posts?.map((post: any, index: any) => (
                                        <div key={index} className="bg-gray-200 aspect-square p-2  rounded-md">
                                            <p className="text-gray-800 mt-2">{post.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeIcon === "folder" && matchingPosts.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {matchingPosts.map((post, index) => (
                                        <div key={index} className="p-4 bg-white shadow rounded">
                                            <p className="text-gray-800">{post.text}</p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {post.tags.map((tag: any, i: number) => (
                                                    <span key={i} className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                        #{tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>


    );
}
