import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardContent, IonButton, IonInput, IonLabel, IonItem } from '@ionic/react';
import { addPost, getAllPosts, deletePost, PostData } from '../firebaseConfig';
import { toast } from '../toast'; 
import { getCurrentUser } from '../firebaseConfig';

const Posts: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>('Guest');

    useEffect(() => {
        fetchPosts();
        const user = getCurrentUser(); // Get current authenticated user
          if (user) {
            setDisplayName(user.displayName || 'User'); // Set display name from user's profile
          }
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const fetchedPosts = await getAllPosts();
            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };
        

    const handleAddPost = async () => {
        if (!content.trim()) {
            toast('Post content cannot be empty');
            return;
        }

        const currentUser = getCurrentUser(); // Adjust this as per your user fetching method
        if (!currentUser) {
            toast('User not authenticated');
            return;
        }

        const userId = currentUser.uid;

        try {
            const success = await addPost({ content, userId });
            if (success) {
                setContent('');
                fetchPosts(); // Refresh the posts list
                toast('Post added successfully');
            }
        } catch (error) {
            console.error('Error adding post:', error);
            toast('Failed to add post');
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            const success = await deletePost(postId);
            if (success) {
                fetchPosts(); // Refresh the posts list
                toast('Post deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast('Failed to delete post');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Posts</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel position="stacked">Post Content</IonLabel>
                    <IonInput value={content} onIonChange={(e) => setContent(e.detail.value!)} />
                </IonItem>
                <IonButton expand="full" onClick={handleAddPost} disabled={loading}>
                    {loading ? 'Adding...' : 'Add Post'}
                </IonButton>
                {posts.map(post => (
                    <IonCard key={post.id}>
                        <IonCardHeader>
                            <IonTitle>Post by {displayName}</IonTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            {post.content}
                            <br />
                            <small>{new Date(post.createdAt).toLocaleString()}</small>
                            <IonButton color="danger" onClick={() => handleDeletePost(post.id)} expand="full" className="ion-margin-top">
                                Delete
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                ))}
            </IonContent>
        </IonPage>
    );
};

export default Posts;
