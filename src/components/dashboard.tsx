import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust to your config
import Footer from './screens/footer';
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegComment, FaShare } from 'react-icons/fa';
import Loader from './screens/loader';

const Dashboard: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = sessionStorage.getItem('userID'); // Logged-in user's ID

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                // Fetch logged-in user's document
                const userRef = doc(db, "users", userId || "");
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const userPosts = (userData.posts || []).map((post: any) => ({
                        ...post,
                        userName: userData.name, // Add logged-in user's name to their posts
                    }));

                    const following = userData.following || [];

                    // Fetch posts from followed users
                    const followingPostsPromises = following.map(async (followedUserId: string) => {
                        const followedUserRef = doc(db, "users", followedUserId);
                        const followedUserSnap = await getDoc(followedUserRef);

                        if (followedUserSnap.exists()) {
                            const followedUserData = followedUserSnap.data();
                            return (followedUserData.posts || []).map((post: any) => ({
                                ...post,
                                userName: followedUserData.name, // Add followed user's name to their posts
                            }));
                        }
                        return [];
                    });

                    const allFollowingPosts = await Promise.all(followingPostsPromises);

                    // Combine and sort posts
                    const combinedPosts = [...userPosts, ...allFollowingPosts.flat()].sort((a: any, b: any) => {
                        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                        return dateB - dateA; // Sort by newest first
                    });

                    setPosts(combinedPosts);
                } else {
                    console.log("User document not found.");
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchPosts();
        }
    }, [userId]);

    return (
        <div className="w-full h-screen flex flex-col bg-gray-100">
            {/* Posts Section */}
            <div className="flex-grow overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                <div className="container mx-auto px-4 py-6">
                    {loading ? (
                        <Loader/>
                    ) : posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div
                                key={index}
                                className="bg-white shadow rounded-lg mb-6 overflow-hidden"
                            >
                                {/* Post Header */}
                                <div className="flex items-center gap-4 px-4 py-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{post.userName}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                post.createdAt?.toDate
                                                    ? post.createdAt.toDate()
                                                    : post.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Post Image */}
                                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                                    {post.imageUrl ? (
                                        <img
                                            src={post.imageUrl}
                                            alt="Post"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <p className="text-gray-500">No image available</p>
                                    )}
                                </div>

                                {/* Post Caption */}
                                <div className="px-4 py-3">
                                    <p className="text-gray-800">{post.text}</p>
                                </div>

                                {/* Tags */}
                                <div className="px-4 py-2 flex flex-wrap gap-2">
                                    {(post.tags || []).map((tag: any, tagIndex: any) => (
                                        <span
                                            key={tagIndex}
                                            className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                                        >
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>

                                {/* Post Footer */}
                                <div className="border-t px-4 py-3 flex justify-between text-gray-600 text-lg">
                                    <button className="flex items-center gap-2 hover:text-red-500">
                                        <AiOutlineHeart className="text-2xl" />
                                        Like
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-blue-500">
                                        <FaRegComment className="text-2xl" />
                                        Comment
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-green-500">
                                        <FaShare className="text-2xl" />
                                        Share
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No posts to display.</p>
                    )}
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
